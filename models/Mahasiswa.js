const db = require('../models/db/database');

class Mahasiswa {
  static getAll(callback) {
    db.all(
      `SELECT m.*, j.nama_jurusan
       FROM mahasiswa m
       LEFT JOIN jurusan j ON m.id_jurusan = j.id_jurusan`,
      callback
    );
  }

  static getByNIM(nim, callback) {
    db.get(
      `SELECT m.*, j.nama_jurusan
       FROM mahasiswa m
       LEFT JOIN jurusan j ON m.id_jurusan = j.id_jurusan
       WHERE m.nim = ?`,
      [nim],
      callback
    );
  }

  static checkNIMExists(nim, callback) {
    db.get(
      "SELECT nim FROM mahasiswa WHERE nim = ?",
      [nim],
      callback
    );
  }

  static create(mahasiswaData, callback) {
    const { nim, nama, tanggal_lahir, alamat, id_jurusan } = mahasiswaData;
    db.run(
      `INSERT INTO mahasiswa (nim, nama, tanggal_lahir, alamat, id_jurusan)
       VALUES (?, ?, ?, ?, ?)`,
      [nim, nama, tanggal_lahir, alamat, id_jurusan],
      callback
    );
  }

  static delete(nim, callback) {
    db.run('DELETE FROM mahasiswa WHERE nim = ?', [nim], callback);
  }
}

module.exports = Mahasiswa;