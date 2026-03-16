// python-compiler.js

function goBack() {
    window.location.href = 'python/notes.html';
}

// --- AI Assistant Functionality ---
const chatPanel = document.getElementById('aiChatPanel');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');
const typingIndicator = document.getElementById('typingIndicator');

function toggleChat() {
    chatPanel.classList.toggle('active');
    if (chatPanel.classList.contains('active')) {
        chatInput.focus();
    }
}

function handleKeyPress(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
}

function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    // Add User Message
    appendMessage(text, 'user');
    chatInput.value = '';

    // Show typing indicator
    chatMessages.appendChild(typingIndicator);
    typingIndicator.style.display = 'block';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Call the real AI
    generateAIResponse(text);
}

function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `msg msg-${sender}`;
    msgDiv.innerHTML = text;
    chatMessages.insertBefore(msgDiv, typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function generateAIResponse(query) {
    try {
        const systemPrompt = "You are a friendly, highly knowledgeable Python programming tutor called 'CodeStart AI'. You are helping a student who is currently using an online Python compiler. Keep your answers concise, accurate, and use HTML formatting (like <code> for code snippets, <b> for emphasis, and <br> for line breaks). Do not use Markdown, ONLY use HTML tags for formatting.";

        if (typeof puter !== 'undefined' && puter.ai) {
            const response = await puter.ai.chat(
                `System: ${systemPrompt}\n\nUser: ${query}`
            );
            typingIndicator.style.display = 'none';
            let finalMessage = typeof response === 'string' ? response : (response.message?.content || response.text || "I'm having trouble thinking right now.");
            finalMessage = finalMessage.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');
            appendMessage(finalMessage, 'ai');
        } else {
            throw new Error("Puter AI not loaded.");
        }
    } catch (error) {
        console.error("AI Error:", error);
        typingIndicator.style.display = 'none';
        appendMessage("Sorry, I'm having trouble connecting to my brain right now. Please try asking again in a moment! (Error: " + error.message + ")", 'ai');
    }
}

// --- Skulpt Custom Python Compiler Functionality ---

// Print output to the terminal div
function outf(text) {
    const out = document.getElementById("output");
    out.innerText += text;
    
    // Auto-scroll to bottom of terminal
    const terminal = document.getElementById("terminal");
    terminal.scrollTop = terminal.scrollHeight;
}

function builtinRead(x) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
        throw "File not found: '" + x + "'";
    return Sk.builtinFiles["files"][x];
}

// Handle python input() blocking interaction
function myInputfun(promptText) {
    return new Promise((resolve) => {
        const out = document.getElementById("output");
        const inBox = document.getElementById("inputBox");
        const terminal = document.getElementById("terminal");
        
        // Print the prompt text natively before taking input
        out.innerText += promptText;
        
        // Expose the input text box
        inBox.style.display = "block";
        inBox.value = "";
        inBox.focus();
        
        terminal.scrollTop = terminal.scrollHeight;

        // Listen for user hitting enter
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
    mypre.innerText = '';
    mypre.className = ''; 
    
    // Initialize Skulpt
    Sk.pre = "output";
    Sk.configure({
        output: outf,
        read: builtinRead,
        inputfun: myInputfun,
        inputfunTakesPrompt: true
    });
    
    (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = 'output';
    
    var myPromise = Sk.misceval.asyncToPromise(function() {
        return Sk.importMainWithBody("<stdin>", false, prog, true);
    });
    
    myPromise.then(function(mod) {
        console.log('Execution success');
    }, function(err) {
        mypre.innerHTML += `<span class="output-error">\n${err.toString()}</span>`;
    });
}

// Allow using Tab to indent inside the textarea 
document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.getElementById('code');
    if (textarea) {
        textarea.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = this.selectionStart;
                const end = this.selectionEnd;
                // Add 4 spaces at caret position
                this.value = this.value.substring(0, start) +
                    "    " + this.value.substring(end);
                this.selectionStart = this.selectionEnd = start + 4;
            }
        });
    }
});
