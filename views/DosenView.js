const Table = require("cli-table3");

class DosenView {
  static showMenuDosen(rl, callback) {
    console.log("=========================================");
    console.log("Silahkan pilih opsi dibawah ini:");
    console.log("1. Daftar Dosen");
    console.log("2. Cari Dosen");
    console.log("3. Tambah Dosen");
    console.log("4. Hapus Dosen");
    console.log("5. Kembali ke Menu Utama");
    console.log("=========================================");

    rl.question("Masukkan salah satu nomor dari opsi diatas: ", callback);
  }

  static showDosenList(dosenList) {
    const table = new Table({
      head: ["NIP", "Nama Dosen"],
    });

    dosenList.forEach(row => {
      table.push([row.nip, row.nama_dosen]);
    });

    console.log(table.toString());
  }

  static showDetailDosen(dosen) {
    if (!dosen) {
      console.log(`Dosen dengan NIP ${dosen.nip} tidak ditemukan`);
    } else {
      console.log("======================================");
      console.log(`Detail Dosen dengan NIP ${dosen.nip}`);
      console.log(`NIP: ${dosen.nip}`);
      console.log(`Nama: ${dosen.nama_dosen}`);
    }
    this.show();
  }

  static showSearchDosen(rl, callback) {
    rl.question("Masukkan NIP dosen: ", callback);
  }

  static showTambahDosen(rl, callback) {
    console.log("Input Data Dosen: ");
    rl.question("NIP: ", (nip) => {
      rl.question("Nama Dosen: ", (nama_dosen) => {
        callback({
          nip,
          nama_dosen,
        });
      });
    });
  }

  static showDosenDaftar(dosenList) {
    const table = new Table({
      head: ["NIP", "Nama Dosen"],
    });

    dosenList.forEach((row) => {
      table.push([row.nip, row.nama_dosen]);
    });

    console.log(table.toString());
    this.show();
  }

  static showDosenPrompt(rl, callback) {
    rl.question("NIP: ", callback);
  }

  static showDeletePrompt(rl, callback) {
    rl.question("Masukkan NIP dosen: ", callback);
  }
}

module.exports = DosenView;
