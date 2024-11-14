class AuthView {
    static showLoginPrompt(rl, callback) {
      console.log("==========================================");
      console.log("Selamat Datang di Universitas XYZ");
      console.log("Silahkan login untuk melanjutkan");
      console.log("==========================================");
      
      rl.question("Username: ", (username) => {
        rl.question("Password: ", (password) => {
          callback(username, password);
        });
      });
    }
  
    static showLoginSuccess(user) {
      console.log(`Welcome, ${user.username}. Your Access Level is: ${user.role}`);
    }
  
    static showError(message) {
      console.log(message);
    }
  }
  
  module.exports = AuthView;