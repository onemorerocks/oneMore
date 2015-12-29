import crypto from 'crypto';

import Dao from './dao';
import jwt from 'jsonwebtoken';
import newError from './newError';
import childProcess from 'child_process';
const spawn = childProcess.spawn;

export default class Auth {

  constructor() {
    this.dao = new Dao();
  }

  getJwtKey(decoded, callback) {
    const email = decoded.email;
    if (email) {
      this.dao.get('logins', email).then((record) => {
        if (record) {
          callback(null, record.signingKey);
        } else {
          callback(newError('Email from Jwt has no db record.'));
        }
      }).catch((err) => {
        callback(newError(err));
      });
    } else {
      callback(newError('No email found in the Jwt'));
    }
  }

  validateJwt(decoded, request, callback) {
    callback(null, true);
  }

  signup(email, password) {

    return this._checkPassword(password).then((isPasswordWeak) => {
      if (isPasswordWeak) {
        return {status: 'weak-password'};
      } else {
        const signingKey = crypto.randomBytes(32).toString('hex');
        const passwordSalt = crypto.randomBytes(32).toString('hex');
        const emailVerificationKey = crypto.randomBytes(32).toString('hex');
        const passwordHash = this._hashPassword(password, passwordSalt);

        const data = {
          email: email,
          passwordHash: passwordHash,
          signingKey: signingKey,
          passwordSalt: passwordSalt,
          emailVeriKey: emailVerificationKey,
          emailVerified: 0
        };

        const key = email.toLowerCase();

        return this.dao.createIfDoesNotExist('logins', key, data).then((didCreate) => {
          if (didCreate) {
            const jwt = this._buildJwt(key, signingKey);
            return {status: 'success', emailVerificationKey: emailVerificationKey, jwt: jwt};
          } else {
            return this.dao.get('logins', key).then((existingLogin) => {
              if (existingLogin.emailVerified) {
                return {status: 'exists'};
              } else {
                return {
                  status: 'resend',
                  emailVerificationKey: existingLogin.emailVeriKey
                };
              }
            });
          }
        });
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
          return this._buildJwt(lcaseEmail, data.signingKey);
        } else {
          return false;
        }
      } else {
        return false;
      }
    });
  }

  _buildJwt(lcaseEmail, signingKey) {
    const payload = {email: lcaseEmail};
    return jwt.sign(payload, signingKey, {expiresIn: '14d'});
  }

  _checkPassword(password) {
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
        return this.dao.blindSet('logins', key, {emailVerified: 1}).then(() => {
          return true;
        });
      } else {
        return false;
      }
    });
  }

}
