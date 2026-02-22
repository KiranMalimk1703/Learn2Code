document.getElementById("profileForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const profileData = {
    username: localStorage.getItem("username"),
    fullname: document.getElementById("fullname").value,
    age: document.getElementById("age").value,
    level: document.getElementById("level").value,
    language: document.getElementById("language").value
  };

  // Save profile (temporary storage)
  localStorage.setItem("profile", JSON.stringify(profileData));

  alert("Profile created successfully!");

  // Redirect to dashboard (next step)
  window.location.href = "dashboard.html"; // will create next
});
