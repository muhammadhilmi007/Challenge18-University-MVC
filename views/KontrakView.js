const Table = require('cli-table3');

class KontrakView {
  static showMenu(rl, callback) {
    console.log("=======================================");
    console.log("Silahkan pilih opsi dibawah ini:");
    console.log("1. Daftar Kontrak");
    console.log("2. Cari Kontrak");
    console.log("3. Tambah Kontrak");
    console.log("4. Hapus Kontrak");
    console.log("5. Update Nilai");
    console.log("6. Kembali ke Menu Utama");
    console.log("=======================================");

    rl.question("Masukkan salah satu nomor dari opsi diatas: ", callback);
  }

  static showList(kontrakList) {
    const table = new Table({
      head: ['ID', 'NIM', 'Nama', 'Mata Kuliah', 'Dosen', 'Nilai']
    });

    kontrakList.forEach(row => {
      table.push([
        row.id,
        row.nim,
        row.nama,
        row.nama_mk,
        row.nama_dosen,
        row.nilai || 'Belum ada nilai'
      ]);
    });

    console.log(table.toString());
  }

  static showDetail(kontrakList, nim) {
    if (kontrakList.length === 0) {
      console.log(`Tidak ada kontrak untuk mahasiswa dengan NIM ${nim} tersebut`);
      return;
    }

    console.log("======================================");
    console.log(`Daftar Kontrak mahasiswa dengan NIM ${kontrakList[0].nim}:`);

    const table = new Table({
      head: ['ID', 'Kode MK', 'Mata Kuliah', 'Dosen', 'Nilai']
    });

    kontrakList.forEach(row => {
      table.push([
        row.id,
        row.kode_mk,
        row.nama_mk,
        row.nama_dosen,
        row.nilai || 'Belum ada nilai'
      ]);
    });

    console.log(table.toString());
  }

  static showSearchPrompt(rl, callback) {
    rl.question("Masukkan NIM Mahasiswa: ", callback);
  }

  static showAddForm(rl, callback) {
    rl.question("Masukkan NIM Mahasiswa: ", callback);
  }

  static showMatakuliahList(matakuliahList) {
    const table = new Table({
      head: ['Kode MK', 'Nama MK', 'SKS']
    });

    matakuliahList.forEach(mk => {
      table.push([mk.kode_mk, mk.nama_mk, mk.sks]);
    });

    console.log("\nDaftar Matakuliah:");
    console.log(table.toString());
  }

  static showMatakuliahPrompt(rl, callback) {
    rl.question("Masukkan Kode Matakuliah: ", callback);
  }

  static showDosenList(dosenList) {
    const table = new Table({
      head: ['NIP', 'Nama Dosen']
    });

    dosenList.forEach(dosen => {
      table.push([dosen.nip, dosen.nama_dosen]);
    });

    console.log("\nDaftar Dosen:");
    console.log(table.toString());
  }

  static showDosenPrompt(rl, callback) {
    rl.question("Masukkan NIP Dosen: ", callback);
  }

  static showDeletePrompt(rl, callback) {
    rl.question("Masukkan ID Kontrak yang akan dihapus: ", callback);
  }

  static showNimPrompt(rl, callback) {
    rl.question("Masukkan NIM Mahasiswa: ", (nim) => {
      callback(nim);
    });
  }

  static showNilaiTable(kontrak) {
    const table = new Table({
      head: ['ID', 'Matakuliah', 'Nilai']
    });

    kontrak.forEach(k => {
      table.push([
        k.id,
        k.nama_mk,
        k.nilai || 'Belum ada nilai'
      ]);
    });

    console.log("\nDaftar Kontrak Kuliah:");
    console.log(table.toString());
  }

  static showUpdateNilaiForm(rl, callback) {
    rl.question("Masukkan ID yang akan diubah: ", (id) => {
      rl.question("Masukkan Nilai (A/A+/A++/B/B+/C/C+/D/D+/E): ", (nilai) => {
        callback({ id, nilai });
      });
    });
  }
}

module.exports = KontrakView;