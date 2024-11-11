const sqlite3 = require("sqlite3").verbose();
const readline = require("readline");
const Table = require("cli-table3");

// Buat Koneksi Database
const db = new sqlite3.Database("university.db");

// Buat Table users jika belum ada
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL)`);

// Buat Table kontrak jika belum ada
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

// Buat Interface Readline
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Class utama untuk sistem universitas
class UniversitySystem {
  constructor() {
    this.currentUser = null;
  }

  // Method untuk memulai Program
  start() {
    console.log("==========================================");
    console.log(
      "Selamat Datang di Universitas XYZ, silahkan login untuk melanjutkan"
    );
    this.login();
  }

  // Method Untuk Login
  login() {
    rl.question("Username: ", (username) => {
      // Cek Username di database
      db.get(
        "SELECT * FROM users WHERE username = ?",
        [username],
        (err, user) => {
          if (err) {
            console.error(err);
            return;
          }

          if (!user) {
            console.log("Username tidak terdaftar");
            this.login();
            return;
          }

          rl.question("Password: ", (password) => {
            if (password === user.password) {
              this.currentUser = user;
              console.log(
                `Welcome, ${user.username}. Your Access Level is : ${user.role}`
              );
              this.showMainMenu();
            } else {
              console.log("Password Salah");
              this.login();
            }
          });
        }
      );
    });
  }

  // Method untuk menampilkan Menu Utama
  showMainMenu() {
    console.log("====================================");
    console.log("Silahkan pilih opsi dibawah ini: ");
    console.log("1. Mahasiswa");
    console.log("2. Jurusan");
    console.log("3. Dosen");
    console.log("4. Matakuliah");
    console.log("5. Kontrak");
    console.log("6. Keluar");
    console.log("====================================");

    rl.question("Masukkan salah satu nomor dari opsi diatas: ", (choice) => {
      switch (choice) {
        case "1":
          new MahasiswaMenu().show();
          break;
        case "2":
          new JurusanMenu().show();
          break;
        case "3":
          new DosenMenu().show();
          break;
        case "4":
          new MatakuliahMenu().show();
          break;
        case "5":
          new KontrakMenu().show();
          break;
        case "6":
          console.log("Anda Telah Keluar dari Program!");
          this.start();
          break;
        default:
          console.log("Pilihan tidak Valid");
          this.showMainMenu();
      }
    });
  }
}

// Class untuk Menu Mahasiswa
class MahasiswaMenu {
  show() {
    console.log("======================================");
    console.log("Silahkan pilih opsi dibawah ini: ");
    console.log("1. Daftar data mahasiswa");
    console.log("2. Cari data mahasiswa");
    console.log("3. Tambah data mahasiswa");
    console.log("4. Hapus data mahasiswa");
    console.log("5. Kembali ke menu utama");
    console.log("======================================");

    rl.question("Masukkan salah satu nomor dari opsi diatas: ", (choice) => {
      switch (choice) {
        case "1":
          this.listMahasiswa();
          break;
        case "2":
          this.cariMahasiswa();
          break;
        case "3":
          this.tambahMahasiswa();
          break;
        case "4":
          this.hapusMahasiswa();
          break;
        case "5":
          new UniversitySystem().showMainMenu();
          break;
        default:
          console.log("Pilihan tidak ValidS");
          this.show();
          break;
      }
    });
  }

  // Method CRUD mahasiswa
  listMahasiswa() {
    db.all(
      `SELECT m.*, j.nama_jurusan
        FROM mahasiswa ,
        LEFT JOIN jurusan j ON m.id_jurusan = j.id_jurusan`,
      (err, rows) => {
        if (err) {
          console.error(err);
          return;
        }

        const Table = new Table({
          head: [
            "Nim",
            "Nama",
            "Tanggal Lahir",
            "Alamat",
            "Kode Jurusan",
            "Nama Jurusan",
          ],
        });

        rows.forEach((rows) => {
          table.push([
            row.nim,
            row.nama,
            row.tanggal_lahir,
            row.alamat,
            row.id_jurusan,
            row.nama_jurusan,
          ]);
        });

        console.log(table.toString());
        this.show();
      }
    );
  }

  cariMahasiswa() {
    rl.question("Masukkan NIM mahasiswa: ", (nim) => {
      db.get(
        `SELECT m.*, j.nama_jurusan
            FROM mahasiswa m
            LEFT JOIN jurusan j ON m.id_jurusan = j.id_jurusan
            WHERE m.nim = ?`,
        [nim],
        (err, row) => {
          if (err) {
            console.error(err);
            return;
          }
        }
      );
    });
  }
}
