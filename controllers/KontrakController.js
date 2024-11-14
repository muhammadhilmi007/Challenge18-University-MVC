const Kontrak = require('../models/Kontrak');
const Mahasiswa = require('../models/Mahasiswa');
const Matakuliah = require('../models/Matakuliah');
const Dosen = require('../models/Dosen');
const KontrakView = require('../views/KontrakView');

class KontrakController {
  constructor(rl, menuUtama) {
    this.rl = rl;
    this.menuUtama = menuUtama;
  }

  show() {
    KontrakView.showMenu(this.rl, (choice) => {
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
          this.menuUtama();
          break;
        default:
          console.log("Pilihan tidak valid");
          this.show();
      }
    });
  }

  listKontrak() {
    Kontrak.getAll((err, kontrak) => {
      if (err) {
        console.log(err);
        return this.show();
      }
      KontrakView.showList(kontrak);
      this.show();
    });
  }

  cariKontrak() {
    KontrakView.showSearchPrompt(this.rl, (nim) => {
      Kontrak.getByNIM(nim, (err, kontrak) => {
        if (err) {
          console.log(err);
          return this.show();
        }
        KontrakView.showDetail(kontrak);
        this.show();
      });
    });
  }

  tambahKontrak() {
    // Tampilkan daftar kontrak yang ada
    Kontrak.getAll((err, kontrak) => {
      if (err) {
        console.log(err);
        return this.show();
      }
      KontrakView.showList(kontrak);

      // Proses input kontrak baru
      KontrakView.showAddForm(this.rl, (nim) => {
        // Cek mahasiswa
        Mahasiswa.getByNIM(nim, (err, mahasiswa) => {
          if (err || !mahasiswa) {
            console.log("Mahasiswa tidak ditemukan");
            return this.show();
          }

          // Tampilkan daftar matakuliah
          Matakuliah.getAll((err, matakuliah) => {
            if (err) {
              console.log(err);
              return this.show();
            }
            KontrakView.showMatakuliahList(matakuliah);

            // Input kode matakuliah
            KontrakView.showMatakuliahPrompt(this.rl, (kode_mk) => {
              Matakuliah.getByKodeMK(kode_mk, (err, mk) => {
                if (err || !mk) {
                  console.log("Matakuliah tidak ditemukan");
                  return this.show();
                }

                // Tampilkan daftar dosen
                Dosen.getAll((err, dosen) => {
                  if (err) {
                    console.log(err);
                    return this.show();
                  }
                  KontrakView.showDosenList(dosen);

                  // Input NIP dosen
                  KontrakView.showDosenPrompt(this.rl, (nip) => {
                    Dosen.getByNIP(nip, (err, dsn) => {
                      if (err || !dsn) {
                        console.log("Dosen tidak ditemukan");
                        return this.show();
                      }

                      // Buat kontrak baru
                      const kontrakBaru = {
                        nim: mahasiswa.nim,
                        nama: mahasiswa.nama,
                        nama_mk: mk.nama_mk,
                        nama_dosen: dsn.nama_dosen
                      };

                      Kontrak.create(kontrakBaru, (err) => {
                        if (err) {
                          console.log(err);
                          return this.show();
                        }
                        console.log("Kontrak berhasil ditambahkan");
                        this.listKontrak();
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  }

  hapusKontrak() {
    KontrakView.showDeletePrompt(this.rl, (id) => {
      Kontrak.delete(id, (err) => {
        if (err) {
          console.log(err);
          return this.show();
        }
        console.log(`Kontrak dengan ID ${id} berhasil dihapus`);
        this.show();
      });
    });
  }

  updateNilai() {
    Kontrak.getAll((err, kontrak) => {
      if (err) {
        console.log(err);
        return this.show();
      }
      KontrakView.showList(kontrak);

      KontrakView.showUpdateNilaiForm(this.rl, (data) => {
        const validNilai = ["A", "A+", "A++", "B", "B+", "C", "C+", "D", "D+", "E"];
        
        if (!validNilai.includes(data.nilai.toUpperCase())) {
          console.log("Nilai tidak valid! Gunakan (A/A+/A++/B/B+/C/C+/D/D+/E)");
          return this.show();
        }

        Kontrak.updateNilai(data.nim, data.nilai, (err) => {
          if (err) {
            console.log(err);
            return this.show();
          }
          console.log("Nilai berhasil diupdate");
          this.listKontrak();
        });
      });
    });
  }
}

module.exports = KontrakController;