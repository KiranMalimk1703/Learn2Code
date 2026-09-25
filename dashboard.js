/**
 * CodeStart / Learn2code — Dashboard Logic with Live Social Sync & Animations
 */

const currentUser = localStorage.getItem("currentUser");
let users = JSON.parse(localStorage.getItem("users")) || {};

if (!currentUser || !users[currentUser]) {
  window.location.href = "Login.html";
} else {
  const userObj = users[currentUser];
  const profile = userObj.profile || {};
  const scores = userObj.scores || {};

  // ── Profile Display & Avatar ──
  const firstName = profile.fullname ? (profile.fullname.split(" ")[0] || currentUser) : currentUser;
  const fullName = profile.fullname || currentUser;

  document.getElementById("userName").innerText = firstName;
  document.getElementById("fullName").innerText = fullName;
  document.getElementById("level").innerText = profile.level || "Beginner";
  document.getElementById("language").innerText = profile.language || "Not Set";

  // Render initials avatar in Welcome card
  const welcomeAvatar = document.getElementById("welcomeAvatarWrap");
  if (welcomeAvatar && window.CodeStart) {
    welcomeAvatar.innerHTML = window.CodeStart.renderAvatarHtml(fullName, 54);
  }

  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const navLinks = document.getElementById("navLinks");
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  // ── Score & Stats Calculations ──
  const LANGUAGES = ["java", "javascript", "python", "C", "c++"];
  const LANG_LABELS = { java: "Java", javascript: "JavaScript", python: "Python", C: "C", "c++": "C++" };
  const LANG_COLORS = { java: "#ef4444", javascript: "#eab308", python: "#f59e0b", C: "#3b82f6", "c++": "#0ea5e9" };
  const EXERCISES_PER_LANG = 6;
  const TOTAL_EXERCISES = LANGUAGES.length * EXERCISES_PER_LANG; // 30

  let mcqTotalPercent = 0, mcqCount = 0;
  let quizTotalPercent = 0, quizCount = 0;
  let totalCompleted = 0;

  const langData = {};
  LANGUAGES.forEach(lang => {
    langData[lang] = { completed: 0, total: EXERCISES_PER_LANG, mcqAvg: 0, blankAvg: 0, mcqCount: 0, blankCount: 0 };
  });

  for (const key in scores) {
    const data = scores[key];
    const percent = data.total > 0 ? Math.round((data.score / data.total) * 100) : 0;
    totalCompleted++;

    const parts = key.split("_");
    const lang = parts[0];

    if (lang && langData[lang]) {
      langData[lang].completed++;
      if (key.includes("MCQ") || key.includes("mcq")) {
        mcqTotalPercent += percent;
        mcqCount++;
        langData[lang].mcqAvg += percent;
        langData[lang].mcqCount++;
      } else if (key.includes("blank") || key.includes("Blank")) {
        quizTotalPercent += percent;
        quizCount++;
        langData[lang].blankAvg += percent;
        langData[lang].blankCount++;
      }
    } else {
      if (key.includes("MCQ")) { mcqTotalPercent += percent; mcqCount++; }
      else if (key.includes("blank")) { quizTotalPercent += percent; quizCount++; }
    }
  }

  const mcqAvg = mcqCount > 0 ? Math.round(mcqTotalPercent / mcqCount) : 0;
  const quizAvg = quizCount > 0 ? Math.round(quizTotalPercent / quizCount) : 0;
  const progressValue = Math.min(100, Math.round((totalCompleted / TOTAL_EXERCISES) * 100));

  // Store for sharing
  window.userStatsForShare = { mcqAvg, quizAvg, progressValue, totalCompleted, language: profile.language || "General" };

  // ── Smooth Counter Animation ──
  function animateValue(element, target, duration = 1200, suffix = "") {
    if (!element) return;
    let start = 0;
    const stepTime = Math.abs(Math.floor(duration / (target || 1)));
    const timer = setInterval(() => {
      start++;
      if (start >= target) {
        element.innerHTML = `${target}<small>${suffix}</small>`;
        clearInterval(timer);
      } else {
        element.innerHTML = `${start}<small>${suffix}</small>`;
      }
    }, Math.max(stepTime, 20));
  }

  // ── Animate Circular SVG Rings & Progress Bars ──
  setTimeout(() => {
    // Horizontal progress
    const progressBar = document.getElementById("progress");
    const progressText = document.getElementById("progressValue");
    if (progressBar && progressText) {
      progressBar.style.width = progressValue + "%";
      progressText.innerText = progressValue + "%";
    }

    // Number counters
    const mcqScoreEl = document.getElementById("mcqAvgScore");
    const quizScoreEl = document.getElementById("quizAvgScore");
    if (mcqScoreEl) animateValue(mcqScoreEl, mcqAvg, 1000, "%");
    if (quizScoreEl) animateValue(quizScoreEl, quizAvg, 1000, "%");

    // Circular Rings (radius 38 -> circumference = 238.76)
    const CIRCUMFERENCE = 238.76;
    const mcqRing = document.getElementById("mcqRing");
    const quizRing = document.getElementById("quizRing");

    if (mcqRing) {
      const offset = CIRCUMFERENCE - (mcqAvg / 100) * CIRCUMFERENCE;
      mcqRing.style.strokeDashoffset = offset;
    }
    if (quizRing) {
      const offset = CIRCUMFERENCE - (quizAvg / 100) * CIRCUMFERENCE;
      quizRing.style.strokeDashoffset = offset;
    }
  }, 350);

  // ── Language-wise Progress ──
  const COMPILER_LINKS = {
    java: "java-compiler.html",
    javascript: "javascript-compiler.html",
    python: "python-compiler.html",
    C: "c-compiler.html",
    "c++": "cpp-compiler.html"
  };
  const NOTES_LINKS = {
    java: "java/notes.html",
    javascript: "javascript/notes.html",
    python: "python/notes.html",
    C: "C/notes.html",
    "c++": "c++/notes.html"
  };

  const langBody = document.getElementById("langProgressBody");
  if (langBody) {
    const container = document.createElement("div");
    container.style.cssText = "display:grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; margin-top: 8px;";

    LANGUAGES.forEach(lang => {
      const ld = langData[lang];
      const pct = Math.round((ld.completed / ld.total) * 100);
      const color = LANG_COLORS[lang] || "#3b82f6";
      const label = LANG_LABELS[lang] || lang;
      const notesUrl = NOTES_LINKS[lang] || "languages.html";
      const compUrl = COMPILER_LINKS[lang] || "compiler-select.html";

      const card = document.createElement("div");
      card.style.cssText = `
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.07);
        border-radius: 14px;
        padding: 18px 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      `;
      card.innerHTML = `
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <span style="font-weight:700; font-size:15px; color:#e2e8f0;">${label}</span>
            <span style="font-size:13px; font-weight:700; color:${color};">${pct}%</span>
          </div>
          <div style="height:6px; background:rgba(255,255,255,0.07); border-radius:100px; overflow:hidden;">
            <div style="height:100%; width:${pct}%; background:${color}; border-radius:100px; transition:width 0.8s ease;"></div>
          </div>
          <p style="margin-top:8px; font-size:12px; color:#64748b;">${ld.completed} / ${ld.total} exercises done</p>
        </div>
        <div style="display:flex; gap:8px; margin-top:14px;">
          <a href="${notesUrl}" style="flex:1; text-align:center; padding:6px 0; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); border-radius:8px; font-size:11px; font-weight:600; color:#cbd5e1; text-decoration:none; transition:all 0.2s;">📖 Practice</a>
          <a href="${compUrl}" style="flex:1; text-align:center; padding:6px 0; background:rgba(59,130,246,0.15); border:1px solid rgba(59,130,246,0.25); border-radius:8px; font-size:11px; font-weight:600; color:#60a5fa; text-decoration:none; transition:all 0.2s;">⚡ Compiler</a>
        </div>
      `;
      container.appendChild(card);
    });

    langBody.appendChild(container);
  }

  // ── Gamification Stats ──
  if (window.Gamification) {
    const gStats = Gamification.getUserStats();
    if (gStats) {
      const streakEl = document.getElementById("streakDays");
      const streakSub = document.getElementById("streakSubtitle");
      if (streakEl) streakEl.textContent = `${gStats.streak} Day${gStats.streak === 1 ? "" : "s"}`;
      if (streakSub && gStats.longestStreak > 1) {
        streakSub.textContent = `Personal Best: ${gStats.longestStreak} days! Keep the momentum!`;
      }

      const xpEl = document.getElementById("userTotalXP");
      const lvlTitleEl = document.getElementById("userLevelTitle");
      const xpFill = document.getElementById("xpProgressFill");
      const lvlLabel = document.getElementById("levelLabel");
      const xpNextLabel = document.getElementById("xpToNextLabel");

      if (xpEl) xpEl.innerHTML = `${gStats.xp.toLocaleString()} <small>XP</small>`;
      if (lvlTitleEl) lvlTitleEl.textContent = gStats.title;
      if (lvlLabel) lvlLabel.textContent = `Level ${gStats.level}`;
      if (xpNextLabel) {
        xpNextLabel.textContent = gStats.nextXP ? `${gStats.xp} / ${gStats.nextXP} XP` : "Max Level Reached! 👑";
      }
      if (xpFill) {
        setTimeout(() => {
          xpFill.style.width = `${gStats.levelPercent}%`;
        }, 400);
      }

      const badgesContainer = document.getElementById("badgesContainer");
      const badgesLabel = document.getElementById("badgesCountLabel");
      const allBadges = Gamification.getAllBadges();

      if (badgesLabel) {
        const unlockedCount = allBadges.filter(b => b.unlocked).length;
        badgesLabel.textContent = `${unlockedCount} / ${allBadges.length} Unlocked`;
      }

      if (badgesContainer) {
        badgesContainer.innerHTML = "";
        allBadges.forEach(b => {
          const badgeCard = document.createElement("div");
          badgeCard.className = `badge-card ${b.unlocked ? "unlocked" : "locked"}`;
          badgeCard.title = b.unlocked ? `Unlocked! ${b.description}` : `Locked: ${b.description}`;
          badgeCard.innerHTML = `
            <div class="badge-icon-box" style="border-color: ${b.unlocked ? b.color + '55' : 'rgba(255,255,255,0.08)'}">
              <span>${b.unlocked ? b.icon : "🔒"}</span>
            </div>
            <div class="badge-info">
              <div class="badge-name">${b.name}</div>
              <div class="badge-desc">${b.description}</div>
              <div class="badge-status">${b.unlocked ? "Earned 🌟" : "Locked"}</div>
            </div>
          `;
          badgesContainer.appendChild(badgeCard);
        });
      }
    }
  }

  // ── Admin Panel ──
  if (currentUser === "admin") {
    const adminPanel = document.getElementById("adminPanel");
    if (adminPanel) adminPanel.style.display = "block";
    const tbody = document.getElementById("adminUserList");
    if (tbody) {
      tbody.innerHTML = "";
      for (const user in users) {
        const uProfile = users[user].profile || {};
        const uScores = users[user].scores || {};
        const numScores = Object.keys(uScores).length;
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td style="padding: 8px 0;">${user}</td>
          <td>${uProfile.level || "N/A"}</td>
          <td>${uProfile.language || "N/A"}</td>
          <td>${numScores} items</td>
        `;
        tbody.appendChild(tr);
      }
    }
  }
}

// ── Share Score to Community Action ──
window.shareScoreToCommunity = async function () {
  const stats = window.userStatsForShare;
  if (!stats) return;

  const content = `Just checked my dashboard! I have completed ${stats.totalCompleted} exercises with an average MCQ score of ${stats.mcqAvg}% and Quiz score of ${stats.quizAvg}%! 🚀🔥 Keep building!`;

  try {
    if (window.CodeStart) {
      await window.CodeStart.createPost({
        content,
        language: stats.language || "General",
        score: stats.mcqAvg || 80,
        badge: `${stats.language || "Code"} Achiever`
      });
      showToast("Score shared to the Community Feed! 🎉", "success");
      setTimeout(() => {
        window.location.href = "community.html";
      }, 1000);
    }
  } catch (err) {
    showToast(err.message || "Failed to share score", "error");
  }
};

// ── Navigation ──
function logout() {
  if (window.CodeStart) {
    window.CodeStart.logout();
  } else {
    localStorage.removeItem("currentUser");
    window.location.href = "Login.html";
  }
}

function goHome() {
  window.location.href = "index.html";
}
