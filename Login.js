let isLogin = true;

function toggleForm() {
  const title = document.getElementById("formTitle");
  const subtitle = document.getElementById("formSubtitle");
  const emailGroup = document.getElementById("emailGroup");
  const button = document.getElementById("submitBtn");
  const toggleQuestion = document.getElementById("toggleQuestion");
  const toggleAction = document.getElementById("toggleAction");

  if (isLogin) {
    // Switch to Sign Up
    title.innerText = "Create Account";
    if (subtitle) subtitle.innerText = "Join CodeStart and begin your journey";
    
    emailGroup.style.display = "block";
    // Small delay to allow display to apply before fading in
    setTimeout(() => emailGroup.style.opacity = "1", 10);
    
    button.innerHTML = `Sign Up <i class="fa-solid fa-arrow-right"></i>`;
    toggleQuestion.innerText = "Already have an account?";
    toggleAction.innerText = "Login";
  } else {
    // Switch to Login
    title.innerText = "Welcome Back";
    if (subtitle) subtitle.innerText = "Login to continue your learning journey";
    
    emailGroup.style.opacity = "0";
    // Wait for opacity transition before hiding
    setTimeout(() => emailGroup.style.display = "none", 300);
    
    button.innerHTML = `Login <i class="fa-solid fa-arrow-right"></i>`;
    toggleQuestion.innerText = "Don't have an account?";
    toggleAction.innerText = "Sign Up";
  }

  isLogin = !isLogin;
}

document.getElementById("authForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  let users = JSON.parse(localStorage.getItem("users")) || {};

  if (isLogin) {
    // Login flow
    if (users[username] && users[username].password === password) {
      localStorage.setItem("currentUser", username);
      window.location.href = "dashboard.html"; // Existing users go to dashboard
    } else {
      alert("Invalid username or password.");
    }
  } else {
    // Sign Up flow
    if (users[username]) {
      alert("Username already exists. Please choose another.");
      return;
    }
    
    const email = document.getElementById("email").value;
    
    // Register new user
    users[username] = {
      email: email,
      password: password, // Note: In a real app, hash passwords. This is a mock.
      profile: null,
      scores: {}
    };
    
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", username);
    
    // Redirect to profile setup
    window.location.href = "profile.html";
  }
});
