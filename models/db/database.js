const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("university.db");

// Inisialisasi Database
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL)`);

  db.run(`CREATE TABLE IF NOT EXISTS kontrak (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nim TEXT NOT NULL,
        nama TEXT NOT NULL,
        nama_mk TEXT NOT NULL,
        nama_dosen TEXT NOT NULL,
        nilai TEXT,
        FOREIGN KEY (nim) REFERENCES mahasiswa(nim),
        FOREIGN KEY (nama) REFERENCES mahasiswa(nama),
        FOREIGN KEY (nama_mk) REFERENCES matakuliah(nama_mk),
        FOREIGN KEY (nama_dosen) REFERENCES dosen(nama_dosen))`);
});

module.exports = db;
