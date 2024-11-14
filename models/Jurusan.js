const db = require("../models/db/database");

class Jurusan {
  static getAll(callback) {
    db.all("SELECT * FROM jurusan", callback);
  }

  static getByKodeJurusan(kode, callback) {
    db.get("SELECT * FROM jurusan WHERE id_jurusan = ?", [kode], callback);
  }

  static checkKodeJurusanExists(kode, callback) {
    db.get("SELECT * FROM jurusan WHERE id_jurusan = ?", [kode], callback);
  }

  static createJurusan(jurusanData, callback) {
    const { id_jurusan, nama_jurusan } = jurusanData;
    db.run(
      "INSERT INTO jurusan (id_jurusan, nama_jurusan) VALUES (?, ?)",
      [id_jurusan, nama_jurusan],
      callback
    );
  }

  static deleteJurusan(kode, callback) {
    db.run("DELETE FROM jurusan WHERE id_jurusan = ?", [kode], callback);
  }
}

module.exports = Jurusan;
