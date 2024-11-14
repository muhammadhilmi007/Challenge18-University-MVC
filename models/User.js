const db = require('../models/db/database');

class User {
  static findByUsername(username, callback) {
    db.get(
      "SELECT * FROM users WHERE username = ?",
      [username],
      callback
    );
  }

  static create(userData, callback) {
    const { username, password, role } = userData;
    db.run(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [username, password, role],
      callback
    );
  }
}

module.exports = User;