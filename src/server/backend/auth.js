import crypto from 'crypto';

import Dao from './dao';
import jwt from 'jsonwebtoken';
import childProcess from 'child_process';
const spawn = childProcess.spawn;

export default class Auth {

  constructor() {
    this.dao = new Dao();
  }

  validate(decoded, request, callback) {

  }

  signup(email, password) {

    return this._checkPassword(password).then((isPasswordWeak) => {
      if (isPasswordWeak) {
        return 'weak-password';
      } else {
        const signingKey = crypto.randomBytes(32).toString('hex');
        const salt = crypto.randomBytes(32).toString('hex');
        const passwordHash = this._hashPassword(password, salt);

        const data = {
          email: email,
          passwordHash: passwordHash,
          signingKey: signingKey,
          passwordSalt: salt
        };

        return this.dao.createIfDoesNotExist('logins', email.toLowerCase(), data).then((didCreate) => {
          if (didCreate) {
            return 'success:' + this._emailVerificationHash(signingKey, salt);
          } else {
            return 'exists';
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
          const payload = {email: lcaseEmail};
          return jwt.sign(payload, data.signingKey, {expiresIn: '14d'});
        } else {
          return false;
        }
      } else {
        return false;
      }
    });
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
          reject('Unexpected result: ' + data);
        }
      });

      ps.stderr.on('data', (data) => {
        reject(data);
      });

    });
  }

  _emailVerificationHash(signingKey, salt) {
    const sha = crypto.createHash('sha256');
    sha.update(signingKey);
    sha.update(salt);
    return sha.digest('hex');
  }

}
