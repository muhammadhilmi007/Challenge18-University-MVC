const db = require("../models/db/database");

class Kontrak {
  static getAll(callback) {
    db.all(
      `SELECT k.id, m.nim, m.nama, mk.nama_mk, d.nama_dosen, k.nilai
       FROM kontrak k
       JOIN mahasiswa m ON k.nim = m.nim
       JOIN matakuliah mk ON k.nama_mk = mk.nama_mk
       JOIN dosen d ON k.nama_dosen = d.nama_dosen`,
      callback
    );
  }

  static getByNIM(nim, callback) {
    db.all(
      `SELECT k.id, k.nim, mk.kode_mk, mk.nama_mk, d.nip, d.nama_dosen, k.nilai
       FROM kontrak k
       JOIN mahasiswa m ON k.nim = m.nim
       JOIN matakuliah mk ON k.nama_mk = mk.nama_mk
       JOIN dosen d ON k.nama_dosen = d.nama_dosen
       WHERE k.nim = ?`,
      [nim],
      callback
    );
  }

  static create(kontrakData, callback) {
    const { nim, nama, nama_mk, nama_dosen } = kontrakData;
    db.run(
      `INSERT INTO kontrak (nim, nama, nama_mk, nama_dosen)
       VALUES (?, ?, ?, ?)`,
      [nim, nama, nama_mk, nama_dosen],
      callback
    );
  }

  static delete(id, callback) {
    db.run("DELETE FROM kontrak WHERE id = ?", [id], callback);
  }

  static updateNilai(nim, nilai, callback) {
    db.run(
      "UPDATE kontrak SET nilai = ? WHERE nim = ?",
      [nilai.toUpperCase(), nim],
      callback
    );
  }
}
module.exports = Kontrak;
