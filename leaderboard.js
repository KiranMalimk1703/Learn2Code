/**
 * CodeStart / Learn2code — Global Leaderboard Engine
 */

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = window.CodeStart.getCurrentUsername();
  const podiumContainer = document.getElementById("podiumContainer");
  const leaderboardTbody = document.getElementById("leaderboardTbody");
  const langFilters = document.getElementById("langFilters");

  let activeLang = "all";

  function renderLeaderboard() {
    const data = window.CodeStart.getLeaderboard(activeLang);

    // 1. Render Top 3 Podium
    podiumContainer.innerHTML = "";
    const top3 = data.slice(0, 3);

    if (top3.length > 0) {
      // Re-order for visual display: Silver (2nd) on left, Gold (1st) in center, Bronze (3rd) on right
      const gold = top3[0];
      const silver = top3[1] || null;
      const bronze = top3[2] || null;

      // 2nd Place Silver
      if (silver) {
        podiumContainer.appendChild(createPodiumCard(silver, 2, "silver", "🥈"));
      }
      // 1st Place Gold
      if (gold) {
        podiumContainer.appendChild(createPodiumCard(gold, 1, "gold", "🥇"));
      }
      // 3rd Place Bronze
      if (bronze) {
        podiumContainer.appendChild(createPodiumCard(bronze, 3, "bronze", "🥉"));
      }
    }

    // 2. Render Table
    leaderboardTbody.innerHTML = "";
    if (data.length === 0) {
      leaderboardTbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; color: #64748b; padding: 40px;">
            No users tracked in this category yet.
          </td>
        </tr>
      `;
      return;
    }

    data.forEach((user, index) => {
      const rank = index + 1;
      const isYou = currentUser && user.username.toLowerCase() === currentUser.toLowerCase();

      const tr = document.createElement("tr");
      if (isYou) tr.className = "current-user-row";

      let rankClass = "";
      if (rank === 1) rankClass = "rank-top-1";
      else if (rank === 2) rankClass = "rank-top-2";
      else if (rank === 3) rankClass = "rank-top-3";

      const avatarHtml = window.CodeStart.renderAvatarHtml(user.fullname || user.username, 36);

      tr.innerHTML = `
        <td class="rank-cell ${rankClass}">#${rank}</td>
        <td>
          <div class="developer-cell">
            ${avatarHtml}
            <div>
              <a href="user-profile.html?user=${encodeURIComponent(user.username)}" class="developer-name">
                ${escapeHtml(user.fullname || user.username)}
                ${isYou ? `<span class="you-badge">YOU</span>` : ""}
              </a>
              <div class="developer-username">@${escapeHtml(user.username)}</div>
            </div>
          </div>
        </td>
        <td><span style="font-weight: 600; color: #cbd5e1;">${escapeHtml(user.language)}</span></td>
        <td><span style="color: #f97316; font-weight: 600;">🔥 ${user.streak || 1}d</span></td>
        <td>${user.exercisesDone} / 30</td>
        <td>
          <span style="font-weight: 700; color: ${user.avgPercent >= 90 ? '#10b981' : user.avgPercent >= 70 ? '#3b82f6' : '#94a3b8'};">
            ${user.avgPercent}%
          </span>
        </td>
        <td style="font-weight: 800; color: #f59e0b;">${user.totalXP.toLocaleString()} XP</td>
      `;

      leaderboardTbody.appendChild(tr);
    });
  }

  function createPodiumCard(user, rank, tierClass, medal) {
    const card = document.createElement("div");
    card.className = `podium-card ${tierClass}`;

    const avatarHtml = window.CodeStart.renderAvatarHtml(user.fullname || user.username, rank === 1 ? 64 : 52);

    card.innerHTML = `
      ${rank === 1 ? `<div class="podium-crown">👑</div>` : ""}
      <div style="position: relative;">
        ${avatarHtml}
        <div class="podium-rank-badge">${rank}</div>
      </div>
      <a href="user-profile.html?user=${encodeURIComponent(user.username)}" class="podium-name">
        ${escapeHtml(user.fullname || user.username)}
      </a>
      <div class="podium-username">@${escapeHtml(user.username)}</div>
      <div class="podium-stats">
        <span class="podium-stat-pill" style="color: #10b981;">${user.avgPercent}% Acc</span>
        <span class="podium-stat-pill" style="color: #f59e0b;">${user.totalXP.toLocaleString()} XP</span>
      </div>
    `;
    return card;
  }

  function escapeHtml(text) {
    if (!text) return "";
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // 3. Filter Chips
  langFilters.querySelectorAll(".filter-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      langFilters.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      activeLang = chip.getAttribute("data-lang");
      renderLeaderboard();
    });
  });

  // Initial Load
  renderLeaderboard();
});
