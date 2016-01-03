import gremlin from 'gremlin';
import config from '../config';
import newError from './newError';

const client = gremlin.createClient(config.dbPort, config.dbAddress);

export default class TitanDao {

  _go(script, params) {
    return new Promise((resolve, reject) => {
      client.execute(script, params, (err, results) => {
        if (!err) {
          resolve(results);
        } else {
          reject(newError(err));
        }
      });
    });
  }

  get(table, key) {

  }

  createIfDoesNotExist(table, key, data) {
    const script = `v = graph.addVertex(table);`;
    return this._go(script, {table: table});
  }

  blindSet(table, key, data) {

  }

}
