// python-compiler.js — Learn2code Enhanced Python Compiler

// ── Python Templates ──
const PYTHON_TEMPLATES = [
  {
    label: "Hello World & Input",
    code: `# Basic Input and Output in Python\nname = input("Enter your name: ")\nprint(f"Hello, {name}! Welcome to Learn2code.")\n`
  },
  {
    label: "Loops & Lists",
    code: `# Lists and List Comprehensions\nnumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\nevens = [n for n in numbers if n % 2 == 0]\nsquares = [n**2 for n in evens]\n\nprint("Original:", numbers)\nprint("Even numbers:", evens)\nprint("Squares of evens:", squares)\n`
  },
  {
    label: "Functions & Dictionaries",
    code: `# Functions and Dictionaries\ndef calculate_stats(scores):\n    total = sum(scores.values())\n    avg = total / len(scores)\n    highest = max(scores, key=scores.get)\n    return total, avg, highest\n\nstudent_scores = {"Alice": 92, "Bob": 85, "Charlie": 97, "Diana": 89}\ntot, avg, top = calculate_stats(student_scores)\nprint(f"Total: {tot} | Average: {avg:.1f} | Top Performer: {top} ({student_scores[top]} pts)")\n`
  },
  {
    label: "Object-Oriented Programming",
    code: `# OOP: Classes and Inheritance\nclass Person:\n    def __init__(self, name, role):\n        self.name = name\n        self.role = role\n\n    def introduce(self):\n        return f"Hi, I am {self.name} and I work as a {self.role}."\n\nclass Student(Person):\n    def __init__(self, name, grade):\n        super().__init__(name, "Student")\n        self.grade = grade\n\n    def introduce(self):\n        return f"{super().introduce()} Current Grade: {self.grade}"\n\ns = Student("Kiran", "A+")\nprint(s.introduce())\n`
  },
  {
    label: "Fibonacci Sequence",
    code: `# Recursive / Iterative Fibonacci\ndef fibonacci(n):\n    sequence = [0, 1]\n    while len(sequence) < n:\n        sequence.append(sequence[-1] + sequence[-2])\n    return sequence[:n]\n\nprint("First 10 Fibonacci numbers:", fibonacci(10))\n`
  },
  {
    label: "Number Guessing Game",
    code: `# Interactive Number Guessing Simulation\nsecret = 7\nprint("Welcome to Guess the Number (1-10)!")\nguess = int(input("Take a guess: "))\n\nif guess == secret:\n    print("🎉 Incredible! You guessed it correctly!")\nelif guess < secret:\n    print("Too low! Better luck next time.")\nelse:\n    print("Too high! Better luck next time.")\n`
  }
];

// ── Font Size Control ──
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
        PYTHON_TEMPLATES.forEach((t, i) => {
            const opt = document.createElement("option");
            opt.value = i;
            opt.textContent = t.label;
            sel.appendChild(opt);
        });
        sel.addEventListener("change", () => {
            if (sel.value === "") return;
            document.getElementById("code").value = PYTHON_TEMPLATES[+sel.value].code;
            sel.value = "";
            if (window.showToast) showToast("Python template loaded!", "info");
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
            if (window.showToast) showToast("Python code copied to clipboard!", "success");
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
    window.location.href = "python/notes.html";
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
        const systemPrompt = "You are a friendly, highly knowledgeable Python programming tutor called 'Learn2code AI'. You are helping a student who is currently using an online Python compiler. Keep your answers concise, accurate, and use HTML formatting (like <code> for code snippets, <b> for emphasis, and <br> for line breaks). Do not use Markdown, ONLY use HTML tags for formatting.";

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

// ── Skulpt Custom Python Compiler Functionality ──
function outf(text) {
    const out = document.getElementById("output");
    out.innerText += text;
    const terminal = document.getElementById("terminal");
    terminal.scrollTop = terminal.scrollHeight;
}

function builtinRead(x) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
        throw "File not found: '" + x + "'";
    return Sk.builtinFiles["files"][x];
}

function myInputfun(promptText) {
    return new Promise((resolve) => {
        const out = document.getElementById("output");
        const inBox = document.getElementById("inputBox");
        const terminal = document.getElementById("terminal");
        
        out.innerText += promptText;
        inBox.style.display = "block";
        inBox.value = "";
        inBox.focus();
        terminal.scrollTop = terminal.scrollHeight;

        inBox.onkeypress = function(e) {
            if (e.key === "Enter") {
                const val = inBox.value;
                out.innerText += val + "\n";
                inBox.style.display = "none";
                inBox.onkeypress = null;
                resolve(val);
            }
        };
    });
}

function runit() {
    var prog = document.getElementById("code").value;
    var mypre = document.getElementById("output");
    var execEl = document.getElementById("execTime");
    mypre.innerText = "";
    mypre.className = ""; 
    if (execEl) execEl.textContent = "";

    const startTime = Date.now();

    Sk.pre = "output";
    Sk.configure({
        output: outf,
        read: builtinRead,
        inputfun: myInputfun,
        inputfunTakesPrompt: true
    });
    
    (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = "output";
    
    var myPromise = Sk.misceval.asyncToPromise(function() {
        return Sk.importMainWithBody("<stdin>", false, prog, true);
    });
    
    myPromise.then(function(mod) {
        const elapsed = Date.now() - startTime;
        if (execEl) execEl.textContent = "⏱ " + elapsed + "ms";
    }, function(err) {
        const elapsed = Date.now() - startTime;
        if (execEl) execEl.textContent = "⏱ " + elapsed + "ms";
        mypre.innerHTML += `<span class="output-error">\n${err.toString()}</span>`;
    });
}
