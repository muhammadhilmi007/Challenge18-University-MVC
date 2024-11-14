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
      head: ["NIP", "Nama Dosen"]
    });

    dosenList.forEach((row) => {
      table.push([row.nip, row.nama_dosen]);
    });

    console.log(table.toString());
  }

  static showDetailDosen(dosen, nip) {
    if (!dosen) {
      console.log(`Dosen dengan NIP ${nip} tidak ditemukan`);
      return;
    }
    console.log("======================================");
    console.log(`Detail Dosen dengan NIP ${dosen.nip}`);
    console.log(`NIP: ${dosen.nip}`);
    console.log(`Nama: ${dosen.nama_dosen}`);
  }

  static showSearchDosen(rl, callback) {
    rl.question("Masukkan NIP dosen: ", callback);
  }

  static showTambahDosen(rl, callback, dosenList) {
    console.log("Lengkapi data dibawah ini:");

    // Tampilkan daftar dosen yang sudah terdaftar
    this.showDosenDaftar(dosenList);


    rl.question("Masukkan NIP Dosen: ", (nip) => {
      rl.question("Masukkan Nama Dosen: ", (nama_dosen) => {
        callback({
          nip,
          nama_dosen
        });
      });
    });
  }

  static showDosenDaftar(dosenList) {
    const table = new Table({
      head: ["NIP", "Nama Dosen"]
    });

    dosenList.forEach(row => {
      table.push([row.nip, row.nama_dosen]);
    });

    console.log("\n");
    console.log("Daftar Dosen yang sudah terdaftar:");
    console.log(table.toString());
    console.log("\n");
  }

  static showDosenPrompt(rl, callback) {
    rl.question("Masukkan NIP Dosen: ", callback);
  }

  static showDeletePrompt(rl, callback) {
    rl.question("Masukkan NIP Dosen: ", callback);
  }
}

module.exports = DosenView;
