/**
 * CodeStart / Learn2code — Compiler Execution History System
 * Automatically attaches to all 5 compiler pages to track & restore last 5 runs.
 */

(function () {
  "use strict";

  function detectLanguage() {
    const path = window.location.pathname.toLowerCase();
    if (path.includes("javascript")) return "javascript";
    if (path.includes("python")) return "python";
    if (path.includes("java-")) return "java";
    if (path.includes("cpp")) return "cpp";
    if (path.includes("c-")) return "c";
    return "general";
  }

  const currentLang = detectLanguage();

  function initHistoryUI() {
    // 1. Insert History button in toolbar if not already present
    if (document.getElementById("historyBtn")) return;

    const clearBtn = document.getElementById("clearOutBtn");
    if (!clearBtn || !clearBtn.parentElement) return;

    const historyBtn = document.createElement("button");
    historyBtn.className = "toolbar-btn";
    historyBtn.id = "historyBtn";
    historyBtn.title = "View Run History (Last 5)";
    historyBtn.innerHTML = `<i class="fa-solid fa-clock-rotate-left"></i>`;
    clearBtn.parentElement.insertBefore(historyBtn, clearBtn.nextSibling);

    // 2. Inject Modal Styles & HTML
    const style = document.createElement("style");
    style.textContent = `
      #historyModal {
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(8px);
        z-index: 99999; display: none; align-items: center; justify-content: center;
        opacity: 0; transition: opacity 0.25s ease;
      }
      #historyModal.active { display: flex; opacity: 1; }
      .history-card {
        background: #0f172a; border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px; width: 90%; max-width: 620px; max-height: 80vh;
        display: flex; flex-direction: column; overflow: hidden;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
        animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @keyframes scaleUp {
        from { transform: scale(0.95); } to { transform: scale(1); }
      }
      .history-header {
        padding: 20px 24px; border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        display: flex; align-items: center; justify-content: space-between;
      }
      .history-header h3 {
        font-size: 18px; font-weight: 700; color: #f8fafc; display: flex; align-items: center; gap: 10px;
      }
      .history-close-btn {
        background: none; border: none; color: #94a3b8; font-size: 20px; cursor: pointer;
      }
      .history-close-btn:hover { color: #fff; }
      .history-body {
        padding: 20px 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 14px;
      }
      .history-item {
        background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.07);
        border-radius: 12px; padding: 14px 16px; display: flex; flex-direction: column; gap: 10px;
        transition: border-color 0.2s;
      }
      .history-item:hover { border-color: rgba(59, 130, 246, 0.4); }
      .history-item-top {
        display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: #94a3b8;
      }
      .history-time-badge {
        background: rgba(59, 130, 246, 0.15); color: #60a5fa; padding: 2px 8px; border-radius: 100px; font-weight: 600;
      }
      .history-code-preview {
        background: #020617; border-radius: 8px; padding: 10px 12px;
        font-family: 'Consolas', monospace; font-size: 12px; color: #cbd5e1;
        max-height: 85px; overflow: hidden; white-space: pre; position: relative;
      }
      .history-code-preview::after {
        content: ""; position: absolute; bottom: 0; left: 0; width: 100%; height: 25px;
        background: linear-gradient(transparent, #020617); pointer-events: none;
      }
      .history-load-btn {
        align-self: flex-end; background: #2563eb; color: #fff; border: none;
        padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 600;
        cursor: pointer; transition: background 0.2s;
      }
      .history-load-btn:hover { background: #3b82f6; }
      .history-empty {
        text-align: center; color: #64748b; padding: 40px 20px; font-size: 14px;
      }
    `;
    document.head.appendChild(style);

    const modal = document.createElement("div");
    modal.id = "historyModal";
    modal.innerHTML = `
      <div class="history-card">
        <div class="history-header">
          <h3><i class="fa-solid fa-clock-rotate-left" style="color: #60a5fa;"></i> Recent Runs (Last 5)</h3>
          <button class="history-close-btn" id="closeHistoryModal">&times;</button>
        </div>
        <div class="history-body" id="historyList">
          <!-- Populated on open -->
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const closeBtn = document.getElementById("closeHistoryModal");
    closeBtn.addEventListener("click", () => modal.classList.remove("active"));
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("active");
    });

    historyBtn.addEventListener("click", () => {
      renderHistoryItems();
      modal.classList.add("active");
    });
  }

  function formatTimeAgo(timestamp) {
    const sec = Math.floor((Date.now() - timestamp) / 1000);
    if (sec < 60) return "Just now";
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m ago`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h ago`;
    return `${Math.floor(hr / 24)}d ago`;
  }

  function renderHistoryItems() {
    const list = document.getElementById("historyList");
    if (!list) return;

    let runs = [];
    if (window.CodeStart) {
      runs = window.CodeStart.getCompilerRuns(currentLang);
    } else {
      const currentUser = localStorage.getItem("currentUser") || "guest";
      runs = JSON.parse(localStorage.getItem(`codestart_runs_${currentUser}_${currentLang}`)) || [];
    }

    if (runs.length === 0) {
      list.innerHTML = `
        <div class="history-empty">
          <i class="fa-solid fa-code" style="font-size: 32px; margin-bottom: 12px; color: #475569; display: block;"></i>
          No execution runs saved yet.<br>Click <strong>Run (Ctrl+Enter)</strong> to compile and record your code!
        </div>
      `;
      return;
    }

    list.innerHTML = "";
    runs.forEach((run, idx) => {
      const item = document.createElement("div");
      item.className = "history-item";
      item.innerHTML = `
        <div class="history-item-top">
          <span>Run #${runs.length - idx} &bull; ${formatTimeAgo(run.timestamp)}</span>
          <span class="history-time-badge">${run.execTime || "completed"}</span>
        </div>
        <div class="history-code-preview">${escapeHtml(run.code)}</div>
        <button class="history-load-btn" data-run-id="${run.id}">
          <i class="fa-solid fa-arrow-up-right-from-square"></i> Load into Editor
        </button>
      `;

      item.querySelector(".history-load-btn").addEventListener("click", () => {
        const textarea = document.getElementById("code");
        if (textarea) {
          textarea.value = run.code;
          document.getElementById("historyModal").classList.remove("active");
          if (typeof showToast === "function") {
            showToast("Restored code from history! ⚡", "success");
          }
        }
      });

      list.appendChild(item);
    });
  }

  function escapeHtml(text) {
    if (!text) return "";
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // Hook into compiler run completion
  window.recordCompilerRun = function (code, output, execTime) {
    if (window.CodeStart) {
      window.CodeStart.saveCompilerRun(currentLang, code, output, execTime);
    } else {
      const currentUser = localStorage.getItem("currentUser") || "guest";
      const key = `codestart_runs_${currentUser}_${currentLang}`;
      let runs = JSON.parse(localStorage.getItem(key)) || [];
      runs.unshift({
        id: "run_" + Date.now(),
        lang: currentLang,
        code: code.trim(),
        output: (output || "").trim().substring(0, 300),
        execTime: execTime || "0ms",
        timestamp: Date.now()
      });
      if (runs.length > 5) runs = runs.slice(0, 5);
      localStorage.setItem(key, JSON.stringify(runs));
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHistoryUI);
  } else {
    initHistoryUI();
  }
})();
