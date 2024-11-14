const User = require('../models/User');
const AuthView = require('../views/AuthView');

class AuthController {
  static login(username, password, callback) {
    User.findByUsername(username, (err, user) => {
      if (err) {
        console.log(err);
        return callback(err);
      }

      if (!user) {
        AuthView.showError('Username tidak terdaftar');
        return callback(null, false);
      }

      if (password === user.password) {
        AuthView.showLoginSuccess(user);
        return callback(null, user);
      } else {
        AuthView.showError('Password salah');
        return callback(null, false);
      }
    });
  }
}

module.exports = AuthController;