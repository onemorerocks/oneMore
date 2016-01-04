import dynasty from 'dynasty';
import config from '../config';
//import newError from './newError';

const client = dynasty({
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey
});

client.list().then((tables) => {

  if (tables.TableNames.indexOf('logins') === -1) {
    client.create('logins', {
      'key_schema': {
        hash: ['email', 'string']
      }
    });
  }

});

export default class TitanDao {

  get(table, key) {
    return client.table(table).find(key);
  }

  createIfDoesNotExist(table, key, data) {
    return client.table(table).insert(data);
  }

  blindSet(table, key, data) {
    return client.table(table).update(key, data);
  }

}
