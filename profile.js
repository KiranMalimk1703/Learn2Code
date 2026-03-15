document.getElementById("profileForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const profileData = {
    username: localStorage.getItem("username") || "Guest User",
    fullname: document.getElementById("fullname").value,
    age: document.getElementById("age").value,
    level: document.getElementById("level").value,
    language: document.getElementById("language").value
  };

  // Save profile (temporary storage)
  localStorage.setItem("profile", JSON.stringify(profileData));

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
