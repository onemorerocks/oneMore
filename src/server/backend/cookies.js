const GRANT_COOKIE_OPTIONS = {
  ttl: 14 * 24 * 60 * 60 * 1000,
  isSecure: false,      // warm & fuzzy feelings
  isHttpOnly: false,    // prevent client alteration
  clearInvalid: true, // remove invalid cookies
  strictHeader: true,   // don't allow violations of RFC 6265
  path: '/',
  encoding: 'base64json'
};

const JWT_COOKIE_OPTIONS = {
  ttl: 14 * 24 * 60 * 60 * 1000,
  encoding: 'none',    // we already used JWT to encode
  isSecure: false,      // warm & fuzzy feelings
  isHttpOnly: true,    // prevent client alteration
  clearInvalid: true, // remove invalid cookies
  strictHeader: true,   // don't allow violations of RFC 6265
  path: '/'
};

export default {

  decorateGrant: (response, emailValidated) => {
    response.state('grant', {emailValidated: emailValidated}, GRANT_COOKIE_OPTIONS);
  },

  decorateJwt: (response, jwt) => {
    response.state('token', jwt, JWT_COOKIE_OPTIONS);
  }

};
