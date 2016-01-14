const TWO_WEEKS = 1000 * 60 * 60 * 24 * 14;

const JWT_COOKIE_OPTIONS = {
  ttl: TWO_WEEKS,
  encoding: 'none',    // we already used JWT to encode
  isSecure: false,      // warm & fuzzy feelings
  isHttpOnly: true,    // prevent client alteration
  clearInvalid: true, // remove invalid cookies
  strictHeader: true,   // don't allow violations of RFC 6265
  path: '/'
};

const CLEAR_COOKIE_OPTIONS = {
  ttl: 0,
  path: '/'
};

export default {

  decorateGrant: (response, emailValidated, email) => {
    // response.state('grant', {emailValidated: emailValidated, email: email}, GRANT_COOKIE_OPTIONS);
  },

  decorateJwt: (response, jwt) => {
    response.state('token', jwt, JWT_COOKIE_OPTIONS);
  },

  clear(response) {
    response.state('token', null, CLEAR_COOKIE_OPTIONS);
    // response.state('grant', null, CLEAR_COOKIE_OPTIONS);
  }

};
