// c-compiler.js

function goBack() {
    window.location.href = 'C/notes.html';
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
        const systemPrompt = "You are a friendly, highly knowledgeable C programming tutor called 'CodeStart AI'. You are helping a student who is currently using an online C compiler. Keep your answers concise, accurate, and use HTML formatting (like <code> for code snippets, <b> for emphasis, and <br> for line breaks). Do not use Markdown, ONLY use HTML tags for formatting.";

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

// --- C Compiler Execution (Judge0 API) ---
async function runit() {
    const code = document.getElementById("code").value;
    const stdin = document.getElementById("stdinBox").value;
    const mypre = document.getElementById("output");
    const runBtn = document.getElementById("runBtn");
    const spinner = document.getElementById("loadingSpinner");
    
    mypre.innerText = '';
    mypre.className = ''; 
    
    runBtn.disabled = true;
    spinner.style.display = "block";
    
    try {
        const response = await fetch('https://ce.judge0.com/submissions?base64_encoded=false&wait=true', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                language_id: 50, // C (GCC 9.2.0)
                source_code: code,
                stdin: stdin
            })
        });

        const data = await response.json();
        
        spinner.style.display = "none";
        runBtn.disabled = false;

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

    } catch (err) {
        spinner.style.display = "none";
        runBtn.disabled = false;
        mypre.innerHTML += `<span class="output-error">Failed to connect to compiler engine.\n${err.toString()}</span>`;
    }
    
    // Auto-scroll to bottom of terminal
    const terminal = document.getElementById("terminal");
    terminal.scrollTop = terminal.scrollHeight;
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
