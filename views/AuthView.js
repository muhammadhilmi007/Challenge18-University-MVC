const User = require("../models/User");

class AuthView {
  static showLoginPrompt(rl, callback) {
    console.log("==========================================");
    console.log("Welcome To Universitas Pendidikan Indonesia");
    console.log("Jln. Setiabudi No. 255");
    console.log("==========================================");
    
    this.askUsername(rl, callback);
  }

  static askUsername(rl, callback) {
    rl.question("Username: ", (username) => {
      this.validateUsername(rl, username, callback);
    });
  }

  static validateUsername(rl, username, callback) {
    // Validasi username dulu sebelum minta password
    User.findByUsername(username, (err, user) => {
      if (err) {
        console.log(err);
        this.askUsername(rl, callback);
        return;
      }

      if (!user) {
        console.log(`Username '${username}' tidak terdaftar`);
        this.askUsername(rl, callback);
        return;
      }

      // Jika username valid, lanjut minta password
      this.askPassword(rl, username, callback);
    });
  }

  static askPassword(rl, username, callback) {
    rl.question("Password: ", (password) => {
      callback(username, password);
    });
  }

  static showLoginSuccess(user) {
    console.log(`Welcome, ${user.username}. Your Access Level is: ${user.role}`);
  }

  static showError(message) {
    console.log(message);
  }
}

module.exports = AuthView;