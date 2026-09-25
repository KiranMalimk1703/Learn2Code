/**
 * CodeStart / Learn2code — Public User Profile Logic
 */

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const requestedUser = urlParams.get("user") || window.CodeStart.getCurrentUsername() || "Guest User";
  const currentUser = window.CodeStart.getCurrentUsername();

  // 1. Fetch user data
  const userData = await window.CodeStart.getUser(requestedUser);

  if (!userData) {
    document.querySelector(".container").innerHTML = `
      <div style="text-align:center; padding: 100px 20px;">
        <i class="fa-solid fa-user-slash" style="font-size: 50px; color: #64748b; margin-bottom: 20px;"></i>
        <h2>User Not Found</h2>
        <p style="color: #94a3b8; margin-top: 8px;">The user "@${escapeHtml(requestedUser)}" does not exist or has not created a profile yet.</p>
        <a href="community.html" class="nav-btn" style="margin-top: 24px; display: inline-block;">Return to Community</a>
      </div>
    `;
    return;
  }

  const profile = userData.profile || {};
  const scores = userData.scores || {};
  const fullName = profile.fullname || requestedUser;

  // 2. Set Profile Header Details
  document.title = `${fullName} (@${requestedUser}) | CodeStart Profile`;
  document.getElementById("profileFullName").textContent = fullName;
  document.getElementById("profileUsername").textContent = `@${requestedUser}`;
  document.getElementById("profileBio").textContent = profile.bio || "No bio added yet. Busy building code!";
  document.getElementById("profileLevel").innerHTML = `<i class="fa-solid fa-layer-group"></i> Level: ${profile.level || "Beginner"}`;
  document.getElementById("profileLanguage").innerHTML = `<i class="fa-solid fa-terminal"></i> Focus: ${profile.language || "General"}`;
  document.getElementById("profileJoined").innerHTML = `<i class="fa-regular fa-calendar"></i> Joined ${profile.joinedAt || "2026"}`;
  document.getElementById("profileStreak").innerHTML = `<i class="fa-solid fa-fire"></i> ${profile.streak || 1} Day Streak`;

  // Avatar
  const avatarEl = document.getElementById("profileAvatar");
  if (avatarEl && window.CodeStart) {
    const initials = window.CodeStart.getInitials(fullName);
    const style = window.CodeStart.getAvatarStyle(fullName);
    avatarEl.textContent = initials;
    avatarEl.style.background = style.bg;
  }

  // Action Buttons
  const messageBtn = document.getElementById("messageBtn");
  if (messageBtn) {
    if (currentUser === requestedUser) {
      messageBtn.innerHTML = `<i class="fa-solid fa-user-pen"></i> Edit Profile`;
      messageBtn.href = "profile.html";
    } else {
      messageBtn.href = `chat.html?chatWith=${encodeURIComponent(requestedUser)}`;
    }
  }

  const shareBtn = document.getElementById("shareProfileBtn");
  if (shareBtn) {
    shareBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(window.location.href);
      showToast("Profile link copied to clipboard! 📋", "success");
    });
  }

  // 3. Calculate Scorecard & Stats
  const LANGUAGES = ["java", "javascript", "python", "C", "c++"];
  const LANG_LABELS = { java: "Java", javascript: "JavaScript", python: "Python", C: "C", "c++": "C++" };
  const LANG_COLORS = { java: "#ef4444", javascript: "#eab308", python: "#f59e0b", C: "#3b82f6", "c++": "#0ea5e9" };

  let totalCompleted = 0;
  let mcqTotalPercent = 0, mcqCount = 0;
  let quizTotalPercent = 0, quizCount = 0;
  let totalScoreSum = 0;

  const langProgress = {};
  LANGUAGES.forEach(l => {
    langProgress[l] = { completed: 0, total: 6, percent: 0 };
  });

  for (const key in scores) {
    const s = scores[key];
    const pct = s.total > 0 ? Math.round((s.score / s.total) * 100) : 0;
    totalCompleted++;
    totalScoreSum += s.score || 0;

    const parts = key.split("_");
    const lang = parts[0];

    if (lang && langProgress[lang]) {
      langProgress[lang].completed++;
    }

    if (key.includes("MCQ") || key.includes("mcq")) {
      mcqTotalPercent += pct;
      mcqCount++;
    } else if (key.includes("blank") || key.includes("Blank")) {
      quizTotalPercent += pct;
      quizCount++;
    }
  }

  const mcqAvg = mcqCount > 0 ? Math.round(mcqTotalPercent / mcqCount) : 0;
  const quizAvg = quizCount > 0 ? Math.round(quizTotalPercent / quizCount) : 0;
  const totalXP = (totalCompleted * 50) + (totalScoreSum * 10);

  document.getElementById("statExercises").textContent = totalCompleted;
  document.getElementById("statMcqAvg").textContent = `${mcqAvg}%`;
  document.getElementById("statQuizAvg").textContent = `${quizAvg}%`;
  document.getElementById("statTotalXP").textContent = totalXP.toLocaleString();

  // 4. Render Language Mastery Progress Bars
  const langListEl = document.getElementById("langBarsList");
  if (langListEl) {
    langListEl.innerHTML = "";
    LANGUAGES.forEach(lang => {
      const data = langProgress[lang];
      const pct = Math.min(100, Math.round((data.completed / data.total) * 100));
      const color = LANG_COLORS[lang] || "#3b82f6";
      const label = LANG_LABELS[lang] || lang;

      const item = document.createElement("div");
      item.className = "lang-bar-item";
      item.innerHTML = `
        <div class="lang-bar-header">
          <span style="color: #f8fafc;">${label}</span>
          <span style="color: ${color};">${pct}% (${data.completed}/${data.total})</span>
        </div>
        <div class="lang-bar-track">
          <div class="lang-bar-fill" style="width: ${pct}%; background: ${color};"></div>
        </div>
      `;
      langListEl.appendChild(item);
    });
  }

  // 5. Render User's Community Posts
  const userPostsList = document.getElementById("userPostsList");
  if (userPostsList && window.CodeStart) {
    const allPosts = await window.CodeStart.getPosts("all");
    const userPosts = allPosts.filter(p => p.authorUsername === requestedUser);

    if (userPosts.length === 0) {
      userPostsList.innerHTML = `<p style="color: #64748b; font-size: 14px; text-align: center; padding: 20px;">No public posts yet from this user.</p>`;
    } else {
      userPostsList.innerHTML = "";
      userPosts.forEach(post => {
        const postEl = document.createElement("div");
        postEl.className = "profile-post-card";
        postEl.innerHTML = `
          <div class="profile-post-header">
            <span>Topic: <strong>${escapeHtml(post.language || "General")}</strong></span>
            <span>${new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
          <div class="profile-post-text">${escapeHtml(post.content)}</div>
          <div class="profile-post-meta">
            <span><i class="fa-solid fa-heart" style="color: #ec4899;"></i> ${post.likes ? post.likes.length : 0} likes</span>
            <span><i class="fa-regular fa-comment"></i> ${post.comments ? post.comments.length : 0} comments</span>
            ${post.score ? `<span style="color: #f59e0b;"><i class="fa-solid fa-trophy"></i> Scored ${post.score}%</span>` : ""}
          </div>
        `;
        userPostsList.appendChild(postEl);
      });
    }
  }

  function escapeHtml(text) {
    if (!text) return "";
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
});
