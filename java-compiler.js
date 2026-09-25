// java-compiler.js — Learn2code Enhanced Java Compiler

// ── Java Templates ──
const JAVA_TEMPLATES = [
  {
    label: "Hello World",
    code: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n        System.out.println("Welcome to Learn2code Java Compiler.");\n    }\n}\n`
  },
  {
    label: "OOP: Classes & Objects",
    code: `class Student {\n    private String name;\n    private int score;\n\n    public Student(String name, int score) {\n        this.name = name;\n        this.score = score;\n    }\n\n    public void display() {\n        System.out.println("Student: " + name + " | Score: " + score);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Student s1 = new Student("Kiran", 95);\n        Student s2 = new Student("Priya", 98);\n        s1.display();\n        s2.display();\n    }\n}\n`
  },
  {
    label: "User Input (Scanner)",
    code: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Provide input in the Standard Input box below before running!\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextLine()) {\n            String name = scanner.nextLine();\n            System.out.println("Hello, " + name + "! Welcome to Java programming.");\n        } else {\n            System.out.println("No input provided. Enter input in the stdin box below!");\n        }\n        scanner.close();\n    }\n}\n`
  },
  {
    label: "ArrayList & Collections",
    code: `import java.util.ArrayList;\nimport java.util.Collections;\n\npublic class Main {\n    public static void main(String[] args) {\n        ArrayList<String> languages = new ArrayList<>();\n        languages.add("Java");\n        languages.add("Python");\n        languages.add("JavaScript");\n        languages.add("C++");\n\n        Collections.sort(languages);\n\n        System.out.println("Sorted Languages:");\n        for (String lang : languages) {\n            System.out.println("• " + lang);\n        }\n    }\n}\n`
  },
  {
    label: "Exception Handling",
    code: `public class Main {\n    public static void main(String[] args) {\n        try {\n            int a = 50;\n            int b = 0;\n            System.out.println("Result: " + (a / b));\n        } catch (ArithmeticException e) {\n            System.out.println("Caught Exception: Cannot divide by zero! (" + e.getMessage() + ")");\n        } finally {\n            System.out.println("Cleanup executed in finally block.");\n        }\n    }\n}\n`
  },
  {
    label: "Fibonacci Sequence",
    code: `public class Main {\n    public static void main(String[] args) {\n        int n = 10, t1 = 0, t2 = 1;\n        System.out.print("First " + n + " Fibonacci terms: ");\n        for (int i = 1; i <= n; ++i) {\n            System.out.print(t1 + " ");\n            int sum = t1 + t2;\n            t1 = t2;\n            t2 = sum;\n        }\n        System.out.println();\n    }\n}\n`
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
        JAVA_TEMPLATES.forEach((t, i) => {
            const opt = document.createElement("option");
            opt.value = i;
            opt.textContent = t.label;
            sel.appendChild(opt);
        });
        sel.addEventListener("change", () => {
            if (sel.value === "") return;
            document.getElementById("code").value = JAVA_TEMPLATES[+sel.value].code;
            sel.value = "";
            if (window.showToast) showToast("Java template loaded!", "info");
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
            if (window.showToast) showToast("Java code copied to clipboard!", "success");
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
    window.location.href = "java/notes.html";
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
        const systemPrompt = "You are a friendly, highly knowledgeable Java programming tutor called 'Learn2code AI'. You are helping a student who is currently using an online Java compiler. You specialize in Core Java, JVM architecture, OOP, multithreading, and enterprise best practices. Keep your answers concise, accurate, and use HTML formatting (like <code> for code snippets, <b> for emphasis, and <br> for line breaks). Do not use Markdown, ONLY use HTML tags for formatting.";

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

// ── Java Compiler Execution (Judge0 API) ──
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
                language_id: 62, // Java (OpenJDK 13.0.1)
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
