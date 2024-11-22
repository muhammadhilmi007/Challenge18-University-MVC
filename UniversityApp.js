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
class UniversityApp {
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
            console.log(err);
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
          new UniversityApp().showMainMenu();
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
        FROM mahasiswa m
        LEFT JOIN jurusan j ON m.id_jurusan = j.id_jurusan`,
      (err, rows) => {
        if (err) {
          console.log(err);
          return;
        }

        const table = new Table({
          head: [
            "NIM",
            "Nama",
            "Tanggal Lahir",
            "Alamat",
            "Kode Jurusan",
            "Nama Jurusan",
          ],
        });

        rows.forEach((row) => {
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
            console.log(err);
            return;
          }

          if (!row) {
            console.log(`Mahasiswa dengan NIM ${nim} tidak ditemukan`);
          } else {
            console.log("========================================");
            console.log(`Detail Mahasiswa dengan NIM ${nim}`);
            console.log(`1. NIM                 = ${row.nim}`);
            console.log(`2. Nama                = ${row.nama}`);
            console.log(`3. Tanggal_lahir       = ${row.tanggal_lahir}`);
            console.log(`4. Alamat              = ${row.alamat}`);
            console.log(`5. Kode Jurusan        = ${row.id_jurusan}`);
            console.log(`6. Nama Jurusan        = ${row.nama_jurusan}`);
          }
          this.show();
        }
      );
    });
  }

  tambahMahasiswa() {
    console.log("Input Data Mahasiswa:");
    rl.question("NIM: ", (nim) => {
      // Cek Apakah NIM Sudah Ada ?
      db.get("SELECT nim FROM mahasiswa WHERE nim = ?", [nim], (err, row) => {
        if (err) {
          console.log(err);
          return;
        }

        if (row) {
          console.log("NIM sudah terdaftar! Silahkan gunakan NIM lain.");
          this.tambahMahasiswa();
          return;
        }

        rl.question("Nama: ", (nama) => {
          rl.question("Tanggal Lahir (YYYY-MM-DD):", (tgl) => {
            rl.question("Alamat: ", (alamat) => {
              db.all("SELECT * FROM jurusan", (err, jurusan) => {
                if (err) {
                  console.log(err);
                  return;
                }

                const table = new Table({
                  head: ["Kode Jurusan", "Nama Jurusan"],
                });

                jurusan.forEach((j) => {
                  table.push([j.id_jurusan, j.nama_jurusan]);
                });

                console.log("\nDaftar Jurusan:");
                console.log(table.toString());

                rl.question("Kode Jurusan: ", (kodeJurusan) => {
                  db.run(
                    `INSERT INTO mahasiswa (nim, nama, tanggal_lahir, alamat, id_jurusan)
                    VALUES (?, ?, ?, ?, ?)`,
                    [nim, nama, tgl, alamat, kodeJurusan],
                    (err) => {
                      if (err) {
                        console.log(err);
                        return;
                      }
                      console.log(
                        "Mahasiswa telah ditambahkan ke dalam database"
                      );
                      this.listMahasiswa();
                    }
                  );
                });
              });
            });
          });
        });
      });

      // rl.question("Nama: ", (nama) => {
      //   rl.question("Tanggal Lahir (YYYY-MM-DD): ", (tgl) => {
      //     rl.question("Alamat: ", (alamat) => {
      //       db.all("SELECT * FROM jurusan", (err, jurusan) => {
      //         if (err) {
      //           console.error(err);
      //           return;
      //         }

      //         const table = new Table({
      //           head: ["Kode Jurusan", "Nama Jurusan"],
      //         });

      //         jurusan.forEach((j) => {
      //           table.push([j.id_jurusan, j.nama_jurusan]);
      //         });

      //         console.log("\nDaftar Jurusan:");
      //         console.log(table.toString());

      //         rl.question("Kode Jurusan: ", (kodeJurusan) => {
      //           db.run(
      //             `INSERT INTO mahasiswa (nim, nama, tanggal_lahir, alamat, id_jurusan)
      //             VALUES (?, ?, ?, ?, ?)`,
      //             [nim, nama, tgl, alamat, kodeJurusan],
      //             (err) => {
      //               if (err) {
      //                 console.log(`Mohon Maaf Tidak Bisa Menambah Data Mahasiswa`);
      //                 return;
      //               }
      //               console.log(
      //                 "Mahasiswa telah ditambahkan ke dalam database"
      //               );
      //               this.listMahasiswa();
      //             }
      //           );
      //         });
      //       });
      //     });
      //   });
      // });
    });
  }

  hapusMahasiswa() {
    rl.question("Masukkan NIM mahasiswa: ", (nim) => {
      db.run("DELETE FROM mahasiswa WHERE nim = ?", [nim], (err) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log(`Mahasiswa dengan NIM ${nim} berhasil dihapus`);
        this.show();
      });
    });
  }
}

// Class Untuk Menu Jurusan
class JurusanMenu {
  show() {
    console.log("=========================================");
    console.log("Silahkan pilih opsi dibawah ini:");
    console.log("1. Daftar Jurusan");
    console.log("2. Cari Jurusan");
    console.log("3. Tambah Jurusan");
    console.log("4. Hapus Jurusan");
    console.log("5. Kembali ke Menu Utama");
    console.log("=========================================");

    rl.question("Masukkan salah satu nomor dari opsi diatas: ", (choice) => {
      switch (choice) {
        case "1":
          this.listJurusan();
          break;
        case "2":
          this.cariJurusan();
          break;
        case "3":
          this.tambahJurusan();
          break;
        case "4":
          this.hapusJurusan();
          break;
        case "5":
          new UniversityApp().showMainMenu();
          break;
        default:
          console.log("Pilihan tidak Valid");
          this.show;
      }
    });
  }

  // Method CRUD Jurusan
  listJurusan() {
    db.all("SELECT * FROM jurusan", (err, rows) => {
      if (err) {
        console.log(err);
        return;
      }

      const table = new Table({
        head: ["Kode Jurusan", "Nama Jurusan"],
      });

      rows.forEach((row) => {
        table.push([row.id_jurusan, row.nama_jurusan]);
      });

      console.log(table.toString());
      this.show();
    });
  }

  cariJurusan() {
    rl.question("Masukkan kode Jurusan: ", (kode) => {
      db.get(
        "SELECT * FROM jurusan WHERE id_jurusan = ?",
        [kode],
        (err, row) => {
          if (err) {
            console.log(err);
            return;
          }

          if (!row) {
            console.log(`Jurusan dengan Kode ${kode} tidak ditemukan`);
          } else {
            console.log("=======================================");
            console.log(`Detail Jurusan dengan Kode '${kode}'`);
            console.log(`Kode Jurusan: ${row.id_jurusan}`);
            console.log(`Nama Juruasn: ${row.nama_jurusan}`);
          }
          this.show();
        }
      );
    });
  }

  tambahJurusan() {
    console.log("Daftar Jurusan yang ada:");
    db.all("SELECT * FROM jurusan", (err, rows) => {
      if (err) {
        console.log(err);
        return;
      }

      const table = new Table({
        head: ["Kode Jurusan", "Nama Jurusan"],
      });

      rows.forEach((row) => {
        table.push([row.id_jurusan, row.nama_jurusan]);
      });

      console.log(table.toString());
      console.log("\nInput Data Jurusan Baru:");

      rl.question("Kode Jurusan: ", (kode) => {
        rl.question("Nama Jurusan: ", (nama) => {
          db.run(
            "INSERT INTO jurusan (id_jurusan, nama_jurusan) VALUES (?, ?)",
            [kode, nama],
            (err,) => {
              if (err) {
                console.log(err);
                return;
              }
              console.log("Jurusan telah ditambahkan ke dalam database");
              this.listJurusan();
            }
          );
        });
      });
    });
  }

  hapusJurusan() {
    rl.question("Masukkan Kode Jurusan: ", (kode) => {
      db.run("DELETE FROM jurusan WHERE id_jurusan = ?", [kode], (err) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log(`Jurusan dengan kode '${kode}' berhasil dihapus`);
        this.show();
      });
    });
  }
}

// Class untuk Menu Dosen
class DosenMenu {
  show() {
    console.log("=========================================");
    console.log("Silahkan pilih opsi dibawah ini:");
    console.log("1. Daftar Dosen");
    console.log("2. Cari Dosen");
    console.log("3. Tambah Dosen");
    console.log("4. Hapus Dosen");
    console.log("5. Kembali ke Menu Utama");
    console.log("=========================================");

    rl.question("Masukkan salah satu nomor dari opsi diatas: ", (choice) => {
      switch (choice) {
        case "1":
          this.listDosen();
          break;
        case "2":
          this.cariDosen();
          break;
        case "3":
          this.tambahDosen();
          break;
        case "4":
          this.hapusDosen();
          break;
        case "5":
          new UniversityApp().showMainMenu();
          break;
        default:
          console.log("Pilihan Tidak Valid");
          this.show();
      }
    });
  }

  // Method CRUD Dosen
  listDosen() {
    db.all("SELECT * FROM dosen", (err, rows) => {
      if (err) {
        console.log(err);
        return;
      }

      const table = new Table({
        head: ["NIP", "Nama Dosen"],
      });

      rows.forEach((row) => {
        table.push([row.nip, row.nama_dosen]);
      });

      console.log(table.toString());
      this.show();
    });
  }

  cariDosen() {
    rl.question("Masukkan NIP dosen: ", (nip) => {
      db.get("SELECT * FROM dosen WHERE nip = ?", [nip], (err, row) => {
        if (err) {
          console.log(err);
          return;
        }

        if (!row) {
          console.log(`Dosen dengan NIP ${nip} tidak ditemukan`);
        } else {
          console.log("======================================");
          console.log(`Detail Dosen dengan NIP ${nip}`);
          console.log(`NIP: ${row.nip}`);
          console.log(`Nama: ${row.nama_dosen}`);
        }
        this.show();
      });
    });
  }

  tambahDosen() {
    console.log("Input Data Dosen: ");
    rl.question("NIP: ", (nip) => {
      rl.question("Nama Dosen: ", (nama) => {
        db.run(
          "INSERT INTO dosen (nip, nama_dosen) VALUES (?, ?)",
          [nip, nama],
          (err) => {
            if (err) {
              console.log(err);
              return;
            }
            console.log("Dosen telah ditambahkan ke dalam database");
            this.listDosen();
          }
        );
      });
    });
  }

  hapusDosen() {
    rl.question("Masukkan NIP dosen: ", (nip) => {
      db.run("DELETE FROM dosen WHERE nip = ?", [nip], (err) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log(`Dosen dengan NIP ${nip} berhasil dihapus`);
        this.show();
      });
    });
  }
}

// Class untuk Menu Matakuliah
class MatakuliahMenu {
  show() {
    console.log("==========================================");
    console.log("Silahkan pilih opsi dibawah ini:");
    console.log("1. Daftar Matakuliah");
    console.log("2. Cari Matakuliah");
    console.log("3. Tambah Matakuliah");
    console.log("4. Hapus Matakuliah");
    console.log("5. Kembali ke Menu Utama");
    console.log("==========================================");

    rl.question("Masukkan salah satu nomor dari opsi diatas: ", (choice) => {
      switch (choice) {
        case "1":
          this.listMatakuliah();
          break;
        case "2":
          this.cariMatakuliah();
          break;
        case "3":
          this.tambahMatakuliah();
          break;
        case "4":
          this.hapusMatakuliah();
          break;
        case "5":
          new UniversityApp().showMainMenu();
        default:
          console.log("Pilihan Tidak Valid");
          this.show();
      }
    });
  }

  // Method CRUD Matakuliah
  listMatakuliah() {
    db.all("SELECT * FROM matakuliah", (err, rows) => {
      if (err) {
        console.log(err);
        return;
      }

      const table = new Table({
        head: ["Kode MK", "Nama Matakuliah", "SKS"],
      });

      rows.forEach((row) => {
        table.push([row.kode_mk, row.nama_mk, row.sks]);
      });

      console.log(table.toString());
      this.show();
    });
  }

  cariMatakuliah() {
    rl.question("Masukkan Kode Matakuliah: ", (kode) => {
      db.get(
        "SELECT * FROM matakuliah WHERE kode_mk = ?",
        [kode],
        (err, row) => {
          if (err) {
            console.log(err);
            return;
          }

          if (!row) {
            console.log(`Matakuliah dengan kode ${kode} tidak ditemukan`);
          } else {
            console.log("===================================");
            console.log(`Detail Matakuliah dengan Kode ${kode}`);
            console.log(`Kode: ${row.kode_mk}`);
            console.log(`Nama: ${row.nama_mk}`);
            console.log(`SKS: ${row.sks}`);
          }
          this.show();
        }
      );
    });
  }

  tambahMatakuliah() {
    console.log("Input Data Matakuliah:");
    rl.question("Kode Matakuliah: ", (kode) => {
      rl.question("Nama Matakuliah: ", (nama) => {
        rl.question("SKS: ", (sks) => {
          db.run(
            "INSERT INTO matakuliah (kode_mk, nama_mk, sks) VALUES (?, ?, ?)",
            [kode, nama, sks],
            (err) => {
              if (err) {
                console.log(err);
                return;
              }
              console.log("Matakuliah telah ditambahkan ke dalam database");
              this.listMatakuliah();
            }
          );
        });
      });
    });
  }

  hapusMatakuliah() {
    rl.question("Masukkan Kode Matakuliah: ", (kode) => {
      db.run("DELETE FROM matakuliah WHERE kode_mk = ?", [kode], (err) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log(`Matakuliah dengan kode ${kode} berhasil dihapus`);
        this.show();
      });
    });
  }
}

// Class untuk Menu Kontrak
class KontrakMenu {
  show() {
    console.log("=======================================");
    console.log("Silahkan pilih opsi dibawah ini:");
    console.log("1. Daftar Kontrak");
    console.log("2. Cari Kontrak");
    console.log("3. Tambah Kontrak");
    console.log("4. Hapus Kontrak");
    console.log("5. Update Nilai");
    console.log("6. Kembali ke Menu Utama");
    console.log("=======================================");

    rl.question("Masukkan salah satu nomor dari opsi diatas: ", (choice) => {
      switch (choice) {
        case "1":
          this.listKontrak();
          break;
        case "2":
          this.cariKontrak();
          break;
        case "3":
          this.tambahKontrak();
          break;
        case "4":
          this.hapusKontrak();
          break;
        case "5":
          this.updateNilai();
          break;
        case "6":
          new UniversityApp().showMainMenu();
          break;
        default:
          console.log("Pilihan tidak Valid");
          this.show();
      }
    });
  }

  // Method CRUD Kontrak
  listKontrak() {
    db.all(
      `SELECT k.id, m.nim, m.nama, mk.nama_mk, d.nama_dosen, k.nilai
      FROM kontrak k
      JOIN mahasiswa m ON k.nim = m.nim
      JOIN matakuliah mk ON k.nama_mk = mk.nama_mk
      JOIN dosen d ON k.nama_dosen = d.nama_dosen`,
      (err, rows) => {
        if (err) {
          console.log(err);
          return;
        }

        const table = new Table({
          head: ["ID", "NIM", "Nama", "Mata Kuliah", "Dosen", "Nilai"],
        });

        rows.forEach((row) => {
          table.push([
            row.id,
            row.nim,
            row.nama,
            row.nama_mk,
            row.nama_dosen,
            row.nilai || "Belum ada nilai",
          ]);
        });

        console.log(table.toString());
        this.show();
      }
    );
  }

  cariKontrak() {
    console.log("\nDaftar Kontrak yang ada:");
    db.all(
      `SELECT k.id, m.nim, m.nama, mk.nama_mk, d.nama_dosen, k.nilai
      FROM kontrak k
      JOIN mahasiswa m ON k.nim = m.nim
      JOIN matakuliah mk ON k.nama_mk = mk.nama_mk
      JOIN dosen d ON k.nama_dosen = d.nama_dosen`,
      (err, rows) => {
        if (err) {
          console.log(err);
          return;
        }

        const table = new Table({
          head: ["ID", "NIM", "Nama", "Mata kuliah", "Dosen", "Nilai"],
        });

        rows.forEach((row) => {
          table.push([
            row.id,
            row.nim,
            row.nama,
            row.nama_mk,
            row.nama_dosen,
            row.nilai || "Belum ada nilai",
          ]);
        });

        console.log(table.toString());

        rl.question("\nMasukkan NIM Mahasiswa: ", (nim) => {
          db.all(
            `SELECT k.id, k.nim, mk.kode_mk, d.nip, k.nilai
            FROM kontrak k
            JOIN mahasiswa m ON k.nim = m.nim
            JOIN matakuliah mk ON k.nama_mk = mk.nama_mk
            JOIN dosen d ON k.nama_dosen = d.nama_dosen
            WHERE k.nim = ?`,
            [nim],
            (err, rows) => {
              if (err) {
                console.log(err);
                return;
              }

              if (rows.length === 0) {
                console.log(
                  `Tidak ada kontrak untuk mahasiswa dengan NIM ${nim}`
                );
              } else {
                console.log("======================================");
                console.log(
                  `Daftar Kontrak mahasiswa dengan NIM ${nim} adalah:`
                );

                const table = new Table({
                  head: ["ID", "NIM", "Kode MK", "NIP", "Nilai"],
                });

                rows.forEach((row) => {
                  table.push([
                    row.id,
                    row.nim,
                    row.kode_mk,
                    row.nip,
                    row.nilai || "Belum ada Nilai",
                  ]);
                });

                console.log(table.toString());
              }
              this.show();
            }
          );
        });
      }
    );
  }

  tambahKontrak() {
    console.log("Input Data Kontrak:");
    db.all(
      `SELECT k.id, m.nim, m.nama, mk.nama_mk, d.nama_dosen, k.nilai
      FROM kontrak k
      JOIN mahasiswa m ON k.nim = m.nim
      JOIN matakuliah mk ON k.nama_mk = mk.nama_mk
      JOIN dosen d ON k.nama_dosen = d.nama_dosen`,
      (err, rows) => {
        if (err) {
          console.log(err);
          return;
        }

        const table = new Table({
          head: ["ID", "NIM", "Nama", "Mata Kuliah", "Dosen", "Nilai"],
        });

        rows.forEach((row) => {
          table.push([
            row.id,
            row.nim,
            row.nama,
            row.nama_mk,
            row.nama_dosen,
            row.nilai || "Belum ada nilai",
          ]);
        });

        console.log(table.toString());

        rl.question("Masukkan NIM: ", (nim) => {
          db.get("SELECT * FROM mahasiswa WHERE nim = ?", [nim], (err, mhs) => {
            if (err) {
              console.log(err);
              this.show();
              return;
            }

            if (!mhs) {
              console.log("Mahasiswa tidak ditemukan");
              this.show();
              return;
            }

            console.log("\nDaftar Matakuliah:");
            db.all("SELECT * FROM matakuliah", (err, matakuliah) => {
              if (err) {
                console.log(err);
                this.show();
                return;
              }

              const tableMK = new Table({
                head: ["Kode MK", "Nama MK", "SKS"],
              });

              matakuliah.forEach((mk) => {
                tableMK.push([mk.kode_mk, mk.nama_mk, mk.sks]);
              });

              console.log(tableMK.toString());

              rl.question("\nMasukkan Kode Matakuliah: ", (kodeMk) => {
                db.get(
                  "SELECT * FROM matakuliah WHERE kode_mk = ?",
                  [kodeMk],
                  (err, mk) => {
                    if (err || !mk) {
                      console.log("Matakuliah tidak ditemukan");
                      this.show();
                      return;
                    }

                    console.log("\nDaftar Dosen:");
                    db.all("SELECT * FROM dosen", (err, dosen) => {
                      if (err) {
                        console.log(err);
                        this.show();
                        return;
                      }

                      const tableDosen = new Table({
                        head: ["NIP", "Nama Dosen"],
                      });

                      dosen.forEach((d) => {
                        tableDosen.push([d.nip, d.nama_dosen]);
                      });

                      console.log(tableDosen.toString());

                      rl.question("\nMasukkan NIP Dosen: ", (nip) => {
                        db.get(
                          "SELECT * FROM dosen WHERE nip = ?",
                          [nip],
                          (err, dsn) => {
                            if (err || !dsn) {
                              console.log("Dosen tidak ditemukan!");
                              this.show();
                              return;
                            }

                            db.run(
                              `INSERT INTO kontrak (nim, nama, nama_mk, nama_dosen)
                              VALUES (?, ?, ?, ?)`,
                              [nim, mhs.nama, mk.nama_mk, dsn.nama_dosen],
                              (err) => {
                                if (err) {
                                  console.log(
                                    err
                                  );
                                  this.show();
                                  return;
                                }
                                console.log("Kontrak berhasil ditambahkan");
                                this.listKontrak();
                              }
                            );
                          }
                        );
                      });
                    });
                  }
                );
              });
            });
          });
        });
      }
    );
  }

  hapusKontrak() {
    rl.question("Masukkan ID Kontrak: ", (id) => {
      db.run("DELETE FROM kontrak WHERE id = ?", [id], (err) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log(`Kontrak dengan ID ${id} berhasil dihapus`);
        this.show();
      });
    });
  }

  updateNilai() {
    db.all(
      `SELECT k.id, m.nim, m.nama, mk.nama_mk, d.nama_dosen, k.nilai
      FROM kontrak k
      JOIN mahasiswa m ON k.nim = m.nim
      JOIN matakuliah mk ON k.nama_mk = mk.nama_mk
      JOIN dosen d ON k.nama_dosen = d.nama_dosen`,
      (err, rows) => {
        if (err) {
          console.log(err);
          return;
        }

        const table = new Table({
          head: ["ID", "NIM", "Nama", "Mata Kuliah", "Dosen", "Nilai"],
        });

        rows.forEach((row) => {
          table.push([
            row.id,
            row.nim,
            row.nama,
            row.nama_mk,
            row.nama_dosen,
            row.nilai || "Belum ada nilai",
          ]);
        });

        console.log(table.toString());

        rl.question("Masukkan NIM Mahasiswa: ", (nim) => {
          db.get(
            `SELECT k.*, m.nama, mk.nama_mk, d.nama_dosen
            FROM kontrak k
            LEFT JOIN mahasiswa m ON k.nim = m.nim
            LEFT JOIN matakuliah mk ON k.nama_mk = mk.nama_mk
            LEFT JOIN dosen d ON k.nama_dosen = d.nama_dosen
            WHERE k.nim = ?`,
            [nim],
            (err, kontrak) => {
              if (err) {
                console.log(err);
                this.show();
                return;
              }

              if (!kontrak) {
                console.log("NIM tidak ditemukan");
                this.show();
                return;
              }

              console.log("======================================");
              console.log("Detail Kontrak:");
              console.log(`ID: ${kontrak.id}`);
              console.log(`NIM: ${kontrak.nim}`);
              console.log(`Nama: ${kontrak.nama}`);
              console.log(`Mata Kuliah: ${kontrak.nama_mk}`);
              console.log(`Dosen: ${kontrak.nama_dosen}`);
              console.log(
                `Nilai Saat ini: ${kontrak.nilai || "Belum ada nilai"}`
              );
              console.log("======================================");

              rl.question(
                "Masukkan Nilai Baru (A/A+/A++/B/B+/B+/C/C+/D/D+/E): ",
                (nilai) => {
                  // Validasi Nilai
                  const validNilai = [
                    "A",
                    "A+",
                    "A++",
                    "B",
                    "B+",
                    "C",
                    "C+",
                    "D",
                    "D+",
                    "E",
                  ];
                  if (!validNilai.includes(nilai.toUpperCase())) {
                    console.log(
                      "Nilai tidak valid! Gunakan (A/A+/A++/B/B+/B+/C/C+/D/D+/E)"
                    );
                    this.show();
                    return;
                  }

                  db.run(
                    "UPDATE kontrak SET nilai = ? WHERE nim = ?",
                    [nilai.toUpperCase(), nim],
                    (err) => {
                      if (err) {
                        console.log(err);
                        this.show();
                        return;
                      }
                      console.log("Nilai berhasil di update");
                      this.listKontrak();
                    }
                  );
                }
              );
            }
          );
        });
      }
    );
  }
}

// Mulai Program
const university = new UniversityApp();
university.start();
