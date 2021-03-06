import elasticsearch from 'elasticsearch';
import config from '../config';
import newError from '../backend/newError';

const client = new elasticsearch.Client({
  host: config.elasticsearchUrl
});

export function indexProfile(profile) {
  return new Promise((resolve) => {

    const indexBody = profile;
    delete indexBody.photos;

    client.index({
      index: 'onemore',
      type: 'profile',
      id: profile.id,
      body: indexBody
    }, (error, response) => {
      if (error) {
        throw newError(error);
      } else {
        resolve(response);
      }
    });
  });
}

export function searchProfiles(query) {
  return new Promise((resolve) => {
    client.search({
      index: 'onemore',
      q: query,
      type: 'profile',
      _source: false
    }, (error, response) => {
      if (error) {
        throw newError(error);
      } else {
        const ids = response.hits.hits.map((hit) => hit._id); // eslint-disable-line
        resolve(ids);
      }
    });
  });
}

export function indexExists() {
  return new Promise((resolve) => {
    client.indices.exists({
      index: 'onemore'
    }, (error, response) => {
      if (error) {
        throw newError(error);
      } else {
        resolve(response);
      }
    });
  });
}

export function deleteIndex() {
  return new Promise((resolve) => {
    client.indices.delete({
      index: 'onemore'
    }, (error, response) => {
      if (error) {
        throw newError(error);
      } else {
        resolve(response);
      }
    });
  });
}
