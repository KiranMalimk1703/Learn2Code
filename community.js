/**
 * CodeStart / Learn2code — Community Social Feed Engine
 */

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = window.CodeStart.getCurrentUsername() || "Guest User";
  const currentUserAvatarWrap = document.getElementById("currentUserAvatarWrap");
  const postContentInput = document.getElementById("postContentInput");
  const postLanguageSelect = document.getElementById("postLanguageSelect");
  const postScoreSelect = document.getElementById("postScoreSelect");
  const submitPostBtn = document.getElementById("submitPostBtn");
  const filterTabs = document.getElementById("filterTabs");
  const postsFeed = document.getElementById("postsFeed");

  let activeFilter = "all";

  // 1. Render Current User Avatar in Post Composer
  if (currentUserAvatarWrap && window.CodeStart) {
    currentUserAvatarWrap.innerHTML = window.CodeStart.renderAvatarHtml(currentUser, 44);
  }

  // 2. Format Relative Time
  function formatTimeAgo(timestamp) {
    if (!timestamp) return "Recently";
    const sec = Math.floor((Date.now() - timestamp) / 1000);
    if (sec < 60) return "Just now";
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m ago`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h ago`;
    const days = Math.floor(hr / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  }

  // 3. Helper to get language badge style class
  function getBadgeClass(lang) {
    const l = (lang || "").toLowerCase();
    if (l === "java") return "badge-java";
    if (l === "python") return "badge-python";
    if (l === "javascript") return "badge-javascript";
    if (l === "c") return "badge-c";
    if (l.includes("c++") || l === "cpp") return "badge-cpp";
    return "badge-general";
  }

  // 4. Render Posts
  async function loadPosts() {
    try {
      const posts = await window.CodeStart.getPosts(activeFilter);
      postsFeed.innerHTML = "";

      if (posts.length === 0) {
        postsFeed.innerHTML = `
          <div class="feed-empty">
            <i class="fa-regular fa-folder-open"></i>
            <h3>No posts found in this category</h3>
            <p>Be the first developer to share something in this topic!</p>
          </div>
        `;
        return;
      }

      posts.forEach(post => {
        const isLiked = post.likes && post.likes.includes(currentUser);
        const likeCount = post.likes ? post.likes.length : 0;
        const commentCount = post.comments ? post.comments.length : 0;
        const isAuthor = post.authorUsername === currentUser || currentUser === "admin";
        const badgeClass = getBadgeClass(post.language);

        const card = document.createElement("article");
        card.className = "post-card";
        card.id = `post-${post.id}`;

        let achievementHtml = "";
        if (post.score) {
          achievementHtml = `
            <div class="post-achievement-card">
              <i class="fa-solid fa-trophy" style="color: #f59e0b;"></i>
              <span>Scored ${post.score}% in ${post.language || "Programming"}</span>
            </div>
          `;
        }

        const avatarHtml = window.CodeStart.renderAvatarHtml(post.authorName || post.authorUsername, 42);

        card.innerHTML = `
          <div class="post-card-header">
            <a href="user-profile.html?user=${encodeURIComponent(post.authorUsername)}" class="post-author-wrap">
              ${avatarHtml}
              <div>
                <div class="post-author-name">
                  ${escapeHtml(post.authorName || post.authorUsername)}
                  <span class="badge-pill ${badgeClass}">${post.language || "General"}</span>
                </div>
                <div class="post-meta-sub">
                  <span>@${escapeHtml(post.authorUsername)}</span> &bull; 
                  <span>${formatTimeAgo(post.createdAt)}</span>
                </div>
              </div>
            </a>
            ${isAuthor ? `<button class="post-delete-btn" data-id="${post.id}" title="Delete post"><i class="fa-regular fa-trash-can"></i></button>` : ""}
          </div>

          <div class="post-content">${escapeHtml(post.content)}</div>
          ${achievementHtml}

          <div class="post-actions">
            <button class="post-action-btn like-btn ${isLiked ? "liked" : ""}" data-id="${post.id}">
              <i class="${isLiked ? "fa-solid" : "fa-regular"} fa-heart"></i>
              <span class="like-count">${likeCount}</span>
            </button>
            <button class="post-action-btn comment-toggle-btn" data-id="${post.id}">
              <i class="fa-regular fa-comment"></i>
              <span class="comment-count">${commentCount}</span>
            </button>
            <button class="post-action-btn share-post-btn" data-id="${post.id}">
              <i class="fa-regular fa-paper-plane"></i> Share
            </button>
          </div>

          <!-- Comments Drawer -->
          <div class="comments-section" id="comments-${post.id}">
            <div class="comments-list" id="comments-list-${post.id}">
              ${renderCommentsList(post.comments || [])}
            </div>
            <div class="comment-input-wrap">
              <input type="text" class="comment-input" placeholder="Write a reply..." data-id="${post.id}">
              <button class="comment-submit-btn" data-id="${post.id}">Reply</button>
            </div>
          </div>
        `;

        // Attach event listeners
        // 1. Like button
        const likeBtn = card.querySelector(".like-btn");
        likeBtn.addEventListener("click", async () => {
          try {
            const res = await window.CodeStart.toggleLike(post.id);
            likeBtn.classList.toggle("liked", res.isLiked);
            likeBtn.querySelector("i").className = res.isLiked ? "fa-solid fa-heart" : "fa-regular fa-heart";
            likeBtn.querySelector(".like-count").textContent = res.count;
          } catch (err) {
            showToast(err.message, "error");
          }
        });

        // 2. Comment toggle
        const commentToggleBtn = card.querySelector(".comment-toggle-btn");
        const commentsSec = card.querySelector(`#comments-${post.id}`);
        commentToggleBtn.addEventListener("click", () => {
          commentsSec.classList.toggle("open");
        });

        // 3. Comment submit
        const commentInput = card.querySelector(".comment-input");
        const commentSubmitBtn = card.querySelector(".comment-submit-btn");
        const submitComment = async () => {
          const text = commentInput.value.trim();
          if (!text) return;
          try {
            const comment = await window.CodeStart.addComment(post.id, text);
            commentInput.value = "";
            const list = card.querySelector(`#comments-list-${post.id}`);
            list.innerHTML += renderSingleComment(comment);
            const countEl = card.querySelector(".comment-count");
            countEl.textContent = parseInt(countEl.textContent || "0", 10) + 1;
            showToast("Comment posted!", "success");
          } catch (err) {
            showToast(err.message, "error");
          }
        };

        commentSubmitBtn.addEventListener("click", submitComment);
        commentInput.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            submitComment();
          }
        });

        // 4. Delete post
        const deleteBtn = card.querySelector(".post-delete-btn");
        if (deleteBtn) {
          deleteBtn.addEventListener("click", async () => {
            if (confirm("Are you sure you want to delete this post?")) {
              try {
                await window.CodeStart.deletePost(post.id);
                card.remove();
                showToast("Post removed", "info");
              } catch (err) {
                showToast(err.message, "error");
              }
            }
          });
        }

        // 5. Share post
        const shareBtn = card.querySelector(".share-post-btn");
        shareBtn.addEventListener("click", () => {
          navigator.clipboard.writeText(window.location.href.split("#")[0] + `#post-${post.id}`);
          showToast("Post link copied to clipboard! 📋", "success");
        });

        postsFeed.appendChild(card);
      });
    } catch (err) {
      console.error("Error loading posts:", err);
      postsFeed.innerHTML = `<div class="feed-empty"><p>Error loading feed.</p></div>`;
    }
  }

  function renderCommentsList(comments) {
    if (!comments || comments.length === 0) return `<p style="font-size: 12px; color: #64748b; padding: 6px 0;">No comments yet. Start the conversation!</p>`;
    return comments.map(c => renderSingleComment(c)).join("");
  }

  function renderSingleComment(c) {
    const avatar = window.CodeStart.renderAvatarHtml(c.authorName || c.authorUsername, 26);
    return `
      <div class="comment-item">
        ${avatar}
        <div class="comment-body">
          <div class="comment-author">
            <span>${escapeHtml(c.authorName || c.authorUsername)}</span>
            <span class="comment-time">${formatTimeAgo(c.createdAt)}</span>
          </div>
          <div class="comment-text">${escapeHtml(c.text)}</div>
        </div>
      </div>
    `;
  }

  function escapeHtml(text) {
    if (!text) return "";
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // 5. Submit New Post
  submitPostBtn.addEventListener("click", async () => {
    const content = postContentInput.value.trim();
    if (!content) {
      showToast("Please write something to post!", "warning");
      return;
    }

    const language = postLanguageSelect.value;
    const scoreVal = postScoreSelect.value;
    let score = null;
    let badge = `${language} Developer`;

    if (scoreVal === "100") { score = 100; badge = `${language} Master 🏆`; }
    else if (scoreVal === "90") { score = 90; badge = `${language} Ace 🔥`; }
    else if (scoreVal === "80") { score = 80; badge = `${language} Scholar ✨`; }
    else if (scoreVal === "streak") { badge = `Streak Champion ⚡`; }

    submitPostBtn.disabled = true;
    submitPostBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Posting...`;

    try {
      await window.CodeStart.createPost({ content, language, score, badge });
      postContentInput.value = "";
      postScoreSelect.value = "";
      showToast("Posted to community feed! 🚀", "success");
      loadPosts();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      submitPostBtn.disabled = false;
      submitPostBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Post`;
    }
  });

  // 6. Filter Tabs
  filterTabs.querySelectorAll(".filter-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      filterTabs.querySelectorAll(".filter-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      activeFilter = tab.getAttribute("data-lang");
      loadPosts();
    });
  });

  // Initial Load
  loadPosts();
});
