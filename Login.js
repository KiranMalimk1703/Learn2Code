let isLogin = true;

function toggleForm() {
  const title = document.getElementById("formTitle");
  const emailField = document.querySelector(".signup-only");
  const button = document.querySelector(".btn");
  const toggleText = document.querySelector(".toggle-text");

  if (isLogin) {
    title.innerText = "Sign Up";
    emailField.style.display = "block";
    button.innerText = "Create Account";
    toggleText.innerHTML = `Already have an account? <span onclick="toggleForm()">Login</span>`;
  } else {
    title.innerText = "Login";
    emailField.style.display = "none";
    button.innerText = "Login";
    toggleText.innerHTML = `Don’t have an account? <span onclick="toggleForm()">Sign Up</span>`;
  }

  isLogin = !isLogin;
}

document.getElementById("authForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const username = document.getElementById("username").value;

  // Save user temporarily
  localStorage.setItem("username", username);

  // Redirect to profile page
  window.location.href = "profile.html";
});



