import Dao from './Dao';

const dao = new Dao();

export function getLogin(email) {
  const loginPromise = dao.get('logins', email).then((login) => {
    login.emailVerified = !!login.emailVerified;
    login.email = login.id;
    return login;
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
