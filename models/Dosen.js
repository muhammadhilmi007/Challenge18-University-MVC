const db = require("../models/db/database");

class Dosen {
  static getAll(callback) {
    db.all("SELECT * FROM dosen", callback);
  }

  static getByNIP(nip, callback) {
    db.get("SELECT * FROM dosen WHERE nip = ?", [nip], callback);
  }

  static checkNIPExists(nip, callback) {
    db.get("SELECT * FROM dosen WHERE nip = ?", [nip], callback);
  }

  static createDosen(dosenData, callback) {
    const { nip, nama_dosen } = dosenData;
    db.run(
      "INSERT INTO dosen (nip, nama_dosen) VALUES (?, ?)",
      [nip, nama_dosen],
      callback
    );
  }

  static deleteDosen(nip, callback) {
    db.run("DELETE FROM dosen WHERE nip = ?", [nip], callback);
  }
}

module.exports = Dosen;
