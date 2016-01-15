import crypto from 'crypto';
import jsonwebtoken from 'jsonwebtoken';
import childProcess from 'child_process';
const spawn = childProcess.spawn;
import { generate } from 'shortid';

import Dao from './Dao';
import newError from './newError';

export default class Auth {

  constructor() {
    this.dao = new Dao();
  }

  validateEncodedJwt(encoded) {
    const jwt = jsonwebtoken.decode(encoded);
    if (jwt) {
      return this._getJwtKey(jwt).then((key) => {
        if (key) {
          return new Promise((resolve) => {
            jsonwebtoken.verify(encoded, key, (err, decoded) => {
              if (!err) {
                resolve(decoded);
              } else {
                resolve(false);
              }
            });
          });
        }
      });
    } else {
      return new Promise((resolve) => resolve());
    }
  }

  _getJwtKey(jwt) {
    const email = jwt.email;
    if (email) {
      return this.dao.get('logins', email).then((record) => {
        if (record) {
          return record.signingKey;
        } else {
          return false;
        }
      });
    } else {
      throw newError('No email found in the Jwt');
    }
  }

  signup(email, password, nickname) {

    return this._checkPasswordDictionary(password, email).then((isPasswordWeak) => {

      const key = email.toLowerCase();

      if (password.toLowerCase() === key) {
        return { status: 'email-password' };
      }

      if (isPasswordWeak) {
        return { status: 'weak-password' };
      } else {
        const signingKey = crypto.randomBytes(32).toString('hex');
        const passwordSalt = crypto.randomBytes(32).toString('hex');
        const emailVerificationKey = crypto.randomBytes(32).toString('hex');
        const passwordHash = this._hashPassword(password, passwordSalt);
        const profileId = generate();

        const data = {
          id: email,
          passwordHash,
          signingKey,
          passwordSalt,
          emailVeriKey: emailVerificationKey,
          emailVerified: 0,
          profileId
        };

        return this.dao.createIfDoesNotExist('logins', key, data).then((didCreate) => {
          if (didCreate) {
            return this._createProfile(data.profileId, nickname).then(() => {
              const jwt = this._buildJwt(key, signingKey);
              return { status: 'success', emailVerificationKey, jwt };
            });
          } else {
            return this._handleExistingLogin(key, password);
          }
        });
      }
    });
  }

  _handleExistingLogin(key, password) {
    return this.dao.get('logins', key).then((existingLogin) => {
      if (existingLogin.emailVerified) {
        return { status: 'exists' };
      } else {
        if (this._hashPassword(password, existingLogin.passwordSalt) === existingLogin.passwordHash) {
          const jwt = this._buildJwt(key, existingLogin.signingKey);
          return {
            status: 'resend',
            emailVerificationKey: existingLogin.emailVeriKey,
            jwt
          };
        } else {
          return { status: 'resendPasswordMismatch' };
        }
      }
    });
  }

  _createProfile(key, nickname) {
    const data = { id: key, nickname };
    return this.dao.createIfDoesNotExist('profiles', key, data).then((didCreate) => {
      if (!didCreate) {
        throw newError('Profile key already exists ' + key);
      }
    });
  }

  _hashPassword(password, salt) {
    const sha = crypto.createHash('sha256');
    sha.update(password);
    sha.update(salt);
    return sha.digest('hex');
  }

  login(email, password) {

    const lcaseEmail = email.toLowerCase();

    return this.dao.get('logins', lcaseEmail).then((data) => {

      if (data) {
        const passwordHash = this._hashPassword(password, data.passwordSalt);
        if (passwordHash === data.passwordHash) {
          return { jwt: this._buildJwt(lcaseEmail, data.signingKey), emailValidated: !!data.emailVerified };
        } else {
          return false;
        }
      } else {
        return false;
      }
    });
  }

  _buildJwt(lcaseEmail, signingKey) {
    const payload = { email: lcaseEmail };
    return jsonwebtoken.sign(payload, signingKey, { expiresIn: '14d' });
  }

  _checkPasswordDictionary(password) {
    return new Promise((resolve, reject) => {

      const ps = spawn('./sgrep-1.0/sgrep', ['-ic', password, 'passwords.txt']);

      ps.stdout.on('data', (data) => {
        if (data.indexOf('1') >= 0) {
          resolve(true);
        } else if (data.indexOf('0') >= 0) {
          resolve(false);
        } else {
          reject(new Error('Unexpected result: ' + data));
        }
      });

      ps.stderr.on('data', (data) => {
        reject(new Error(data));
      });

    });
  }

  verifyEmail(email, emailKey) {
    const key = email.toLowerCase();
    return this.dao.get('logins', key).then((record) => {
      if (record.emailVeriKey === emailKey) {
        return this.dao.blindSet('logins', key, { emailVerified: 1 }).then(() => {
          return true;
        });
      } else {
        return false;
      }
    });
  }

}
