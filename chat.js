/**
 * CodeStart / Learn2code — Real-Time Chat Engine
 */

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = window.CodeStart.getCurrentUsername() || "Guest User";
  const userSearchInput = document.getElementById("userSearchInput");
  const directMessagesList = document.getElementById("directMessagesList");
  const channelGeneral = document.getElementById("channelGeneral");
  const chatHeaderAvatar = document.getElementById("chatHeaderAvatar");
  const chatHeaderName = document.getElementById("chatHeaderName");
  const chatHeaderStatus = document.getElementById("chatHeaderStatus");
  const chatMessages = document.getElementById("chatMessages");
  const chatInputField = document.getElementById("chatInputField");
  const chatSendBtn = document.getElementById("chatSendBtn");
  const quickEmojiBtns = document.querySelectorAll(".emoji-btn");

  let activeChannel = "general";
  let activePeer = null;

  // 1. Check for `?chatWith=USERNAME`
  const urlParams = new URLSearchParams(window.location.search);
  const requestedChat = urlParams.get("chatWith");

  // 2. Generate Deterministic 1-on-1 Channel ID
  function getDmChannelId(u1, u2) {
    return [u1.toLowerCase(), u2.toLowerCase()].sort().join("_dm_");
  }

  // 3. Format Time
  function formatTime(timestamp) {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // 4. Render Sidebar Direct Messages List
  function renderDirectMessagesList(searchTerm = "") {
    const users = JSON.parse(localStorage.getItem("users")) || {};
    directMessagesList.innerHTML = "";

    const userKeys = Object.keys(users).filter(u => u !== currentUser);

    const filtered = userKeys.filter(u => {
      const p = users[u].profile || {};
      const match = u.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    (p.fullname && p.fullname.toLowerCase().includes(searchTerm.toLowerCase()));
      return match;
    });

    if (filtered.length === 0) {
      directMessagesList.innerHTML = `<div style="font-size: 12px; color: #64748b; padding: 12px; text-align: center;">No developers found</div>`;
      return;
    }

    filtered.forEach(username => {
      const uData = users[username];
      const p = uData.profile || {};
      const displayName = p.fullname || username;
      const dmChannel = getDmChannelId(currentUser, username);
      const isActive = activeChannel === dmChannel;

      const item = document.createElement("div");
      item.className = `chat-item ${isActive ? "active" : ""}`;
      item.setAttribute("data-dm", username);

      const avatarHtml = window.CodeStart.renderAvatarHtml(displayName, 38);

      item.innerHTML = `
        <div class="chat-item-avatar-wrap">
          ${avatarHtml}
          <div class="online-dot"></div>
        </div>
        <div class="chat-item-info">
          <div class="chat-item-top">
            <div class="chat-item-name">${escapeHtml(displayName)}</div>
            <span style="font-size: 10px; color: #10b981;">Online</span>
          </div>
          <div class="chat-item-preview">@${escapeHtml(username)} &bull; ${escapeHtml(p.language || "Coder")}</div>
        </div>
      `;

      item.addEventListener("click", () => {
        selectDirectMessage(username, displayName);
      });

      directMessagesList.appendChild(item);
    });
  }

  // 5. Switch to Direct Message
  function selectDirectMessage(username, displayName) {
    activePeer = username;
    activeChannel = getDmChannelId(currentUser, username);

    channelGeneral.classList.remove("active");
    document.querySelectorAll("#directMessagesList .chat-item").forEach(el => {
      el.classList.toggle("active", el.getAttribute("data-dm") === username);
    });

    // Update Header
    chatHeaderAvatar.innerHTML = window.CodeStart.renderAvatarHtml(displayName, 42);
    chatHeaderName.textContent = displayName;
    chatHeaderStatus.innerHTML = `
      <span style="width: 7px; height: 7px; background: #10b981; border-radius: 50%; display: inline-block;"></span>
      <span>Direct Message &bull; @${escapeHtml(username)}</span>
    `;

    loadMessages();
    // Close sidebar on mobile
    const sidebar = document.getElementById("chatSidebar");
    if (sidebar) sidebar.classList.remove("active");
  }

  // 6. Switch to #general
  channelGeneral.addEventListener("click", () => {
    activePeer = null;
    activeChannel = "general";

    channelGeneral.classList.add("active");
    document.querySelectorAll("#directMessagesList .chat-item").forEach(el => el.classList.remove("active"));

    chatHeaderAvatar.innerHTML = `<div style="width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #8b5cf6); display: flex; align-items: center; justify-content: center; font-weight: 700; color: #fff;">#</div>`;
    chatHeaderName.textContent = "#general";
    chatHeaderStatus.innerHTML = `
      <span style="width: 7px; height: 7px; background: #10b981; border-radius: 50%; display: inline-block;"></span>
      <span>Active Channel &bull; Real-time</span>
    `;

    loadMessages();
    const sidebar = document.getElementById("chatSidebar");
    if (sidebar) sidebar.classList.remove("active");
  });

  // 7. Load & Render Messages
  function loadMessages() {
    chatMessages.innerHTML = "";
    const messages = window.CodeStart.getChatMessages(activeChannel);

    if (messages.length === 0) {
      chatMessages.innerHTML = `
        <div style="text-align: center; color: #64748b; padding: 40px 20px;">
          <i class="fa-regular fa-comments" style="font-size: 36px; margin-bottom: 12px; display: block; color: #334155;"></i>
          <strong>No messages yet</strong>
          <p style="font-size: 13px; margin-top: 4px;">Send a message to break the ice!</p>
        </div>
      `;
      return;
    }

    messages.forEach(msg => {
      appendMessageToUI(msg);
    });

    scrollToBottom();
  }

  function appendMessageToUI(msg) {
    const isSent = msg.sender === currentUser;
    const wrap = document.createElement("div");
    wrap.className = `message-bubble-wrap ${isSent ? "sent" : "received"}`;

    const avatarHtml = window.CodeStart.renderAvatarHtml(msg.senderName || msg.sender, 32);

    wrap.innerHTML = `
      ${avatarHtml}
      <div>
        <div class="message-bubble">${escapeHtml(msg.text)}</div>
        <div class="message-meta">
          ${!isSent ? `<span>${escapeHtml(msg.senderName || msg.sender)}</span> &bull; ` : ""}
          <span>${formatTime(msg.timestamp)}</span>
        </div>
      </div>
    `;

    chatMessages.appendChild(wrap);
  }

  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function escapeHtml(text) {
    if (!text) return "";
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // 8. Send Message
  async function handleSend() {
    const text = chatInputField.value.trim();
    if (!text) return;

    chatInputField.value = "";
    try {
      const msg = await window.CodeStart.sendChatMessage(activeChannel, text);
      // Remove empty state if present
      const emptyState = chatMessages.querySelector("div[style*='text-align: center']");
      if (emptyState) emptyState.remove();

      appendMessageToUI(msg);
      scrollToBottom();
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  chatSendBtn.addEventListener("click", handleSend);
  chatInputField.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  });

  // 9. Quick Emoji Buttons
  quickEmojiBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      chatInputField.value += btn.getAttribute("data-emoji");
      chatInputField.focus();
    });
  });

  // 10. Search Users in Sidebar
  if (userSearchInput) {
    userSearchInput.addEventListener("input", (e) => {
      renderDirectMessagesList(e.target.value.trim());
    });
  }

  // 11. Listen to Real-Time Updates (Broadcasted across windows)
  window.addEventListener("codestart_new_message", (e) => {
    if (e.detail && e.detail.channelId === activeChannel) {
      if (e.detail.msg.sender !== currentUser) {
        appendMessageToUI(e.detail.msg);
        scrollToBottom();
      }
    }
  });

  // Firestore Real-Time listener if live
  if (window.CodeStart.isLiveCloud && window.CodeStart.firebase.db) {
    window.CodeStart.firebase.db
      .collection("chats")
      .doc(activeChannel)
      .collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot((snap) => {
        snap.docChanges().forEach((change) => {
          if (change.type === "added") {
            const data = change.doc.data();
            if (data.sender !== currentUser) {
              appendMessageToUI(data);
              scrollToBottom();
            }
          }
        });
      });
  }

  // Initial Render
  renderDirectMessagesList();

  if (requestedChat && requestedChat !== currentUser) {
    const users = JSON.parse(localStorage.getItem("users")) || {};
    const dName = users[requestedChat]?.profile?.fullname || requestedChat;
    selectDirectMessage(requestedChat, dName);
  } else {
    loadMessages();
  }
});
