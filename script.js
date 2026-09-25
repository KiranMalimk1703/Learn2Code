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
  const navAuthArea = document.getElementById("navAuthArea");
  const mobileToggle = document.getElementById("mobileMenuToggle");
  const mainNav = document.getElementById("mainNav");
  const profileSection = document.getElementById("landingProfileSection");

  // 1. Mobile Menu Toggle
  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener("click", () => {
      mainNav.classList.toggle("active");
    });
  }

  // 2. Auth Display in Nav
  if (currentUser && navAuthArea) {
    let users = JSON.parse(localStorage.getItem("users")) || {};
    let userProfile = users[currentUser]?.profile;
    const displayName = userProfile?.fullname || currentUser;
    const avatarHtml = window.CodeStart 
      ? window.CodeStart.renderAvatarHtml(displayName, 28) 
      : `<span style="width:28px;height:28px;border-radius:50%;background:#3b82f6;display:inline-flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:12px;">${currentUser.substring(0,2).toUpperCase()}</span>`;

    navAuthArea.innerHTML = `
      <a href="dashboard.html" class="nav-user-pill" title="Go to Dashboard">
        ${avatarHtml}
        <span>${displayName}</span>
      </a>
      <a href="#" class="btn-login" id="navLogoutBtn" style="background: #ef4444; border-color: #ef4444; margin-left: 8px;">Logout</a>
    `;

    const logoutBtn = document.getElementById("navLogoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (window.CodeStart) {
          window.CodeStart.logout();
        } else {
          localStorage.removeItem("currentUser");
          window.location.reload();
        }
      });
    }

    // Show landing profile section if exists
    if (profileSection) {
      profileSection.style.display = "block";
      const nameEl = document.getElementById("landingProfileName");
      if (nameEl) nameEl.innerText = currentUser;

      if (userProfile) {
        if (document.getElementById("landingFullname")) document.getElementById("landingFullname").value = userProfile.fullname || "";
        if (document.getElementById("landingAge")) document.getElementById("landingAge").value = userProfile.age || "";
        if (document.getElementById("landingLevel")) document.getElementById("landingLevel").value = userProfile.level || "";
        if (document.getElementById("landingLanguage")) document.getElementById("landingLanguage").value = userProfile.language || "";
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

          if (typeof showToast === "function") {
            showToast("Profile updated successfully! 🚀", "success");
          } else {
            alert("Profile updated successfully!");
          }
        });
      }
    }
  }
});
