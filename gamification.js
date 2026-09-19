/**
 * Learn2code — Centralized Gamification Engine
 * Handles XP, Levels, Daily Coding Streaks, and Achievement Badges.
 */
(function () {
  "use strict";

  const LEVELS = [
    { level: 1, title: "Novice Coder",        minXP: 0,    nextXP: 200  },
    { level: 2, title: "Apprentice Developer", minXP: 200,  nextXP: 500  },
    { level: 3, title: "Code Crafter",         minXP: 500,  nextXP: 1000 },
    { level: 4, title: "Algorithm Hacker",     minXP: 1000, nextXP: 2000 },
    { level: 5, title: "Code Master",          minXP: 2000, nextXP: 5000 },
  ];

  const BADGE_DEFINITIONS = [
    {
      id: "first_run",
      name: "First Spark",
      icon: "⚡",
      color: "#eab308",
      description: "Ran your first code snippet in an online compiler."
    },
    {
      id: "quiz_novice",
      name: "Curious Mind",
      icon: "💡",
      color: "#3b82f6",
      description: "Completed your first practice exercise or quiz."
    },
    {
      id: "perfect_score",
      name: "Flawless Victory",
      icon: "🎯",
      color: "#10b981",
      description: "Scored 100% on any practice exercise or quiz."
    },
    {
      id: "polyglot",
      name: "Polyglot",
      icon: "🌐",
      color: "#8b5cf6",
      description: "Practiced or compiled code in 2 or more programming languages."
    },
    {
      id: "code_runner_10",
      name: "Code Machine",
      icon: "⚙️",
      color: "#06b6d4",
      description: "Executed code 10 times across online compilers."
    },
    {
      id: "streak_3",
      name: "On Fire",
      icon: "🔥",
      color: "#f97316",
      description: "Maintained a 3-day consecutive coding streak."
    },
    {
      id: "streak_7",
      name: "Unstoppable",
      icon: "🏆",
      color: "#ec4899",
      description: "Maintained a 7-day consecutive coding streak."
    },
    {
      id: "java_explorer",
      name: "Coffee Enthusiast",
      icon: "☕",
      color: "#ef4444",
      description: "Completed a Java exercise or ran Java code."
    },
    {
      id: "python_explorer",
      name: "Snake Charmer",
      icon: "🐍",
      color: "#f59e0b",
      description: "Completed a Python exercise or ran Python code."
    },
    {
      id: "c_explorer",
      name: "Low-Level Pioneer",
      icon: "💻",
      color: "#38bdf8",
      description: "Completed a C or C++ exercise or compiler run."
    },
    {
      id: "js_explorer",
      name: "Web Wizard",
      icon: "🪄",
      color: "#eab308",
      description: "Completed a JavaScript exercise or compiler run."
    },
    {
      id: "halfway_hero",
      name: "Halfway Hero",
      icon: "🛡️",
      color: "#a855f7",
      description: "Completed at least 15 exercises (50% course completion)."
    },
    {
      id: "code_master",
      name: "Grandmaster",
      icon: "👑",
      color: "#f43f5e",
      description: "Completed all 30 exercises across the platform."
    }
  ];

  function getTodayString() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function getYesterdayString() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function getCurrentUser() {
    return localStorage.getItem("currentUser") || null;
  }

  function getUserRecord(username) {
    if (!username) return null;
    let users = JSON.parse(localStorage.getItem("users")) || {};
    if (!users[username]) {
      users[username] = { profile: null, scores: {} };
    }
    if (!users[username].gamification) {
      users[username].gamification = {
        xp: 0,
        streak: { current: 1, longest: 1, lastActiveDate: "" },
        badges: [],
        codeRunCount: 0,
        languagesUsed: []
      };
    }
    return { users, user: users[username] };
  }

  function saveUserRecord(users) {
    localStorage.setItem("users", JSON.stringify(users));
  }

  function calculateLevel(xp) {
    let current = LEVELS[0];
    for (let i = 0; i < LEVELS.length; i++) {
      if (xp >= LEVELS[i].minXP) {
        current = LEVELS[i];
      }
    }
    return current;
  }

  const Gamification = {
    // ── Get Full User Stats ──
    getUserStats: function () {
      const username = getCurrentUser();
      if (!username) return null;
      const rec = getUserRecord(username);
      if (!rec) return null;

      const g = rec.user.gamification;
      const scores = rec.user.scores || {};
      const lvl = calculateLevel(g.xp);

      const nextThreshold = lvl.nextXP || (lvl.minXP + 1000);
      const currentLevelBase = lvl.minXP;
      const progressInLevel = Math.max(0, g.xp - currentLevelBase);
      const range = nextThreshold - currentLevelBase;
      const levelPercent = Math.min(100, Math.round((progressInLevel / range) * 100));

      return {
        username: username,
        xp: g.xp,
        level: lvl.level,
        title: lvl.title,
        nextXP: lvl.nextXP,
        levelPercent: levelPercent,
        streak: g.streak.current,
        longestStreak: g.streak.longest,
        lastActiveDate: g.streak.lastActiveDate,
        codeRunCount: g.codeRunCount,
        badges: g.badges || [],
        scoresCount: Object.keys(scores).length
      };
    },

    // ── Add XP ──
    addXP: function (amount, reason) {
      const username = getCurrentUser();
      if (!username || amount <= 0) return;
      const rec = getUserRecord(username);
      if (!rec) return;

      const oldLevel = calculateLevel(rec.user.gamification.xp).level;
      rec.user.gamification.xp += amount;
      const newLevel = calculateLevel(rec.user.gamification.xp);

      saveUserRecord(rec.users);

      if (window.showToast) {
        window.showToast(`+${amount} XP: ${reason}`, "info", 2600);
      }

      // Check level up
      if (newLevel.level > oldLevel) {
        setTimeout(() => {
          if (window.showToast) {
            window.showToast(`🎉 Level Up! You are now a Level ${newLevel.level} ${newLevel.title}!`, "success", 4000);
          }
        }, 1000);
      }
    },

    // ── Unlock a Badge ──
    unlockBadge: function (badgeId) {
      const username = getCurrentUser();
      if (!username) return;
      const rec = getUserRecord(username);
      if (!rec) return;

      if (!rec.user.gamification.badges) rec.user.gamification.badges = [];
      if (rec.user.gamification.badges.includes(badgeId)) return; // already earned

      const badge = BADGE_DEFINITIONS.find(b => b.id === badgeId);
      if (!badge) return;

      rec.user.gamification.badges.push(badgeId);
      saveUserRecord(rec.users);

      // Award 100 XP for every badge unlocked!
      Gamification.addXP(100, `Badge: ${badge.name}!`);

      setTimeout(() => {
        if (window.showToast) {
          window.showToast(`🏆 Badge Unlocked: ${badge.icon} ${badge.name}!`, "success", 4000);
        }
      }, 500);
    },

    // ── Update Daily Coding Streak ──
    updateDailyStreak: function () {
      const username = getCurrentUser();
      if (!username) return;
      const rec = getUserRecord(username);
      if (!rec) return;

      const today = getTodayString();
      const yesterday = getYesterdayString();
      const streakObj = rec.user.gamification.streak;

      if (streakObj.lastActiveDate === today) {
        return; // Already recorded today
      }

      if (streakObj.lastActiveDate === yesterday) {
        streakObj.current += 1;
      } else if (streakObj.lastActiveDate === "") {
        streakObj.current = 1;
      } else {
        // Missed a day -> reset to 1
        streakObj.current = 1;
      }

      streakObj.lastActiveDate = today;
      if (streakObj.current > (streakObj.longest || 0)) {
        streakObj.longest = streakObj.current;
      }

      saveUserRecord(rec.users);

      // Streak badges
      if (streakObj.current >= 3) Gamification.unlockBadge("streak_3");
      if (streakObj.current >= 7) Gamification.unlockBadge("streak_7");

      // Daily login bonus
      Gamification.addXP(25, `Day ${streakObj.current} Streak Bonus! 🔥`);
    },

    // ── Record Code Run in Online Compiler ──
    recordCodeRun: function (language) {
      const username = getCurrentUser();
      if (!username) return;
      const rec = getUserRecord(username);
      if (!rec) return;

      const g = rec.user.gamification;
      g.codeRunCount = (g.codeRunCount || 0) + 1;

      if (!g.languagesUsed) g.languagesUsed = [];
      const normalizedLang = language.toLowerCase();
      if (!g.languagesUsed.includes(normalizedLang)) {
        g.languagesUsed.push(normalizedLang);
      }
      saveUserRecord(rec.users);

      // Award XP for compiling code
      Gamification.addXP(10, "Code Run ⚡");

      // Badges
      Gamification.unlockBadge("first_run");
      if (g.codeRunCount >= 10) Gamification.unlockBadge("code_runner_10");
      if (g.languagesUsed.length >= 2) Gamification.unlockBadge("polyglot");

      if (normalizedLang.includes("java") && !normalizedLang.includes("script")) Gamification.unlockBadge("java_explorer");
      if (normalizedLang.includes("python")) Gamification.unlockBadge("python_explorer");
      if (normalizedLang === "c" || normalizedLang === "c++") Gamification.unlockBadge("c_explorer");
      if (normalizedLang.includes("script")) Gamification.unlockBadge("js_explorer");
    },

    // ── Record Practice / Quiz / Blank Completion ──
    recordExerciseComplete: function (language, exerciseName, score, total) {
      const username = getCurrentUser();
      if (!username) return;
      const rec = getUserRecord(username);
      if (!rec) return;

      const g = rec.user.gamification;
      if (!g.languagesUsed) g.languagesUsed = [];
      const normalizedLang = language.toLowerCase();
      if (!g.languagesUsed.includes(normalizedLang)) {
        g.languagesUsed.push(normalizedLang);
      }

      // Base XP for completing an exercise
      let earnedXP = 50;
      let reason = `Exercise Completed (${score}/${total})`;

      // Bonus for 100%
      if (total > 0 && score === total) {
        earnedXP += 50;
        reason = `Perfect Score Bonus! 🎯 (${score}/${total})`;
        Gamification.unlockBadge("perfect_score");
      }

      saveUserRecord(rec.users);
      Gamification.addXP(earnedXP, reason);

      // Badges
      Gamification.unlockBadge("quiz_novice");
      if (g.languagesUsed.length >= 2) Gamification.unlockBadge("polyglot");

      if (normalizedLang.includes("java") && !normalizedLang.includes("script")) Gamification.unlockBadge("java_explorer");
      if (normalizedLang.includes("python")) Gamification.unlockBadge("python_explorer");
      if (normalizedLang === "c" || normalizedLang === "c++") Gamification.unlockBadge("c_explorer");
      if (normalizedLang.includes("script")) Gamification.unlockBadge("js_explorer");

      // Check course completion milestones
      const numScores = Object.keys(rec.user.scores || {}).length;
      if (numScores >= 15) Gamification.unlockBadge("halfway_hero");
      if (numScores >= 30) Gamification.unlockBadge("code_master");
    },

    // ── Get All Badges with Earned Status ──
    getAllBadges: function () {
      const stats = Gamification.getUserStats();
      const earnedList = stats ? stats.badges : [];
      return BADGE_DEFINITIONS.map(b => ({
        ...b,
        unlocked: earnedList.includes(b.id)
      }));
    },

    // ── Auto-sync with existing scores on page load ──
    syncWithExistingScores: function () {
      const username = getCurrentUser();
      if (!username) return;
      const rec = getUserRecord(username);
      if (!rec) return;

      const scores = rec.user.scores || {};
      const scoreKeys = Object.keys(scores);
      if (scoreKeys.length === 0) return;

      // If user had previous scores but no XP yet, calculate retroactive XP
      if (rec.user.gamification.xp === 0) {
        let totalCalculatedXP = 0;
        scoreKeys.forEach(k => {
          const item = scores[k];
          totalCalculatedXP += 50;
          if (item.total > 0 && item.score === item.total) {
            totalCalculatedXP += 50;
          }
        });
        rec.user.gamification.xp = totalCalculatedXP;
        saveUserRecord(rec.users);
      }

      // Check badges retrospectively
      Gamification.unlockBadge("quiz_novice");
      let perfectCount = 0;
      let langs = new Set();

      scoreKeys.forEach(k => {
        const item = scores[k];
        if (item.total > 0 && item.score === item.total) perfectCount++;
        const langPart = k.split("_")[0];
        if (langPart) langs.add(langPart.toLowerCase());
      });

      if (perfectCount > 0) Gamification.unlockBadge("perfect_score");
      if (langs.size >= 2) Gamification.unlockBadge("polyglot");
      if (langs.has("java")) Gamification.unlockBadge("java_explorer");
      if (langs.has("python")) Gamification.unlockBadge("python_explorer");
      if (langs.has("c") || langs.has("c++")) Gamification.unlockBadge("c_explorer");
      if (langs.has("javascript")) Gamification.unlockBadge("js_explorer");
      if (scoreKeys.length >= 15) Gamification.unlockBadge("halfway_hero");
      if (scoreKeys.length >= 30) Gamification.unlockBadge("code_master");
    }
  };

  window.Gamification = Gamification;

  // Auto-init streak and sync
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      Gamification.syncWithExistingScores();
      Gamification.updateDailyStreak();
    });
  } else {
    Gamification.syncWithExistingScores();
    Gamification.updateDailyStreak();
  }
})();
