const User = require('../models/User');
const AuthView = require('../views/AuthView');

class AuthController {
  constructor(rl) {
    this.rl = rl;
  }

  login(callback) {
    AuthView.showLoginPrompt(this.rl, (username, password) => {
      User.findByUsername(username, (err, user) => {
        if (err) {
          console.log(err);
          return this.login(callback);
        }

        // Username sudah divalidasi di AuthView
        if (password === user.password) {
          AuthView.showLoginSuccess(user);
          callback(null, user);
        } else {
          AuthView.showError('Password salah');
          // Kembali ke input password untuk username yang sama
          AuthView.askPassword(this.rl, username, (username, password) => {
            this.validateLogin(username, password, callback);
          });
        }
      });
    });
  }

  validateLogin(username, password, callback) {
    User.findByUsername(username, (err, user) => {
      if (err) {
        console.log(err);
        return this.login(callback);
      }

      if (password === user.password) {
        AuthView.showLoginSuccess(user);
        callback(null, user);
      } else {
        AuthView.showError('Password salah');
        AuthView.askPassword(this.rl, username, (username, password) => {
          this.validateLogin(username, password, callback);
        });
      }
    });
  }
}

module.exports = AuthController;