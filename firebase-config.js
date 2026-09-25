/**
 * CodeStart / Learn2code — Firebase Configuration & Social Data Engine
 * 
 * Instructions for Live Cloud Sync:
 * 1. Create a free project at https://console.firebase.google.com
 * 2. Enable "Authentication" (Email/Password) and "Firestore Database" (test mode)
 * 3. Replace the placeholder values in `firebaseConfig` below with your project credentials.
 * 
 * NOTE: If credentials are not replaced, CodeStart automatically runs in 
 * "Simulated Cloud Mode" using localStorage and rich mock data, so all features 
 * (Community feed, Chat, Profiles, Leaderboard) work immediately without any setup!
 */

(function () {
  "use strict";

  // -------------------------------------------------------------
  // 1. Firebase Credentials (Paste your project config here)
  // -------------------------------------------------------------
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  };

  const isConfigured = firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY";

  let fbApp = null;
  let fbAuth = null;
  let fbDb = null;

  if (isConfigured && typeof firebase !== "undefined") {
    try {
      fbApp = firebase.initializeApp(firebaseConfig);
      fbAuth = firebase.auth();
      fbDb = firebase.firestore();
      console.log("🔥 [CodeStart] Firebase Connected successfully!");
    } catch (e) {
      console.warn("⚠️ [CodeStart] Firebase init error, falling back to local social mode:", e);
    }
  }

  // -------------------------------------------------------------
  // 2. Avatar & Color Utilities
  // -------------------------------------------------------------
  const AVATAR_PALETTES = [
    { bg: "linear-gradient(135deg, #3b82f6, #1d4ed8)", color: "#fff" },
    { bg: "linear-gradient(135deg, #8b5cf6, #6d28d9)", color: "#fff" },
    { bg: "linear-gradient(135deg, #ec4899, #be185d)", color: "#fff" },
    { bg: "linear-gradient(135deg, #10b981, #047857)", color: "#fff" },
    { bg: "linear-gradient(135deg, #f59e0b, #b45309)", color: "#fff" },
    { bg: "linear-gradient(135deg, #06b6d4, #0e7490)", color: "#fff" },
    { bg: "linear-gradient(135deg, #ef4444, #b91c1c)", color: "#fff" },
    { bg: "linear-gradient(135deg, #6366f1, #4338ca)", color: "#fff" }
  ];

  function getAvatarStyle(name) {
    if (!name) name = "User";
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const idx = Math.abs(hash) % AVATAR_PALETTES.length;
    return AVATAR_PALETTES[idx];
  }

  function getInitials(name) {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  function renderAvatarHtml(name, size = 40, extraClass = "") {
    const style = getAvatarStyle(name);
    const initials = getInitials(name);
    const fontSize = Math.round(size * 0.42);
    return `<div class="user-avatar-circle ${extraClass}" style="width:${size}px; height:${size}px; border-radius:50%; background:${style.bg}; color:${style.color}; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:${fontSize}px; user-select:none; box-shadow:0 2px 10px rgba(0,0,0,0.25); flex-shrink:0;">${initials}</div>`;
  }

  // -------------------------------------------------------------
  // 3. Seed Mock Social Data (Used in Fallback / First-run)
  // -------------------------------------------------------------
  function seedMockDataIfNeeded() {
    // 1. Seed community posts
    if (!localStorage.getItem("codestart_posts")) {
      const initialPosts = [
        {
          id: "post_1",
          authorUsername: "alex_dev",
          authorName: "Alex Rivera",
          badge: "Java Master ☕",
          language: "Java",
          score: 100,
          content: "Just completed the Java Advanced Quiz with a perfect 100%! The object-oriented concepts on Learn2code are so well explained 🔥🚀",
          createdAt: Date.now() - 1000 * 60 * 35, // 35 min ago
          likes: ["sarah_code", "kiran", "code_ninja"],
          comments: [
            {
              id: "c_1",
              authorUsername: "sarah_code",
              authorName: "Sarah Chen",
              text: "Congrats Alex! Did you tackle the Polymorphism questions too?",
              createdAt: Date.now() - 1000 * 60 * 18
            },
            {
              id: "c_2",
              authorUsername: "alex_dev",
              authorName: "Alex Rivera",
              text: "Yes! Took a second read on method overriding, but got through!",
              createdAt: Date.now() - 1000 * 60 * 10
            }
          ]
        },
        {
          id: "post_2",
          authorUsername: "sarah_code",
          authorName: "Sarah Chen",
          badge: "Python Prodigy 🐍",
          language: "Python",
          score: 95,
          content: "Built a real-time Fibonacci generator and tested it in the built-in compiler. The Ctrl+Enter shortcut is a game changer!",
          createdAt: Date.now() - 1000 * 60 * 120, // 2 hrs ago
          likes: ["alex_dev", "dev_vikram"],
          comments: [
            {
              id: "c_3",
              authorUsername: "dev_vikram",
              authorName: "Vikram Sharma",
              text: "Nice one Sarah! Keep up the daily streak!",
              createdAt: Date.now() - 1000 * 60 * 50
            }
          ]
        },
        {
          id: "post_3",
          authorUsername: "dev_vikram",
          authorName: "Vikram Sharma",
          badge: "C++ Legend ⚡",
          language: "C++",
          score: 90,
          content: "Pointer arithmetic finally clicked for me today thanks to the interactive exercises! Never thought I'd say I love C++ memory management.",
          createdAt: Date.now() - 1000 * 60 * 60 * 5, // 5 hrs ago
          likes: ["sarah_code"],
          comments: []
        },
        {
          id: "post_4",
          authorUsername: "code_ninja",
          authorName: "Aarav Patel",
          badge: "JavaScript Ninja 🥷",
          language: "JavaScript",
          score: 100,
          content: "7-day streak achieved! 🏆 Crushed all 6 JavaScript exercises and unlocked the JS Architect achievement badge!",
          createdAt: Date.now() - 1000 * 60 * 60 * 14, // 14 hrs ago
          likes: ["alex_dev", "kiran", "sarah_code", "dev_vikram"],
          comments: []
        }
      ];
      localStorage.setItem("codestart_posts", JSON.stringify(initialPosts));
    }

    // 2. Seed Mock Users for Profiles and Leaderboard
    let users = JSON.parse(localStorage.getItem("users")) || {};
    const sampleUsers = {
      alex_dev: {
        email: "alex@codestart.dev",
        profile: {
          username: "alex_dev",
          fullname: "Alex Rivera",
          level: "Advanced",
          language: "Java",
          age: 22,
          bio: "Fullstack dev & Java enthusiast. Building systems.",
          joinedAt: "Jan 2026",
          streak: 12
        },
        scores: {
          java_MCQ1: { score: 10, total: 10 },
          java_MCQ2: { score: 10, total: 10 },
          java_blank1: { score: 5, total: 5 },
          java_blank2: { score: 5, total: 5 },
          python_MCQ1: { score: 9, total: 10 },
          javascript_MCQ1: { score: 10, total: 10 }
        }
      },
      sarah_code: {
        email: "sarah@codestart.dev",
        profile: {
          username: "sarah_code",
          fullname: "Sarah Chen",
          level: "Intermediate",
          language: "Python",
          age: 21,
          bio: "Data science explorer & Python lover.",
          joinedAt: "Feb 2026",
          streak: 9
        },
        scores: {
          python_MCQ1: { score: 10, total: 10 },
          python_MCQ2: { score: 10, total: 10 },
          python_blank1: { score: 5, total: 5 },
          javascript_MCQ1: { score: 9, total: 10 },
          C_MCQ1: { score: 8, total: 10 }
        }
      },
      code_ninja: {
        email: "ninja@codestart.dev",
        profile: {
          username: "code_ninja",
          fullname: "Aarav Patel",
          level: "Advanced",
          language: "JavaScript",
          age: 23,
          bio: "Speed coder. React & Node architect.",
          joinedAt: "Dec 2025",
          streak: 15
        },
        scores: {
          javascript_MCQ1: { score: 10, total: 10 },
          javascript_MCQ2: { score: 10, total: 10 },
          javascript_MCQ3: { score: 10, total: 10 },
          javascript_blank1: { score: 5, total: 5 },
          javascript_blank2: { score: 5, total: 5 },
          javascript_blank3: { score: 5, total: 5 }
        }
      },
      dev_vikram: {
        email: "vikram@codestart.dev",
        profile: {
          username: "dev_vikram",
          fullname: "Vikram Sharma",
          level: "Beginner",
          language: "C++",
          age: 20,
          bio: "CS student climbing the C++ mastery ladder.",
          joinedAt: "Feb 2026",
          streak: 5
        },
        scores: {
          "c++_MCQ1": { score: 9, total: 10 },
          "c++_blank1": { score: 4, total: 5 },
          C_MCQ1: { score: 8, total: 10 }
        }
      }
    };

    let updated = false;
    for (const u in sampleUsers) {
      if (!users[u]) {
        users[u] = sampleUsers[u];
        updated = true;
      }
    }
    if (updated) {
      localStorage.setItem("users", JSON.stringify(users));
    }

    // 3. Seed Chat Messages
    if (!localStorage.getItem("codestart_chats")) {
      const initialChats = {
        "general": [
          {
            id: "m_1",
            sender: "sarah_code",
            senderName: "Sarah Chen",
            text: "Hey everyone! 👋 Welcome to the CodeStart Community Chat!",
            timestamp: Date.now() - 1000 * 60 * 60 * 2
          },
          {
            id: "m_2",
            sender: "alex_dev",
            senderName: "Alex Rivera",
            text: "Awesome to have real-time discussion here! Anyone working on Java concurrency?",
            timestamp: Date.now() - 1000 * 60 * 50
          },
          {
            id: "m_3",
            sender: "code_ninja",
            senderName: "Aarav Patel",
            text: "Working on async JS right now! The online compiler is super fast 🚀",
            timestamp: Date.now() - 1000 * 60 * 20
          }
        ]
      };
      localStorage.setItem("codestart_chats", JSON.stringify(initialChats));
    }
  }

  seedMockDataIfNeeded();

  // -------------------------------------------------------------
  // 4. Unified CodeStart Engine API
  // -------------------------------------------------------------
  window.CodeStart = {
    isLiveCloud: isConfigured && !!fbDb,
    firebase: { app: fbApp, auth: fbAuth, db: fbDb },

    // Avatar tools
    getAvatarStyle,
    getInitials,
    renderAvatarHtml,

    // Current user helpers
    getCurrentUsername() {
      return localStorage.getItem("currentUser") || null;
    },

    getCurrentUserProfile() {
      const uname = this.getCurrentUsername();
      if (!uname) return null;
      const users = JSON.parse(localStorage.getItem("users")) || {};
      return users[uname]?.profile || { username: uname, fullname: uname };
    },

    // -----------------------------------------------------------
    // Auth Handlers (with Firebase Auth & Local Fallback)
    // -----------------------------------------------------------
    async login(emailOrUsername, password) {
      let users = JSON.parse(localStorage.getItem("users")) || {};
      let matchedUser = null;

      // 1. Try Firebase Auth if live
      if (this.isLiveCloud && fbAuth && emailOrUsername.includes("@")) {
        try {
          const cred = await fbAuth.signInWithEmailAndPassword(emailOrUsername, password);
          // Look up user doc in Firestore
          const doc = await fbDb.collection("users").doc(cred.user.uid).get();
          const data = doc.data() || {};
          const username = data.username || emailOrUsername.split("@")[0];
          localStorage.setItem("currentUser", username);
          return { success: true, user: username };
        } catch (err) {
          console.warn("Firebase Auth signin failed:", err.message);
          // Fall through to check local store
        }
      }

      // 2. Check local users by username or email
      for (const u in users) {
        if (
          (u.toLowerCase() === emailOrUsername.toLowerCase() ||
           (users[u].email && users[u].email.toLowerCase() === emailOrUsername.toLowerCase())) &&
          users[u].password === password
        ) {
          matchedUser = u;
          break;
        }
      }

      if (matchedUser) {
        localStorage.setItem("currentUser", matchedUser);
        return { success: true, user: matchedUser };
      }

      throw new Error("Invalid username/email or password.");
    },

    async signup(username, email, password) {
      let users = JSON.parse(localStorage.getItem("users")) || {};
      if (users[username]) {
        throw new Error("Username is already taken. Please choose another.");
      }

      // 1. Register with Firebase if live
      let uid = null;
      if (this.isLiveCloud && fbAuth) {
        try {
          const cred = await fbAuth.createUserWithEmailAndPassword(email, password);
          uid = cred.user.uid;
          await fbDb.collection("users").doc(uid).set({
            username: username,
            email: email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        } catch (err) {
          console.warn("Firebase Auth signup failed, continuing local:", err.message);
        }
      }

      // 2. Save locally
      users[username] = {
        email: email,
        password: password,
        firebaseUid: uid,
        profile: {
          username: username,
          fullname: username,
          joinedAt: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
          streak: 1
        },
        scores: {}
      };
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", username);

      return { success: true, user: username };
    },

    logout() {
      if (this.isLiveCloud && fbAuth) {
        try { fbAuth.signOut(); } catch (e) {}
      }
      localStorage.removeItem("currentUser");
      window.location.href = "Login.html";
    },

    // -----------------------------------------------------------
    // User Profile
    // -----------------------------------------------------------
    async getUser(username) {
      const users = JSON.parse(localStorage.getItem("users")) || {};
      if (users[username]) {
        return users[username];
      }
      if (this.isLiveCloud && fbDb) {
        const snap = await fbDb.collection("users").where("username", "==", username).limit(1).get();
        if (!snap.empty) {
          return snap.docs[0].data();
        }
      }
      return null;
    },

    async saveProfile(profileData) {
      const currentUser = this.getCurrentUsername();
      if (!currentUser) throw new Error("Not logged in");

      let users = JSON.parse(localStorage.getItem("users")) || {};
      if (!users[currentUser]) {
        users[currentUser] = { scores: {} };
      }
      users[currentUser].profile = {
        ...(users[currentUser].profile || {}),
        ...profileData,
        username: currentUser
      };
      localStorage.setItem("users", JSON.stringify(users));

      // Sync to Firestore if live
      if (this.isLiveCloud && fbDb) {
        try {
          await fbDb.collection("users").doc(currentUser).set(profileData, { merge: true });
        } catch (e) {
          console.warn("Firestore saveProfile error:", e);
        }
      }
      return users[currentUser].profile;
    },

    // -----------------------------------------------------------
    // Community Feed (Posts, Likes, Comments)
    // -----------------------------------------------------------
    async getPosts(filterLang = "all") {
      let posts = JSON.parse(localStorage.getItem("codestart_posts")) || [];

      // Sort newest first
      posts.sort((a, b) => b.createdAt - a.createdAt);

      if (filterLang && filterLang !== "all") {
        posts = posts.filter(p => p.language && p.language.toLowerCase() === filterLang.toLowerCase());
      }
      return posts;
    },

    async createPost({ content, language, score, badge }) {
      const currentUser = this.getCurrentUsername();
      if (!currentUser) throw new Error("Please log in to post.");

      const users = JSON.parse(localStorage.getItem("users")) || {};
      const authorName = users[currentUser]?.profile?.fullname || currentUser;

      const newPost = {
        id: "post_" + Date.now(),
        authorUsername: currentUser,
        authorName: authorName,
        content: content.trim(),
        language: language || "General",
        score: score || null,
        badge: badge || (language ? `${language} Coder` : "Developer"),
        createdAt: Date.now(),
        likes: [],
        comments: []
      };

      let posts = JSON.parse(localStorage.getItem("codestart_posts")) || [];
      posts.unshift(newPost);
      localStorage.setItem("codestart_posts", JSON.stringify(posts));

      // Firestore sync if live
      if (this.isLiveCloud && fbDb) {
        try {
          await fbDb.collection("posts").doc(newPost.id).set(newPost);
        } catch (e) {
          console.warn("Firestore createPost error:", e);
        }
      }
      return newPost;
    },

    async toggleLike(postId) {
      const currentUser = this.getCurrentUsername();
      if (!currentUser) throw new Error("Please log in to like posts.");

      let posts = JSON.parse(localStorage.getItem("codestart_posts")) || [];
      const post = posts.find(p => p.id === postId);
      if (!post) throw new Error("Post not found");

      const idx = post.likes.indexOf(currentUser);
      let isLiked = false;
      if (idx > -1) {
        post.likes.splice(idx, 1);
        isLiked = false;
      } else {
        post.likes.push(currentUser);
        isLiked = true;
      }
      localStorage.setItem("codestart_posts", JSON.stringify(posts));

      if (this.isLiveCloud && fbDb) {
        try {
          await fbDb.collection("posts").doc(postId).update({ likes: post.likes });
        } catch (e) {
          console.warn("Firestore toggleLike error:", e);
        }
      }
      return { isLiked, count: post.likes.length };
    },

    async addComment(postId, text) {
      const currentUser = this.getCurrentUsername();
      if (!currentUser) throw new Error("Please log in to comment.");

      const users = JSON.parse(localStorage.getItem("users")) || {};
      const authorName = users[currentUser]?.profile?.fullname || currentUser;

      const comment = {
        id: "c_" + Date.now(),
        authorUsername: currentUser,
        authorName: authorName,
        text: text.trim(),
        createdAt: Date.now()
      };

      let posts = JSON.parse(localStorage.getItem("codestart_posts")) || [];
      const post = posts.find(p => p.id === postId);
      if (!post) throw new Error("Post not found");

      if (!post.comments) post.comments = [];
      post.comments.push(comment);
      localStorage.setItem("codestart_posts", JSON.stringify(posts));

      if (this.isLiveCloud && fbDb) {
        try {
          await fbDb.collection("posts").doc(postId).update({ comments: post.comments });
        } catch (e) {
          console.warn("Firestore addComment error:", e);
        }
      }
      return comment;
    },

    async deletePost(postId) {
      const currentUser = this.getCurrentUsername();
      let posts = JSON.parse(localStorage.getItem("codestart_posts")) || [];
      const post = posts.find(p => p.id === postId);
      if (!post) throw new Error("Post not found");
      if (post.authorUsername !== currentUser && currentUser !== "admin") {
        throw new Error("You can only delete your own posts.");
      }

      posts = posts.filter(p => p.id !== postId);
      localStorage.setItem("codestart_posts", JSON.stringify(posts));

      if (this.isLiveCloud && fbDb) {
        try {
          await fbDb.collection("posts").doc(postId).delete();
        } catch (e) {}
      }
      return true;
    },

    // -----------------------------------------------------------
    // Real-Time Chat Engine
    // -----------------------------------------------------------
    getChatMessages(channelId = "general") {
      let chats = JSON.parse(localStorage.getItem("codestart_chats")) || {};
      return chats[channelId] || [];
    },

    async sendChatMessage(channelId = "general", text) {
      const currentUser = this.getCurrentUsername();
      if (!currentUser) throw new Error("Please log in to chat.");

      const users = JSON.parse(localStorage.getItem("users")) || {};
      const senderName = users[currentUser]?.profile?.fullname || currentUser;

      const msg = {
        id: "m_" + Date.now(),
        sender: currentUser,
        senderName: senderName,
        text: text.trim(),
        timestamp: Date.now()
      };

      let chats = JSON.parse(localStorage.getItem("codestart_chats")) || {};
      if (!chats[channelId]) chats[channelId] = [];
      chats[channelId].push(msg);
      localStorage.setItem("codestart_chats", JSON.stringify(chats));

      // Trigger custom storage event for other open tabs
      window.dispatchEvent(new CustomEvent("codestart_new_message", { detail: { channelId, msg } }));

      if (this.isLiveCloud && fbDb) {
        try {
          await fbDb.collection("chats").doc(channelId).collection("messages").add(msg);
        } catch (e) {
          console.warn("Firestore sendChatMessage error:", e);
        }
      }
      return msg;
    },

    // -----------------------------------------------------------
    // Leaderboard Rankings
    // -----------------------------------------------------------
    getLeaderboard(filterLang = "all") {
      const users = JSON.parse(localStorage.getItem("users")) || {};
      const leaderboard = [];

      for (const username in users) {
        const u = users[username];
        const profile = u.profile || {};
        const scores = u.scores || {};

        let totalScore = 0;
        let maxPossible = 0;
        let exerciseCount = 0;

        for (const key in scores) {
          const s = scores[key];
          const parts = key.split("_");
          const lang = parts[0];

          if (filterLang === "all" || (lang && lang.toLowerCase() === filterLang.toLowerCase())) {
            totalScore += s.score || 0;
            maxPossible += s.total || 0;
            exerciseCount++;
          }
        }

        const avgPercent = maxPossible > 0 ? Math.round((totalScore / maxPossible) * 100) : 0;
        const totalXP = (exerciseCount * 45) + (totalScore * 10);

        leaderboard.push({
          username,
          fullname: profile.fullname || username,
          level: profile.level || "Beginner",
          language: profile.language || "General",
          streak: profile.streak || 1,
          exercisesDone: exerciseCount,
          avgPercent,
          totalXP
        });
      }

      // Sort by avgPercent (desc), then totalXP (desc)
      leaderboard.sort((a, b) => {
        if (b.avgPercent !== a.avgPercent) return b.avgPercent - a.avgPercent;
        return b.totalXP - a.totalXP;
      });

      return leaderboard;
    },

    // -----------------------------------------------------------
    // Compiler Run History (Last 5 runs)
    // -----------------------------------------------------------
    saveCompilerRun(lang, code, output, execTime) {
      const currentUser = this.getCurrentUsername() || "guest";
      const key = `codestart_runs_${currentUser}_${lang}`;
      let runs = JSON.parse(localStorage.getItem(key)) || [];

      const newRun = {
        id: "run_" + Date.now(),
        lang,
        code: code.trim(),
        output: (output || "").trim().substring(0, 300),
        execTime: execTime || "0ms",
        timestamp: Date.now()
      };

      runs.unshift(newRun);
      if (runs.length > 5) runs = runs.slice(0, 5);
      localStorage.setItem(key, JSON.stringify(runs));
      return runs;
    },

    getCompilerRuns(lang) {
      const currentUser = this.getCurrentUsername() || "guest";
      const key = `codestart_runs_${currentUser}_${lang}`;
      return JSON.parse(localStorage.getItem(key)) || [];
    }
  };
})();
