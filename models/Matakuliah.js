const db = require("../models/db/database");

class Matakuliah {
  static getAll(callback) {
    db.all("SELECT * FROM matakuliah", callback);
  }

  static getByKodeMK(kode_mk, callback) {
    db.get("SELECT * FROM matakuliah WHERE kode_mk = ?", [kode_mk], callback);
  }

  static checkKodeMKExists(kode_mk, callback) {
    db.get("SELECT * FROM matakuliah WHERE kode_mk = ?", [kode_mk], callback);
  }

  static createMatakuliah(matakuliahData, callback) {
    const { kode_mk, nama_mk, sks } = matakuliahData;
    db.run(
      "INSERT INTO matakuliah (kode_mk, nama_mk, sks) VALUES (?, ?, ?)",
      [kode_mk, nama_mk, sks],
      callback
    );
  }

  static deleteMatakuliah(kode_mk, callback) {
    db.run("DELETE FROM matakuliah WHERE kode_mk = ?", [kode_mk], callback);
  }
}

module.exports = Matakuliah;
