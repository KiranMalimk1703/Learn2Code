document.getElementById("profileForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const currentUser = localStorage.getItem("currentUser") || "Guest User";
  
  const profileData = {
    username: currentUser,
    fullname: document.getElementById("fullname").value,
    age: document.getElementById("age").value,
    level: document.getElementById("level").value,
    language: document.getElementById("language").value
  };

  // Save profile to the user's specific object
  let users = JSON.parse(localStorage.getItem("users")) || {};
  if (!users[currentUser]) {
      users[currentUser] = { scores: {} };
  }
  users[currentUser].profile = profileData;
  localStorage.setItem("users", JSON.stringify(users));

  // Switch button state to loading
  const submitBtn = document.getElementById("submitBtn");
  const originalHtml = submitBtn.innerHTML;
  submitBtn.innerHTML = `Saving... <i class="fa-solid fa-spinner fa-spin"></i>`;
  submitBtn.style.opacity = "0.8";
  submitBtn.disabled = true;

  // Let the user see the animation for a second before redirecting
  setTimeout(() => {
    // Redirect to dashboard (next step)
    window.location.href = "dashboard.html";
  }, 1000);
});
