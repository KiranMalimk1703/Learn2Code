// javascript-compiler.js — Learn2code Enhanced Compiler

// ── Templates ──
const JS_TEMPLATES = [
  { label: "Hello World",         code: 'console.log("Hello, World!");' },
  { label: "For Loop",            code: 'for (let i = 1; i <= 5; i++) {\n    console.log("Count: " + i);\n}' },
  { label: "Array Methods",       code: 'const nums = [1,2,3,4,5];\nconsole.log("Sum:", nums.reduce((a,b) => a+b, 0));\nconsole.log("Squares:", nums.map(n => n*n));' },
  { label: "Async/Await",         code: 'async function fetchData() {\n    try {\n        const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");\n        const data = await res.json();\n        console.log("Title:", data.title);\n    } catch(err) {\n        console.error("Error:", err);\n    }\n}\nfetchData();' },
  { label: "Class & OOP",         code: 'class Animal {\n    constructor(name) {\n        this.name = name;\n    }\n    speak() {\n        console.log(this.name + " makes a noise.");\n    }\n}\nclass Dog extends Animal {\n    speak() {\n        console.log(this.name + " barks.");\n    }\n}\nconst d = new Dog("Rex");\nd.speak();' },
  { label: "Fibonacci",           code: 'function fibonacci(n) {\n    if (n <= 1) return n;\n    return fibonacci(n-1) + fibonacci(n-2);\n}\nfor (let i = 0; i < 10; i++) {\n    process.stdout.write(fibonacci(i) + " ");\n}' },
];

// ── Font size control ──
let fontSize = 14;
const MIN_FONT = 10, MAX_FONT = 24;

function applyFontSize() {
    const ta = document.getElementById("code");
    if (ta) { ta.style.fontSize = fontSize + "px"; }
    const label = document.getElementById("fontSizeLabel");
    if (label) label.textContent = fontSize + "px";
}

// ── Init toolbar ──
document.addEventListener("DOMContentLoaded", () => {
    // Populate templates
    const sel = document.getElementById("templateSelect");
    if (sel) {
        JS_TEMPLATES.forEach((t, i) => {
            const opt = document.createElement("option");
            opt.value = i;
            opt.textContent = t.label;
            sel.appendChild(opt);
        });
        sel.addEventListener("change", () => {
            if (sel.value === "") return;
            document.getElementById("code").value = JS_TEMPLATES[+sel.value].code;
            sel.value = "";
            showToast("Template loaded!", "info");
        });
    }

    // Font size
    const incrBtn = document.getElementById("fontIncrBtn");
    const decrBtn = document.getElementById("fontDecrBtn");
    if (incrBtn) incrBtn.addEventListener("click", () => {
        if (fontSize < MAX_FONT) { fontSize += 2; applyFontSize(); }
    });
    if (decrBtn) decrBtn.addEventListener("click", () => {
        if (fontSize > MIN_FONT) { fontSize -= 2; applyFontSize(); }
    });
    applyFontSize();

    // Copy code
    const copyBtn = document.getElementById("copyBtn");
    if (copyBtn) copyBtn.addEventListener("click", () => {
        const code = document.getElementById("code").value;
        navigator.clipboard.writeText(code).then(() => {
            showToast("Code copied to clipboard!", "success");
        });
    });

    // Clear output
    const clearBtn = document.getElementById("clearOutBtn");
    if (clearBtn) clearBtn.addEventListener("click", () => {
        document.getElementById("output").innerHTML = "";
        const t = document.getElementById("execTime");
        if (t) t.textContent = "";
        showToast("Output cleared", "info");
    });

    // Fullscreen toggle
    const fsBtn = document.getElementById("fullscreenBtn");
    if (fsBtn) fsBtn.addEventListener("click", () => {
        const panel = document.querySelector(".glass-compiler-panel");
        if (!document.fullscreenElement) {
            panel.requestFullscreen().catch(() => {});
            fsBtn.innerHTML = '<i class="fa-solid fa-compress"></i>';
        } else {
            document.exitFullscreen();
            fsBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
        }
    });

    // Tab indent in editor
    const textarea = document.getElementById("code");
    if (textarea) {
        textarea.addEventListener("keydown", (e) => {
            if (e.key === "Tab") {
                e.preventDefault();
                const s = textarea.selectionStart, end = textarea.selectionEnd;
                textarea.value = textarea.value.substring(0, s) + "    " + textarea.value.substring(end);
                textarea.selectionStart = textarea.selectionEnd = s + 4;
            }
            // Ctrl+Enter to run
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                e.preventDefault();
                runit();
            }
        });
    }
});

function goBack() {
    window.location.href = "javascript/notes.html";
}

// ── AI Chat (Puter) ──
const chatPanel   = document.getElementById("aiChatPanel");
const chatInput   = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");
const typingIndicator = document.getElementById("typingIndicator");

function toggleChat() {
    chatPanel.classList.toggle("active");
    if (chatPanel.classList.contains("active") && chatInput) chatInput.focus();
}

function handleKeyPress(e) {
    if (e.key === "Enter") sendMessage();
}

function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;
    appendMessage(text, "user");
    chatInput.value = "";
    chatMessages.appendChild(typingIndicator);
    typingIndicator.style.display = "block";
    chatMessages.scrollTop = chatMessages.scrollHeight;
    generateAIResponse(text);
}

function appendMessage(text, sender) {
    const msgDiv = document.createElement("div");
    msgDiv.className = "msg msg-" + sender;
    msgDiv.innerHTML = text;
    chatMessages.insertBefore(msgDiv, typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function generateAIResponse(query) {
    try {
        const systemPrompt = "You are a friendly, highly knowledgeable JavaScript programming tutor called 'Learn2code AI'. You are helping a student who is currently using an online JavaScript compiler. Keep your answers concise, accurate, and use HTML formatting (like <code> for code snippets, <b> for emphasis, and <br> for line breaks). Do not use Markdown, ONLY use HTML tags for formatting.";
        if (typeof puter !== "undefined" && puter.ai) {
            const response = await puter.ai.chat("System: " + systemPrompt + "\n\nUser: " + query);
            typingIndicator.style.display = "none";
            let msg = typeof response === "string" ? response : (response.message?.content || response.text || "I am having trouble thinking right now.");
            msg = msg.replace(/\n\n/g, "<br><br>").replace(/\n/g, "<br>");
            appendMessage(msg, "ai");
        } else { throw new Error("Puter AI not loaded."); }
    } catch (err) {
        typingIndicator.style.display = "none";
        appendMessage("Sorry, I am having trouble connecting. Error: " + err.message, "ai");
    }
}

// ── Run Code (Judge0) ──
async function runit() {
    const code    = document.getElementById("code").value;
    const stdin   = document.getElementById("stdinBox").value;
    const mypre   = document.getElementById("output");
    const runBtn  = document.getElementById("runBtn");
    const spinner = document.getElementById("loadingSpinner");
    const execEl  = document.getElementById("execTime");

    mypre.innerHTML = "";
    if (execEl) execEl.textContent = "";
    runBtn.disabled = true;
    spinner.style.display = "block";
    const startTime = Date.now();

    try {
        const response = await fetch("https://ce.judge0.com/submissions?base64_encoded=false&wait=true", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ language_id: 63, source_code: code, stdin: stdin })
        });
        const data = await response.json();
        const elapsed = Date.now() - startTime;

        spinner.style.display = "none";
        runBtn.disabled = false;
        if (execEl) execEl.textContent = "⏱ " + elapsed + "ms";

        if (data.compile_output) {
            mypre.innerHTML += '<span class="output-error">Compilation Error:\n' + data.compile_output + '</span>';
        } else if (data.status && data.status.id >= 6) {
            mypre.innerHTML += '<span class="output-error">Status: ' + data.status.description + '</span>\n';
            if (data.stderr) mypre.innerHTML += '<span class="output-error">' + data.stderr + '</span>';
        } else {
            if (data.stdout) mypre.innerText += data.stdout;
            if (data.stderr) mypre.innerHTML += '<span class="output-error">' + data.stderr + '</span>';
        }
    } catch (err) {
        spinner.style.display = "none";
        runBtn.disabled = false;
        mypre.innerHTML += '<span class="output-error">Failed to connect to compiler.\n' + err.toString() + '</span>';
    }
    document.getElementById("terminal").scrollTop = document.getElementById("terminal").scrollHeight;
}