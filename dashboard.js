// Load profile data
const profile = JSON.parse(localStorage.getItem("profile"));

if (profile) {
  // Extract first name for the welcome header if possible
  const firstName = profile.fullname.split(' ')[0] || "User";
  
  document.getElementById("userName").innerText = firstName;
  document.getElementById("fullName").innerText = profile.fullname;
  document.getElementById("level").innerText = profile.level;
  document.getElementById("language").innerText = profile.language;
} else {
  // fallback if somehow visited without profile
  const savedUsername = localStorage.getItem("username");
  if(savedUsername) {
     document.getElementById("userName").innerText = savedUsername;
     document.getElementById("fullName").innerText = savedUsername;
  }
}

// Animate progress bar slightly after load for smooth visual effect
setTimeout(() => {
  const progressValue = 42; // static for now
  const progressBar = document.getElementById("progress");
  const progressText = document.getElementById("progressValue");
  
  if(progressBar && progressText) {
    progressBar.style.width = progressValue + "%";
    progressText.innerText = progressValue + "%";
  }
}, 300);

// Navigation Functions
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

function goHome() {
  window.location.href = "index.html";
}
