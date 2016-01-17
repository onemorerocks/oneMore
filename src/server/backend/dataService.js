import Dao from './Dao';

const dao = new Dao();

export function getProfile(profileId) {
  return dao.get('profiles', profileId);
}

export function getLogin(email) {
  const loginPromise = dao.get('logins', email).then((login) => {
    login.emailVerified = !!login.emailVerified;
    login.email = login.id;
    return getProfile(login.profileId).then((profile) => {
      login.profile = profile;
      return login;
    });
  });
  return loginPromise;
}

export function getLoginByReq(jwt) {
  if (jwt) {
    return getLogin(jwt.email);
  } else {
    return { login: null };
  }
}

export function updateProfile(profile) {
  return dao.blindSet('profiles', profile.id, profile);
}
