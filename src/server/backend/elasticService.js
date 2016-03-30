import elasticsearch from 'elasticsearch';
import config from '../config';

const client = new elasticsearch.Client({
  host: config.elasticsearchUrl
});

export function indexProfile(profile) {
  return new Promise((resolve, reject) => {
    client.index({
      index: 'onemore',
      type: 'profile',
      id: profile.id,
      body: profile
    }, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
}

export function searchProfiles(query) {
  return new Promise((resolve, reject) => {
    client.search({
      index: 'onemore',
      q: query,
      type: 'profile',
      _source: false
    }, (error, response) => {
      if (error) {
        reject(error);
      } else {
        const ids = response.hits.hits.map((hit) => hit._id);
        resolve(ids);
      }
    });
  });
}
