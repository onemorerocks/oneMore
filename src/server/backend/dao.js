import aerospike from 'aerospike';
import config from '../config';

export default class Dao {

  _connect() {

    const rawClient = aerospike.client({
      hosts: [{addr: config.aerospikeAddress, port: config.aerospikePort}]
    });

    return new Promise((resolve, reject) => {
      rawClient.connect((err, client) => {
        if (err.code === aerospike.status.AEROSPIKE_OK) {
          resolve(client);
        } else {
          reject(new Error(err));
        }
      });
    });
  }

  get(table, key) {
    return this._connect().then((client) => {
      return new Promise((resolve, reject) => {
        const dbkey = aerospike.key('stickybros', table, key);
        client.get(dbkey, (err, record, metadata) => {
          if (err.code === aerospike.status.AEROSPIKE_OK) {
            resolve(record);
          } else if (err.code === aerospike.status.AEROSPIKE_ERR_RECORD_NOT_FOUND) {
            reject(new Error('Record not found in table: ' + table + '.' + key));
          } else {
            reject(new Error(err));
          }
          client.close();
        });
      });
    });
  }

  createIfDoesNotExist(table, key, data) {

    return this._connect().then((client) => {
      return new Promise((resolve, reject) => {
        const dbkey = aerospike.key('stickybros', table, key);
        client.exists(dbkey, (err, metadata, existsKey) => {

          if (err.code === aerospike.status.AEROSPIKE_ERR_RECORD_NOT_FOUND) {
            client.put(dbkey, data, (err, putKey) => {
              if (err.code === aerospike.status.AEROSPIKE_OK) {
                resolve(putKey);
              } else {
                reject(new Error(err));
              }
              client.close();
            });
          } else if (err.code === aerospike.status.AEROSPIKE_OK) {
            resolve(false);
            client.close();
          } else {
            reject(new Error(err));
            client.close();
          }

        });
      });
    });

  }

}
