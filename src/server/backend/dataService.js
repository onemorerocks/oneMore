import moment from 'moment';
import Dao from './Dao';
import { indexProfile, searchProfiles } from './elasticService';

const dao = new Dao();

export function getProfile(profileId, otherViewer) {

  if (!profileId) {
    return null;
  }
  const promise = dao.get('profiles', profileId);

  return promise.then((profile) => {
    if (otherViewer) {
      const birthday = moment(new Date(profile.birthYear, profile.birthMonth));
      profile.age = moment().diff(birthday, 'years');
      profile.birthYear = null;
      profile.birthMonth = null;
    }
    return profile;
  });
}

export function getLogin(email) {
  return dao.get('logins', email).then((login) => {
    login.emailVerified = !!login.emailVerified;
    login.email = login.id;
    return getProfile(login.profileId).then((profile) => {
      login.profile = profile;
      return login;
    });
  });
}

export function getLoginByReq(jwt) {
  if (jwt) {
    return getLogin(jwt.email);
  } else {
    return { login: null };
  }
}

export function getProfileByReq(jwt) {
  if (jwt) {
    return getLoginByReq(jwt).then((result) => {
      if (result.profileId) {
        return getProfile(result.profileId);
      } else {
        return null;
      }
    });
  } else {
    return { profile: null };
  }
}

export function updateProfile(jwt, profile) {
  return dao.get('logins', jwt.email).then((login) => {
    profile.id = login.profileId;
    delete profile.clientMutationId;
    return dao.blindSet('profiles', login.profileId, profile).then(() => {
      return getProfile(login.profileId).then((newProfile) => {
        return indexProfile(newProfile).then((indexResult) => {
          return newProfile;
        });
      });
    });
  });
}

export function queryProfiles(query) {
  if (query) {
    return searchProfiles(query).then((profileIds) => {
      if (profileIds && profileIds.length > 0) {
        return dao.getBatch('profiles', profileIds, ['id', 'nickname', 'photos']);
      }
      return [];
    });
  } else {
    return [];
  }
}

export function addPhoto(jwt, location) {
  return getLoginByReq(jwt).then((login) => {
    const data = { hash: location, content: [] };
    return dao.insertIntoList('profiles', login.profileId, 'photos', [data]).then(() => {
      return true;
    });
  });
}
