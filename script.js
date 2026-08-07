function getStarted() {
  const currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    window.location.href = "languages.html";
  } else {
    window.location.href = "Login.html";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = localStorage.getItem("currentUser");
  const loginBtn = document.getElementById("navLoginBtn");
  const logoutBtn = document.getElementById("navLogoutBtn");
  const profileSection = document.getElementById("landingProfileSection");
  
  if (currentUser) {
    // User is logged in
    if (loginBtn) {
      loginBtn.innerText = "Dashboard";
      loginBtn.href = "dashboard.html";
    }
    if (logoutBtn) {
      logoutBtn.style.display = "inline-block";
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("currentUser");
        window.location.reload();
      });
    }
    
    // Show profile section
    if (profileSection) {
      profileSection.style.display = "block";
      document.getElementById("landingProfileName").innerText = currentUser;
      
      let users = JSON.parse(localStorage.getItem("users")) || {};
      let userProfile = users[currentUser]?.profile;
      
      if (userProfile) {
        document.getElementById("landingFullname").value = userProfile.fullname || "";
        document.getElementById("landingAge").value = userProfile.age || "";
        document.getElementById("landingLevel").value = userProfile.level || "";
        document.getElementById("landingLanguage").value = userProfile.language || "";
      }
      
      // Handle form submit
      const profileForm = document.getElementById("landingProfileForm");
      if (profileForm) {
        profileForm.addEventListener("submit", (e) => {
          e.preventDefault();
          
          let updatedProfile = {
            username: currentUser,
            fullname: document.getElementById("landingFullname").value,
            age: document.getElementById("landingAge").value,
            level: document.getElementById("landingLevel").value,
            language: document.getElementById("landingLanguage").value
          };
          
          if (!users[currentUser]) {
            users[currentUser] = { scores: {} };
          }
          users[currentUser].profile = updatedProfile;
          localStorage.setItem("users", JSON.stringify(users));
          
          alert("Profile updated successfully!");
        });
      }
    }
  }
});
