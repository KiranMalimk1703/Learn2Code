/**
 * CodeStart / Learn2code — Profile Setup & Edit
 */

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = localStorage.getItem("currentUser") || "Guest User";
  const fullnameInput = document.getElementById("fullname");
  const ageInput = document.getElementById("age");
  const levelSelect = document.getElementById("level");
  const langSelect = document.getElementById("language");
  const bioInput = document.getElementById("bio");
  const avatarPreview = document.getElementById("avatarPreview");
  const profileForm = document.getElementById("profileForm");
  const submitBtn = document.getElementById("submitBtn");

  // Function to refresh avatar preview
  function updateAvatarPreview(name) {
    if (!avatarPreview) return;
    const displayName = name.trim() || currentUser;
    const initials = window.CodeStart ? window.CodeStart.getInitials(displayName) : displayName.substring(0, 2).toUpperCase();
    const style = window.CodeStart ? window.CodeStart.getAvatarStyle(displayName) : { bg: "linear-gradient(135deg, #3b82f6, #8b5cf6)" };
    avatarPreview.textContent = initials;
    avatarPreview.style.background = style.bg;
  }

  // Pre-fill existing data if present
  let users = JSON.parse(localStorage.getItem("users")) || {};
  const existingProfile = users[currentUser]?.profile;

  if (existingProfile) {
    if (existingProfile.fullname) fullnameInput.value = existingProfile.fullname;
    if (existingProfile.age) ageInput.value = existingProfile.age;
    if (existingProfile.level) levelSelect.value = existingProfile.level;
    if (existingProfile.language) langSelect.value = existingProfile.language;
    if (existingProfile.bio && bioInput) bioInput.value = existingProfile.bio;
    updateAvatarPreview(existingProfile.fullname || currentUser);
  } else {
    updateAvatarPreview(currentUser);
  }

  // Live avatar preview on typing name
  if (fullnameInput) {
    fullnameInput.addEventListener("input", (e) => {
      updateAvatarPreview(e.target.value);
    });
  }

  // Save profile
  profileForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const profileData = {
      fullname: fullnameInput.value.trim(),
      age: parseInt(ageInput.value, 10),
      level: levelSelect.value,
      language: langSelect.value,
      bio: bioInput ? bioInput.value.trim() : "",
      updatedAt: Date.now()
    };

    submitBtn.innerHTML = `Saving Profile... <i class="fa-solid fa-spinner fa-spin"></i>`;
    submitBtn.disabled = true;

    try {
      if (window.CodeStart) {
        await window.CodeStart.saveProfile(profileData);
      } else {
        if (!users[currentUser]) users[currentUser] = { scores: {} };
        users[currentUser].profile = { ...users[currentUser].profile, ...profileData };
        localStorage.setItem("users", JSON.stringify(users));
      }

      if (typeof showToast === "function") {
        showToast("Profile updated successfully! 🚀", "success");
      }

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 700);
    } catch (err) {
      if (typeof showToast === "function") {
        showToast(err.message || "Failed to save profile", "error");
      }
      submitBtn.innerHTML = `Save Profile <i class="fa-solid fa-check"></i>`;
      submitBtn.disabled = false;
    }
  });
});
