// Load profile data
const profile = JSON.parse(localStorage.getItem("profile"));

if (profile) {
  document.getElementById("userName").innerText = profile.fullname;
  document.getElementById("fullName").innerText = profile.fullname;
  document.getElementById("level").innerText = profile.level;
  document.getElementById("language").innerText = profile.language;

  // Fake progress for now
  const progressValue = 40;
  document.getElementById("progress").style.width = progressValue + "%";
  document.getElementById("progressValue").innerText = progressValue + "%";
}

// Logout
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}
function goHome() {
  window.location.href = "index.html";
}
