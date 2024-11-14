const Table = require("cli-table3");

class MahasiswaView {
  static showMenu(rl, callback) {
    console.log("======================================");
    console.log("Silahkan pilih opsi dibawah ini: ");
    console.log("1. Daftar data mahasiswa");
    console.log("2. Cari data mahasiswa");
    console.log("3. Tambah data mahasiswa");
    console.log("4. Hapus data mahasiswa");
    console.log("5. Kembali ke menu utama");
    console.log("======================================");

    rl.question("Masukkan salah satu nomor dari opsi diatas: ", callback);
  }

  static showList(mahasiswaList) {
    const table = new Table({
      head: [
        "NIM",
        "Nama",
        "Tanggal Lahir",
        "Alamat",
        "Kode Jurusan",
        "Nama Jurusan"
      ]
    });

    mahasiswaList.forEach((row) => {
      table.push([
        row.nim,
        row.nama,
        row.tanggal_lahir,
        row.alamat,
        row.id_jurusan,
        row.nama_jurusan || "Belum ada jurusan"
      ]);
    });

    console.log(table.toString());
  }

  static showDetail(mahasiswa, nim) {
    if (!mahasiswa) {
      console.log(`Mahasiswa dengan NIM '${nim}', tidak terdaftar`);
      return;
    }

    console.log("========================================");
    console.log(`Detail Mahasiswa dengan NIM '${mahasiswa.nim}':`);
    console.log(`1. NIM                 = ${mahasiswa.nim}`);
    console.log(`2. Nama                = ${mahasiswa.nama}`);
    console.log(`3. Alamat              = ${mahasiswa.alamat}`);
    console.log(`4. Kode Jurusan        = ${mahasiswa.id_jurusan}`);
  }

  static showSearchPrompt(rl, callback) {
    rl.question("Masukkan NIM mahasiswa: ", callback);
  }

  static showAddForm(rl, callback, mahasiswaList) {
    console.log("Lengkapi data di bawah ini:");

    // Tampilkan tabel mahasiswa yang sudah ada
    const table = new Table({
      head: [
        "NIM",
        "Nama",
        "Tanggal Lahir",
        "Alamat",
        "Kode Jurusan",
        "Nama Jurusan"
      ]
    });

    mahasiswaList.forEach((row) => {
      table.push([
        row.nim,
        row.nama,
        row.tanggal_lahir,
        row.alamat,
        row.id_jurusan,
        row.nama_jurusan || "Belum ada jurusan"
      ]);
    });

    console.log("\nDaftar Mahasiswa yang sudah terdaftar:");
    console.log(table.toString());
    console.log("\n");

    rl.question("Masukkan NIM: ", (nim) => {
      rl.question("Masukkan Nama: ", (nama) => {
        rl.question("Masukkan Tanggal Lahir (YYYY-MM-DD): ", (tanggal_lahir) => {
          rl.question("Masukkan Alamat: ", (alamat) => {
            callback({
              nim,
              nama,
              tanggal_lahir,
              alamat
            });
          });
        });
      });
    });
  }

  static showJurusanList(jurusanList) {
    const table = new Table({
      head: ["Kode Jurusan", "Nama Jurusan"]
    });

    jurusanList.forEach((jurusan) => {
      table.push([jurusan.id_jurusan, jurusan.nama_jurusan]);
    });

    console.log("\nDaftar Jurusan:");
    console.log(table.toString());
  }

  static showJurusanPrompt(rl, callback) {
    rl.question("Kode Jurusan: ", callback);
  }

  static showDeletePrompt(rl, callback) {
    rl.question("Masukkan NIM mahasiswa yang akan dihapus: ", callback);
  }
}

module.exports = MahasiswaView;
