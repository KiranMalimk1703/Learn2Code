/**
 * Learn2code — Global Toast Notification System
 * Usage: showToast("message", "success" | "error" | "info" | "warning")
 */
(function () {
  "use strict";

  function initToast() {
    if (document.getElementById("toast-container")) return;
    const style = document.createElement("style");
    style.textContent = `
      #toast-container {
        position: fixed; top: 24px; right: 24px;
        z-index: 99999; display: flex; flex-direction: column;
        gap: 12px; pointer-events: none;
      }
      .toast {
        display: flex; align-items: center; gap: 12px;
        padding: 14px 20px; border-radius: 14px;
        font-family: "Outfit", sans-serif; font-size: 15px;
        font-weight: 500; color: #f8fafc;
        background: rgba(17,24,39,0.95);
        backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(255,255,255,0.08);
        box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        pointer-events: all; min-width: 280px; max-width: 380px;
        animation: toastIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards;
        position: relative; overflow: hidden;
      }
      .toast.removing { animation: toastOut 0.3s ease forwards; }
      .toast-icon {
        width: 36px; height: 36px; border-radius: 10px;
        display: flex; align-items: center; justify-content: center;
        font-size: 16px; flex-shrink: 0;
      }
      .toast-success .toast-icon { background: rgba(16,185,129,0.15); color: #10b981; }
      .toast-error   .toast-icon { background: rgba(239,68,68,0.15);  color: #ef4444; }
      .toast-info    .toast-icon { background: rgba(59,130,246,0.15); color: #3b82f6; }
      .toast-warning .toast-icon { background: rgba(245,158,11,0.15); color: #f59e0b; }
      .toast-bar {
        position: absolute; bottom: 0; left: 0; height: 3px;
        border-radius: 0 0 14px 14px; animation: toastBar 3.2s linear forwards;
      }
      .toast-success .toast-bar { background: #10b981; }
      .toast-error   .toast-bar { background: #ef4444; }
      .toast-info    .toast-bar { background: #3b82f6; }
      .toast-warning .toast-bar { background: #f59e0b; }
      .toast-close {
        margin-left: auto; background: none; border: none;
        color: #64748b; cursor: pointer; font-size: 16px;
        padding: 0; line-height: 1; flex-shrink: 0; transition: color 0.2s;
      }
      .toast-close:hover { color: #f8fafc; }
      @keyframes toastIn {
        from { opacity: 0; transform: translateX(40px) scale(0.95); }
        to   { opacity: 1; transform: translateX(0)    scale(1);    }
      }
      @keyframes toastOut {
        from { opacity: 1; transform: translateX(0)    scale(1);   max-height: 80px; }
        to   { opacity: 0; transform: translateX(40px) scale(0.9); max-height: 0;    }
      }
      @keyframes toastBar { from { width: 100%; } to { width: 0%; } }
    `;
    document.head.appendChild(style);
    const container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }

  const ICONS = {
    success: "<i class=\"fa-solid fa-circle-check\"></i>",
    error:   "<i class=\"fa-solid fa-circle-xmark\"></i>",
    info:    "<i class=\"fa-solid fa-circle-info\"></i>",
    warning: "<i class=\"fa-solid fa-triangle-exclamation\"></i>",
  };

  window.showToast = function (message, type, duration) {
    type = type || "info";
    duration = duration || 3200;
    initToast();
    var container = document.getElementById("toast-container");
    var toast = document.createElement("div");
    toast.className = "toast toast-" + type;
    toast.innerHTML =
      "<div class=\"toast-icon\">" + (ICONS[type] || ICONS.info) + "</div>" +
      "<span>" + message + "</span>" +
      "<button class=\"toast-close\" aria-label=\"Close\">\u2715</button>" +
      "<div class=\"toast-bar\"></div>";
    var closeBtn = toast.querySelector(".toast-close");
    var remove = function() {
      toast.classList.add("removing");
      setTimeout(function() { toast.remove(); }, 320);
    };
    closeBtn.addEventListener("click", remove);
    container.appendChild(toast);
    setTimeout(remove, duration);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initToast);
  } else {
    initToast();
  }
})();
