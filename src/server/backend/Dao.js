import aerospike from 'aerospike';
import config from '../config';
import newError from './newError';

const op = aerospike.operator;

export default class Dao {

  _connect() {

    const clientOptions = {
      hosts: [{ addr: config.aerospikeAddress, port: config.aerospikePort }]
    };

    return new Promise((resolve) => {
      aerospike.connect(clientOptions, (err, client) => {
        if (err) {
          throw newError(err);
        } else {
          resolve(client);
        }
      });
    });
  }

  _connectPromise(cb) {
    return this._connect().then((client) => {
      return new Promise((resolve) => {
        cb(client, resolve);
      }).then((result) => {
        client.close(false);
        return result;
      }).catch((reason) => {
        try {
          client.close(false);
        } catch (e) {
          throw newError('could not close connection', e);
        }
        throw newError(reason);
      });
    });
  }

  get(table, key) {
    return this._connectPromise((client, resolve) => {
      const dbkey = aerospike.key('onemore', table, key);
      client.get(dbkey, (err, record, metadata) => {
        if (!err) {
          resolve(record);
        } else if (err === aerospike.status.AEROSPIKE_ERR_RECORD_NOT_FOUND) {
          resolve(null);
        } else {
          throw newError(err);
        }
      });
    });
  }

  getBatch(table, keys, bins) {
    return this._connectPromise((client, resolve) => {
      const dbkeys = keys.map((key) => aerospike.key('onemore', table, key));
      client.batchSelect(dbkeys, bins, (err, results) => {
        if (!err) {
          const records = results.map((result) => {
            if (result.record) {
              return result.record;
            } else {
              return null;
            }
          });
          resolve(records);
        } else {
          throw newError(err);
        }
      });
    });
  }

  _createPolicy = {
    exists: aerospike.policy.exists.CREATE
  };

  createIfDoesNotExist(table, key, data) {
    return this._connectPromise((client, resolve) => {
      const dbkey = aerospike.key('onemore', table, key);
      client.put(dbkey, data, null, this._createPolicy, (err, putKey) => {
        if (!err) {
          resolve(putKey);
        } else if (err === aerospike.status.AEROSPIKE_ERR_RECORD_EXISTS) {
          resolve(false);
        } else {
          throw newError(err);
        }
      });
    });
  }

  _setPolicy = {
    exists: aerospike.policy.exists.UPDATE
  };

  blindSet(table, key, data) {
    return this._connectPromise((client, resolve) => {
      const dbkey = aerospike.key('onemore', table, key);
      client.put(dbkey, data, null, this._setPolicy, (err, putKey) => {
        if (!err) {
          resolve(putKey);
        } else if (err === aerospike.status.AEROSPIKE_ERR_RECORD_NOT_FOUND) {
          throw newError('Record not found in table: ' + table + '.' + key);
        } else {
          throw newError(err);
        }
      });
    });
  }

  insertIntoList(table, key, field, array) {
    return this._connectPromise((client, resolve) => {
      const ops = array.map((item) => {
        return op.listAppend(field, item);
      });
      const dbkey = aerospike.key('onemore', table, key);
      client.operate(dbkey, ops, (err, record) => {
        if (!err) {
          resolve(record);
        } else if (err === aerospike.status.AEROSPIKE_ERR_RECORD_NOT_FOUND) {
          throw newError('Record not found in table: ' + table + '.' + key);
        } else {
          throw newError(err);
        }
      });

    });
  }

  scan(table, goodFunc, errorFunc) {
    return this._connectPromise((client, resolve) => {
      const scan = client.scan('onemore', table);
      scan.concurrent = true;
      scan.nobins = false;

      const stream = scan.foreach();
      stream.on('data', (record) => {
        goodFunc(record);
      });

      stream.on('error', (error) => {
        if (errorFunc) {
          errorFunc(error);
        }
      });

      stream.on('end', () => {
        resolve(true);
      });

    });
  }

}
