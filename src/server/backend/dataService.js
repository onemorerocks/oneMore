import Dao from './dao';

const dao = new Dao();

export function getLoginByReq(jwt) {
  if (jwt) {
    return getLogin(jwt.email);
  } else {
    return {login: null};
  }
}

export function getLogin(email) {
  const loginPromise = dao.get('logins', email).then((login) => {
    login.emailVerified = !!login.emailVerified;
    login.id = login.email;
    return login;
  });
  return loginPromise;
}
