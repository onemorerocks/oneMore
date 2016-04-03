import aerospike from 'aerospike';
import config from '../config';
import newError from './newError';

const op = aerospike.operator;

export default class Dao {

  _connect() {

    const rawClient = aerospike.client({
      hosts: [{ addr: config.aerospikeAddress, port: config.aerospikePort }]
    });

    return new Promise((resolve, reject) => {
      rawClient.connect((err, client) => {
        if (err.code === aerospike.status.AEROSPIKE_OK) {
          resolve(client);
        } else {
          reject(newError(err));
        }
      });
    });
  }

  _connectPromise(cb) {
    return this._connect().then((client) => {
      return new Promise((resolve, reject) => {
        cb(client, resolve, reject);
      }).then((result) => {
        client.close();
        return result;
      }).catch((reason) => {
        try {
          client.close();
        } catch (e) {
          throw newError('could not close connection', e);
        }
        throw newError(reason);
      });
    });
  }

  get(table, key) {
    return this._connectPromise((client, resolve, reject) => {
      const dbkey = aerospike.key('onemore', table, key);
      client.get(dbkey, (err, record, metadata) => {
        if (err.code === aerospike.status.AEROSPIKE_OK) {
          resolve(record);
        } else if (err.code === aerospike.status.AEROSPIKE_ERR_RECORD_NOT_FOUND) {
          resolve(false);
        } else {
          reject(newError(err));
        }
      });
    });
  }

  getBatch(table, keys, bins) {
    return this._connectPromise((client, resolve, reject) => {
      const dbkeys = keys.map((key) => aerospike.key('onemore', table, key));
      client.batchSelect(dbkeys, bins, (err, results) => {
        if (err.code === aerospike.status.AEROSPIKE_OK) {
          const records = results.map((result) => {
            if (result.record) {
              return result.record;
            } else {
              return null;
            }
          });
          resolve(records);
        } else {
          reject(newError(err));
        }
      });
    });
  }

  _createPolicy = {
    exists: aerospike.policy.exists.CREATE
  };

  createIfDoesNotExist(table, key, data) {
    return this._connectPromise((client, resolve, reject) => {
      const dbkey = aerospike.key('onemore', table, key);
      client.put(dbkey, data, null, this._createPolicy, (err, putKey) => {
        if (err.code === aerospike.status.AEROSPIKE_OK) {
          resolve(putKey);
        } else if (err.code === aerospike.status.AEROSPIKE_ERR_RECORD_EXISTS) {
          resolve(false);
        } else {
          reject(newError(err));
        }
      });
    });
  }

  _setPolicy = {
    exists: aerospike.policy.exists.UPDATE
  };

  blindSet(table, key, data) {
    return this._connectPromise((client, resolve, reject) => {
      const dbkey = aerospike.key('onemore', table, key);
      client.put(dbkey, data, null, this._setPolicy, (err, putKey) => {
        if (err.code === aerospike.status.AEROSPIKE_OK) {
          resolve(putKey);
        } else if (err.code === aerospike.status.AEROSPIKE_ERR_RECORD_NOT_FOUND) {
          reject(newError('Record not found in table: ' + table + '.' + key));
        } else {
          reject(newError(err));
        }
      });
    });
  }

  insertIntoList(table, key, field, array) {
    return this._connectPromise((client, resolve, reject) => {
      const ops = array.map((item) => {
        return op.listAppend(field, item);
      });
      const dbkey = aerospike.key('onemore', table, key);
      client.operate(dbkey, ops, (err, record) => {
        if (err.code === aerospike.status.AEROSPIKE_OK) {
          resolve(record);
        } else if (err.code === aerospike.status.AEROSPIKE_ERR_RECORD_NOT_FOUND) {
          reject(newError('Record not found in table: ' + table + '.' + key));
        } else {
          reject(newError(err));
        }
      });

    });
  }

}
