/**
 * CodeStart / Learn2code — Enhanced Auth Logic
 * Integrates with Firebase Auth & CodeStart Dual-Mode Social Engine
 */

let isLogin = true;

// ── DOM Elements ──
const authForm = document.getElementById("authForm");
const title = document.getElementById("formTitle");
const subtitle = document.getElementById("formSubtitle");
const emailGroup = document.getElementById("emailGroup");
const emailInput = document.getElementById("email");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const submitBtn = document.getElementById("submitBtn");
const toggleQuestion = document.getElementById("toggleQuestion");
const toggleAction = document.getElementById("toggleAction");
const togglePasswordBtn = document.getElementById("togglePasswordBtn");
const strengthWrap = document.getElementById("passwordStrengthWrap");
const strengthFill = document.getElementById("passwordStrengthFill");
const strengthText = document.getElementById("passwordStrengthText");
const rememberMeCheckbox = document.getElementById("rememberMeCheckbox");

// ── Remember Me Pre-fill ──
document.addEventListener("DOMContentLoaded", () => {
  const remembered = localStorage.getItem("codestart_remembered_user");
  if (remembered && usernameInput) {
    usernameInput.value = remembered;
  }
});

// ── Toggle Password Visibility ──
if (togglePasswordBtn) {
  togglePasswordBtn.addEventListener("click", () => {
    const isPass = passwordInput.type === "password";
    passwordInput.type = isPass ? "text" : "password";
    togglePasswordBtn.className = isPass
      ? "fa-regular fa-eye-slash toggle-password"
      : "fa-regular fa-eye toggle-password";
  });
}

// ── Password Strength Calculation ──
function evaluatePasswordStrength(pass) {
  if (!pass) return { score: 0, text: "Too short", color: "#64748b", pct: 0 };
  let score = 0;
  if (pass.length >= 6) score += 1;
  if (pass.length >= 10) score += 1;
  if (/[0-9]/.test(pass)) score += 1;
  if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score += 1;
  if (/[^A-Za-z0-9]/.test(pass)) score += 1;

  if (score <= 2) {
    return { score, text: "Weak", color: "#ef4444", pct: 33 };
  } else if (score <= 3) {
    return { score, text: "Medium", color: "#f59e0b", pct: 66 };
  } else {
    return { score, text: "Strong 🔥", color: "#10b981", pct: 100 };
  }
}

if (passwordInput) {
  passwordInput.addEventListener("input", () => {
    if (isLogin) return;
    const strength = evaluatePasswordStrength(passwordInput.value);
    strengthFill.style.width = strength.pct + "%";
    strengthFill.style.backgroundColor = strength.color;
    strengthText.textContent = strength.text;
    strengthText.style.color = strength.color;
  });
}

// ── Toggle Form Mode (Login vs Sign Up) ──
function toggleForm() {
  if (isLogin) {
    // Switch to Sign Up
    title.innerText = "Create Account";
    if (subtitle) subtitle.innerText = "Join the CodeStart social learning community";
    
    emailGroup.style.display = "block";
    setTimeout(() => (emailGroup.style.opacity = "1"), 10);
    if (emailInput) emailInput.setAttribute("required", "true");
    
    if (strengthWrap) strengthWrap.style.display = "block";

    submitBtn.innerHTML = `Sign Up <i class="fa-solid fa-arrow-right"></i>`;
    toggleQuestion.innerText = "Already have an account?";
    toggleAction.innerText = "Login";
  } else {
    // Switch to Login
    title.innerText = "Welcome Back";
    if (subtitle) subtitle.innerText = "Login to continue your learning journey";
    
    emailGroup.style.opacity = "0";
    setTimeout(() => (emailGroup.style.display = "none"), 300);
    if (emailInput) emailInput.removeAttribute("required");

    if (strengthWrap) strengthWrap.style.display = "none";

    submitBtn.innerHTML = `Login <i class="fa-solid fa-arrow-right"></i>`;
    toggleQuestion.innerText = "Don't have an account?";
    toggleAction.innerText = "Sign Up";
  }

  isLogin = !isLogin;
}

// ── Submit Form Handler ──
authForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const userOrEmail = usernameInput.value.trim();
  const password = passwordInput.value;
  const email = emailInput ? emailInput.value.trim() : "";

  // Remember Me persistence
  if (rememberMeCheckbox && rememberMeCheckbox.checked) {
    localStorage.setItem("codestart_remembered_user", userOrEmail);
  } else {
    localStorage.removeItem("codestart_remembered_user");
  }

  // Visual loading state
  const origBtnHtml = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Processing...`;

  try {
    if (isLogin) {
      // ── Login Flow ──
      const result = await window.CodeStart.login(userOrEmail, password);
      showToast(`Welcome back, ${result.user}! 🚀`, "success");

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 700);
    } else {
      // ── Signup Flow ──
      // Validate strength
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long.");
      }

      const username = userOrEmail.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase() || ("user_" + Math.floor(Math.random()*1000));
      const result = await window.CodeStart.signup(username, email || `${username}@codestart.dev`, password);
      
      showToast(`Account created! Let's set up your profile 🎉`, "success");

      setTimeout(() => {
        window.location.href = "profile.html";
      }, 800);
    }
  } catch (err) {
    showToast(err.message || "An error occurred. Please try again.", "error");
    submitBtn.disabled = false;
    submitBtn.innerHTML = origBtnHtml;
  }
});
