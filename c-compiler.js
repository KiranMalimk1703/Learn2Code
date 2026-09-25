// c-compiler.js — Learn2code Enhanced C Compiler

// ── C Templates ──
const C_TEMPLATES = [
  {
    label: "Hello World",
    code: `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    printf("Welcome to Learn2code C Compiler.\\n");\n    return 0;\n}\n`
  },
  {
    label: "User Input (scanf)",
    code: `#include <stdio.h>\n\nint main() {\n    // Provide input in the Standard Input box below before running!\n    char name[50];\n    int age;\n\n    printf("Enter your name and age:\\n");\n    if (scanf("%49s %d", name, &age) == 2) {\n        printf("Hello, %s! You are %d years old.\\n", name, age);\n    } else {\n        printf("No input received. Enter your input in the stdin box below!\\n");\n    }\n    return 0;\n}\n`
  },
  {
    label: "Pointers & Memory",
    code: `#include <stdio.h>\n\nvoid swap(int *a, int *b) {\n    int temp = *a;\n    *a = *b;\n    *b = temp;\n}\n\nint main() {\n    int x = 10, y = 20;\n    printf("Before swap: x = %d, y = %d\\n", x, y);\n    \n    swap(&x, &y);\n    printf("After swap:  x = %d, y = %d\\n", x, y);\n    \n    return 0;\n}\n`
  },
  {
    label: "Structs & Functions",
    code: `#include <stdio.h>\n#include <string.h>\n\nstruct Student {\n    char name[50];\n    int roll;\n    float marks;\n};\n\nvoid display(struct Student s) {\n    printf("Student: %s | Roll: %d | Marks: %.1f\\n", s.name, s.roll, s.marks);\n}\n\nint main() {\n    struct Student s1;\n    strcpy(s1.name, "Kiran");\n    s1.roll = 101;\n    s1.marks = 94.5;\n    \n    display(s1);\n    return 0;\n}\n`
  },
  {
    label: "Dynamic Memory (malloc)",
    code: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n = 5;\n    int *arr = (int*) malloc(n * sizeof(int));\n    \n    if (arr == NULL) {\n        printf("Memory allocation failed!\\n");\n        return 1;\n    }\n    \n    for (int i = 0; i < n; i++) {\n        arr[i] = (i + 1) * 10;\n    }\n    \n    printf("Dynamically allocated array: ");\n    for (int i = 0; i < n; i++) {\n        printf("%d ", arr[i]);\n    }\n    printf("\\n");\n    \n    free(arr);\n    printf("Memory freed successfully.\\n");\n    return 0;\n}\n`
  },
  {
    label: "Fibonacci Sequence",
    code: `#include <stdio.h>\n\nint main() {\n    int n = 10, t1 = 0, t2 = 1, nextTerm;\n    printf("First %d Fibonacci numbers: ", n);\n    for (int i = 1; i <= n; ++i) {\n        printf("%d ", t1);\n        nextTerm = t1 + t2;\n        t1 = t2;\n        t2 = nextTerm;\n    }\n    printf("\\n");\n    return 0;\n}\n`
  }
];

// ── Font size control ──
let fontSize = 14;
const MIN_FONT = 10, MAX_FONT = 24;

function applyFontSize() {
    const ta = document.getElementById("code");
    if (ta) ta.style.fontSize = fontSize + "px";
    const label = document.getElementById("fontSizeLabel");
    if (label) label.textContent = fontSize + "px";
}

// ── Init Toolbar & Editor ──
document.addEventListener("DOMContentLoaded", () => {
    // Populate templates dropdown
    const sel = document.getElementById("templateSelect");
    if (sel) {
        C_TEMPLATES.forEach((t, i) => {
            const opt = document.createElement("option");
            opt.value = i;
            opt.textContent = t.label;
            sel.appendChild(opt);
        });
        sel.addEventListener("change", () => {
            if (sel.value === "") return;
            document.getElementById("code").value = C_TEMPLATES[+sel.value].code;
            sel.value = "";
            if (window.showToast) showToast("C template loaded!", "info");
        });
    }

    // Font size controls
    const incrBtn = document.getElementById("fontIncrBtn");
    const decrBtn = document.getElementById("fontDecrBtn");
    if (incrBtn) incrBtn.addEventListener("click", () => {
        if (fontSize < MAX_FONT) { fontSize += 2; applyFontSize(); }
    });
    if (decrBtn) decrBtn.addEventListener("click", () => {
        if (fontSize > MIN_FONT) { fontSize -= 2; applyFontSize(); }
    });
    applyFontSize();

    // Copy code button
    const copyBtn = document.getElementById("copyBtn");
    if (copyBtn) copyBtn.addEventListener("click", () => {
        const code = document.getElementById("code").value;
        navigator.clipboard.writeText(code).then(() => {
            if (window.showToast) showToast("C code copied to clipboard!", "success");
        }).catch(() => {
            if (window.showToast) showToast("Failed to copy code.", "error");
        });
    });

    // Clear output button
    const clearBtn = document.getElementById("clearOutBtn");
    if (clearBtn) clearBtn.addEventListener("click", () => {
        const out = document.getElementById("output");
        if (out) out.innerHTML = "";
        const t = document.getElementById("execTime");
        if (t) t.textContent = "";
        if (window.showToast) showToast("Output cleared", "info");
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

    // Editor Tab Indent & Ctrl+Enter run
    const textarea = document.getElementById("code");
    if (textarea) {
        textarea.addEventListener("keydown", function(e) {
            if (e.key === "Tab") {
                e.preventDefault();
                const start = this.selectionStart;
                const end = this.selectionEnd;
                this.value = this.value.substring(0, start) + "    " + this.value.substring(end);
                this.selectionStart = this.selectionEnd = start + 4;
            }
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                e.preventDefault();
                runit();
            }
        });
    }
});

function goBack() {
    window.location.href = "C/notes.html";
}

// ── AI Assistant Functionality ──
const chatPanel = document.getElementById("aiChatPanel");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");
const typingIndicator = document.getElementById("typingIndicator");

function toggleChat() {
    chatPanel.classList.toggle("active");
    if (chatPanel.classList.contains("active") && chatInput) {
        chatInput.focus();
    }
}

function handleKeyPress(e) {
    if (e.key === "Enter") {
        sendMessage();
    }
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
    msgDiv.className = `msg msg-${sender}`;
    msgDiv.innerHTML = text;
    chatMessages.insertBefore(msgDiv, typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function generateAIResponse(query) {
    try {
        const systemPrompt = "You are a friendly, highly knowledgeable C programming tutor called 'Learn2code AI'. You are helping a student who is currently using an online C compiler. Keep your answers concise, accurate, and use HTML formatting (like <code> for code snippets, <b> for emphasis, and <br> for line breaks). Do not use Markdown, ONLY use HTML tags for formatting.";

        if (typeof puter !== "undefined" && puter.ai) {
            const response = await puter.ai.chat(
                `System: ${systemPrompt}\n\nUser: ${query}`
            );
            typingIndicator.style.display = "none";
            let finalMessage = typeof response === "string" ? response : (response.message?.content || response.text || "I'm having trouble thinking right now.");
            finalMessage = finalMessage.replace(/\n\n/g, "<br><br>").replace(/\n/g, "<br>");
            appendMessage(finalMessage, "ai");
        } else {
            throw new Error("Puter AI not loaded.");
        }
    } catch (error) {
        console.error("AI Error:", error);
        typingIndicator.style.display = "none";
        appendMessage("Sorry, I'm having trouble connecting to my brain right now. Please try asking again in a moment! (Error: " + error.message + ")", "ai");
    }
}

// ── C Compiler Execution (Judge0 API) ──
async function runit() {
    const code = document.getElementById("code").value;
    const stdin = document.getElementById("stdinBox").value;
    const mypre = document.getElementById("output");
    const runBtn = document.getElementById("runBtn");
    const spinner = document.getElementById("loadingSpinner");
    const execEl = document.getElementById("execTime");
    
    mypre.innerText = "";
    mypre.className = ""; 
    if (execEl) execEl.textContent = "";
    
    runBtn.disabled = true;
    spinner.style.display = "block";
    const startTime = Date.now();
    
    try {
        const response = await fetch("https://ce.judge0.com/submissions?base64_encoded=false&wait=true", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                language_id: 50, // C (GCC 9.2.0)
                source_code: code,
                stdin: stdin
            })
        });

        const data = await response.json();
        const elapsed = Date.now() - startTime;
        
        spinner.style.display = "none";
        runBtn.disabled = false;
        if (execEl) execEl.textContent = "⏱ " + elapsed + "ms";

        if (data.compile_output) {
            mypre.innerHTML += `<span class="output-error">Compilation Error:\n${data.compile_output}</span>`;
        } else if (data.status && data.status.id >= 6) {
             mypre.innerHTML += `<span class="output-error">Status: ${data.status.description}</span>\n`;
             if (data.stderr) {
                 mypre.innerHTML += `<span class="output-error">${data.stderr}</span>`;
             }
        } else {
            if (data.stdout) {
                mypre.innerText += data.stdout;
            }
            if (data.stderr) {
                mypre.innerHTML += `<span class="output-error">${data.stderr}</span>`;
            }
        }

        if (window.recordCompilerRun) {
            window.recordCompilerRun(code, mypre.innerText, elapsed + "ms");
        }

    } catch (err) {
        spinner.style.display = "none";
        runBtn.disabled = false;
        mypre.innerHTML += `<span class="output-error">Failed to connect to compiler engine.\n${err.toString()}</span>`;
    }
    
    // Auto-scroll to bottom of terminal
    const terminal = document.getElementById("terminal");
    terminal.scrollTop = terminal.scrollHeight;
}
