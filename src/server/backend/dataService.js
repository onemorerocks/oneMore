import Dao from './Dao';

const dao = new Dao();

export function getProfile(profileId) {
  return dao.get('profiles', profileId).then((profile) => {
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
      return profile;
    });
  });
}
