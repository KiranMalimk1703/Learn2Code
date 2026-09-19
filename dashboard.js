const currentUser = localStorage.getItem("currentUser");
let users = JSON.parse(localStorage.getItem("users")) || {};

if (!currentUser || !users[currentUser]) {
  window.location.href = "Login.html";
} else {
  const profile = users[currentUser].profile;
  const scores = users[currentUser].scores || {};

  // --- Profile Display ---
  if (profile) {
    const firstName = profile.fullname ? (profile.fullname.split(' ')[0] || currentUser) : currentUser;
    document.getElementById("userName").innerText = firstName;
    document.getElementById("fullName").innerText = profile.fullname || currentUser;
    document.getElementById("level").innerText = profile.level || "Not Set";
    document.getElementById("language").innerText = profile.language || "Not Set";
  } else {
    document.getElementById("userName").innerText = currentUser;
    document.getElementById("fullName").innerText = currentUser;
  }

  // --- Score Calculations ---
  const LANGUAGES = ["java", "javascript", "python", "C", "c++"];
  const LANG_LABELS = { java: "Java", javascript: "JavaScript", python: "Python", C: "C", "c++": "C++" };
  const LANG_COLORS = { java: "#ef4444", javascript: "#eab308", python: "#f59e0b", C: "#3b82f6", "c++": "#0ea5e9" };

  // Each language has 3 MCQs + 3 blanks = 6 exercises max
  const EXERCISES_PER_LANG = 6;
  const TOTAL_EXERCISES = LANGUAGES.length * EXERCISES_PER_LANG; // 30

  let mcqTotalPercent = 0, mcqCount = 0;
  let quizTotalPercent = 0, quizCount = 0;
  let totalCompleted = 0;

  // Language-wise data
  const langData = {};
  LANGUAGES.forEach(lang => {
    langData[lang] = { completed: 0, total: EXERCISES_PER_LANG, mcqAvg: 0, blankAvg: 0, mcqCount: 0, blankCount: 0 };
  });

  for (const key in scores) {
    const data = scores[key];
    const percent = data.total > 0 ? Math.round((data.score / data.total) * 100) : 0;
    totalCompleted++;

    // Determine language from key prefix (e.g. "java_MCQ1", "javascript_blank2")
    const parts = key.split('_');
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
      // Fallback for old key formats
      if (key.includes("MCQ")) { mcqTotalPercent += percent; mcqCount++; }
      else if (key.includes("blank")) { quizTotalPercent += percent; quizCount++; }
    }
  }

  const mcqAvg = mcqCount > 0 ? Math.round(mcqTotalPercent / mcqCount) : 0;
  const quizAvg = quizCount > 0 ? Math.round(quizTotalPercent / quizCount) : 0;
  const progressValue = Math.min(100, Math.round((totalCompleted / TOTAL_EXERCISES) * 100));

  // --- Animate Progress Bar & Scores ---
  setTimeout(() => {
    const progressBar = document.getElementById("progress");
    const progressText = document.getElementById("progressValue");
    if (progressBar && progressText) {
      progressBar.style.width = progressValue + "%";
      progressText.innerText = progressValue + "%";
    }

    const scoreCircles = document.querySelectorAll(".score-number");
    if (scoreCircles.length >= 2) {
      scoreCircles[0].innerHTML = mcqAvg + "<small>%</small>";
      scoreCircles[1].innerHTML = quizAvg + "<small>%</small>";
    }
  }, 300);

  // --- Language-wise Progress ---
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
          <a href="${notesUrl}" style="flex:1; text-align:center; padding:6px 0; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); border-radius:8px; font-size:11px; font-weight:600; color:#cbd5e1; text-decoration:none; transition:all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.12)'" onmouseout="this.style.background='rgba(255,255,255,0.06)'">📖 Practice</a>
          <a href="${compUrl}" style="flex:1; text-align:center; padding:6px 0; background:rgba(59,130,246,0.15); border:1px solid rgba(59,130,246,0.25); border-radius:8px; font-size:11px; font-weight:600; color:#60a5fa; text-decoration:none; transition:all 0.2s;" onmouseover="this.style.background='rgba(59,130,246,0.25)'" onmouseout="this.style.background='rgba(59,130,246,0.15)'">⚡ Compiler</a>
        </div>
      `;
      container.appendChild(card);
    });

    langBody.appendChild(container);
  }

  // --- Gamification Stats (Streak, XP, Badges) ---
  if (window.Gamification) {
    const gStats = Gamification.getUserStats();
    if (gStats) {
      // Streak Card
      const streakEl = document.getElementById("streakDays");
      const streakSub = document.getElementById("streakSubtitle");
      if (streakEl) streakEl.textContent = `${gStats.streak} Day${gStats.streak === 1 ? "" : "s"}`;
      if (streakSub && gStats.longestStreak > 1) {
        streakSub.textContent = `Personal Best: ${gStats.longestStreak} days! Keep the momentum!`;
      }

      // XP & Level Card
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

      // Badges Shelf
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

  // --- Admin Panel ---
  if (currentUser === "admin") {
    document.getElementById("adminPanel").style.display = "block";
    const tbody = document.getElementById("adminUserList");
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

// --- Navigation ---
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "Login.html";
}

function goHome() {
  window.location.href = "index.html";
}
