/**
 * CodeStart AI Chatbot — Powered by Google Gemini
 * Inject <link rel="stylesheet" href="/chatbot.css"> + <script src="/chatbot.js"></script>
 * into any page and this self-contained widget will mount automatically.
 */
(function () {
    'use strict';

    /* ── Constants ── */
    const STORAGE_KEY = 'codestart_gemini_key';
    const GEMINI_MODEL = 'gemini-2.0-flash';
    const SYSTEM_PROMPT = `You are CodeStart AI, a friendly and expert programming tutor embedded in the CodeStart learning platform. 
The platform teaches C, C++, Java, JavaScript, and Python through notes, MCQs, fill-in-the-blank exercises, and online compilers.
Keep answers concise, friendly, and educational. Use code examples when helpful (wrap them in triple backticks). 
If asked anything unrelated to programming or learning, politely redirect the conversation back to coding topics.`;

    /* ── Inject HTML ── */
    function buildWidget() {
        const wrapper = document.createElement('div');
        wrapper.id = 'chatbot-root';
        wrapper.innerHTML = `
<!-- Floating Toggle Button -->
<button id="chatbot-toggle" aria-label="Open AI Chatbot" title="Ask CodeStart AI">
    <!-- Bot icon (open state) -->
    <svg class="icon-open" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7H3a7 7 0 0 1 7-7h1V5.73A2 2 0 0 1 12 2zM5 15v4a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-4H5zm4 1h2v2H9v-2zm4 0h2v2h-2v-2zM7 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
    </svg>
    <!-- Close icon (close state) -->
    <svg class="icon-close" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18M6 6l12 12" stroke="#fff" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    </svg>
</button>

<!-- Chat Window -->
<div id="chatbot-window" role="dialog" aria-label="CodeStart AI Chat">

    <!-- Header -->
    <div id="chatbot-header">
        <div class="chatbot-avatar">🤖</div>
        <div class="chatbot-title">
            <h4>CodeStart AI</h4>
            <span>Powered by Gemini</span>
        </div>
        <button class="close-btn" id="chatbot-close-btn" aria-label="Close chat">✕</button>
    </div>

    <!-- API Key Setup (shown when no key saved) -->
    <div id="chatbot-setup" style="display:none;">
        <p>👋 Hello! I'm your AI programming tutor.<br>To get started, enter your <strong>Gemini API key</strong>. It's stored only in your browser — never sent anywhere else.</p>
        <p>Get a free key at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener">aistudio.google.com</a> 🔑</p>
        <label for="chatbot-apikey-input">YOUR API KEY</label>
        <input id="chatbot-apikey-input" type="password" placeholder="AIza..." autocomplete="off" spellcheck="false">
        <p id="chatbot-key-error">⚠️ Invalid key or unable to connect. Please check and try again.</p>
        <button id="chatbot-save-key">Save & Start Chatting ✨</button>
    </div>

    <!-- Messages Container (shown after key saved) -->
    <div id="chatbot-messages" style="display:none;" aria-live="polite"></div>

    <!-- Input Bar (shown after key saved) -->
    <div id="chatbot-input-area" style="display:none;">
        <textarea id="chatbot-input" placeholder="Ask me anything about coding…" rows="1" aria-label="Chat input"></textarea>
        <button id="chatbot-send" aria-label="Send message">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
        </button>
    </div>

    <!-- Reset key footer -->
    <span id="chatbot-reset-key" style="display:none;" tabindex="0" role="button">🔑 Change API Key</span>

</div>
`;
        document.body.appendChild(wrapper);
    }

    /* ── State ── */
    let conversationHistory = [];
    let isLoading = false;

    /* ── DOM refs (populated after build) ── */
    let toggleBtn, chatWindow, setupPanel, messagesEl,
        inputArea, chatInput, sendBtn, apikeyInput,
        saveKeyBtn, keyError, resetKeyLink, closeBtn;

    function cacheRefs() {
        toggleBtn    = document.getElementById('chatbot-toggle');
        chatWindow   = document.getElementById('chatbot-window');
        setupPanel   = document.getElementById('chatbot-setup');
        messagesEl   = document.getElementById('chatbot-messages');
        inputArea    = document.getElementById('chatbot-input-area');
        chatInput    = document.getElementById('chatbot-input');
        sendBtn      = document.getElementById('chatbot-send');
        apikeyInput  = document.getElementById('chatbot-apikey-input');
        saveKeyBtn   = document.getElementById('chatbot-save-key');
        keyError     = document.getElementById('chatbot-key-error');
        resetKeyLink = document.getElementById('chatbot-reset-key');
        closeBtn     = document.getElementById('chatbot-close-btn');
    }

    /* ── Key management ── */
    function getKey()       { return localStorage.getItem(STORAGE_KEY) || ''; }
    function saveKey(k)     { localStorage.setItem(STORAGE_KEY, k.trim()); }
    function clearKey()     { localStorage.removeItem(STORAGE_KEY); }

    /* ── UI state helpers ── */
    function showChat() {
        setupPanel.style.display  = 'none';
        messagesEl.style.display  = 'flex';
        inputArea.style.display   = 'flex';
        resetKeyLink.style.display = 'block';
        if (conversationHistory.length === 0) addWelcomeMessage();
    }

    function showSetup() {
        setupPanel.style.display  = 'flex';
        messagesEl.style.display  = 'none';
        inputArea.style.display   = 'none';
        resetKeyLink.style.display = 'none';
        keyError.style.display    = 'none';
    }

    function openWindow() {
        chatWindow.classList.add('visible');
        toggleBtn.classList.add('open');
        if (getKey()) {
            showChat();
            setTimeout(() => chatInput.focus(), 320);
        } else {
            showSetup();
            setTimeout(() => apikeyInput.focus(), 320);
        }
    }

    function closeWindow() {
        chatWindow.classList.remove('visible');
        toggleBtn.classList.remove('open');
    }

    /* ── Welcome message ── */
    function addWelcomeMessage() {
        appendMessage('bot', `👋 Hi! I'm **CodeStart AI**, your personal programming tutor. I can help you with:\n\n• Understanding concepts from your notes\n• Debugging code snippets\n• Explaining C, C++, Java, JavaScript & Python\n• MCQ & quiz questions\n\nWhat would you like to learn today?`);
    }

    /* ── Append a message bubble ── */
    function appendMessage(role, text) {
        const msg = document.createElement('div');
        msg.className = `chat-msg ${role}`;
        msg.innerHTML = `
            <div class="msg-avatar">${role === 'bot' ? '🤖' : '👤'}</div>
            <div class="msg-bubble">${formatText(text)}</div>
        `;
        messagesEl.appendChild(msg);
        messagesEl.scrollTop = messagesEl.scrollHeight;
        return msg;
    }

    /* ── Typing indicator ── */
    function showTyping() {
        const el = document.createElement('div');
        el.className = 'chat-msg bot';
        el.id = 'chatbot-typing';
        el.innerHTML = `
            <div class="msg-avatar">🤖</div>
            <div class="msg-bubble typing-indicator">
                <span></span><span></span><span></span>
            </div>
        `;
        messagesEl.appendChild(el);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }
    function hideTyping() {
        const el = document.getElementById('chatbot-typing');
        if (el) el.remove();
    }

    /* ── Simple text formatter (bold, code, line-breaks) ── */
    function formatText(text) {
        // Escape HTML first
        let t = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // Fenced code blocks
        t = t.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => {
            return `<pre style="background:rgba(0,0,0,0.35);border-radius:8px;padding:10px 12px;margin:6px 0;overflow-x:auto;font-family:'Fira Code',monospace;font-size:12px;"><code>${code.trim()}</code></pre>`;
        });

        // Inline code
        t = t.replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.1);border-radius:4px;padding:1px 5px;font-family:\'Fira Code\',monospace;font-size:12px;">$1</code>');

        // Bold
        t = t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

        // Bullet lists
        t = t.replace(/^• (.+)$/gm, '<li style="margin-left:12px;">$1</li>');
        t = t.replace(/(<li[^>]*>.*<\/li>\n?)+/g, '<ul style="margin:6px 0;padding-left:4px;list-style:none;">$&</ul>');

        // Line breaks
        t = t.replace(/\n/g, '<br>');

        return t;
    }

    /* ── Call Gemini API ── */
    async function callGemini(userMessage) {
        const apiKey = getKey();
        if (!apiKey) { showSetup(); return; }

        conversationHistory.push({ role: 'user', parts: [{ text: userMessage }] });

        const body = {
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: conversationHistory,
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1024,
            }
        };

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err?.error?.message || `HTTP ${response.status}`);
        }

        const data = await response.json();
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';
        conversationHistory.push({ role: 'model', parts: [{ text: reply }] });
        return reply;
    }

    /* ── Send message handler ── */
    async function handleSend() {
        if (isLoading) return;
        const text = chatInput.value.trim();
        if (!text) return;

        chatInput.value = '';
        chatInput.style.height = 'auto';
        appendMessage('user', text);
        showTyping();
        isLoading = true;
        sendBtn.disabled = true;

        try {
            const reply = await callGemini(text);
            hideTyping();
            appendMessage('bot', reply);
        } catch (err) {
            hideTyping();
            appendMessage('bot', `⚠️ Error: ${err.message}\n\nPlease check your API key or try again.`);
        } finally {
            isLoading = false;
            sendBtn.disabled = false;
            chatInput.focus();
        }
    }

    /* ── Validate key by making a small test call ── */
    async function validateAndSaveKey() {
        const key = apikeyInput.value.trim();
        if (!key) { keyError.style.display = 'block'; keyError.textContent = '⚠️ Please enter an API key.'; return; }
        keyError.style.display = 'none';
        saveKeyBtn.textContent = 'Validating…';
        saveKeyBtn.disabled = true;

        try {
            const testUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`;
            const res = await fetch(testUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: 'Hi' }] }] })
            });
            if (!res.ok) throw new Error('Invalid key');
            saveKey(key);
            conversationHistory = [];
            showChat();
        } catch {
            keyError.textContent = '⚠️ Invalid key or unable to connect. Please check and try again.';
            keyError.style.display = 'block';
        } finally {
            saveKeyBtn.textContent = 'Save & Start Chatting ✨';
            saveKeyBtn.disabled = false;
        }
    }

    /* ── Auto-grow textarea ── */
    function autoGrow(el) {
        el.style.height = 'auto';
        el.style.height = Math.min(el.scrollHeight, 120) + 'px';
    }

    /* ── Wire up events ── */
    function bindEvents() {
        toggleBtn.addEventListener('click', () => {
            chatWindow.classList.contains('visible') ? closeWindow() : openWindow();
        });
        closeBtn.addEventListener('click', closeWindow);

        saveKeyBtn.addEventListener('click', validateAndSaveKey);
        apikeyInput.addEventListener('keydown', e => { if (e.key === 'Enter') validateAndSaveKey(); });

        sendBtn.addEventListener('click', handleSend);
        chatInput.addEventListener('keydown', e => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
        });
        chatInput.addEventListener('input', () => autoGrow(chatInput));

        resetKeyLink.addEventListener('click', () => {
            clearKey();
            conversationHistory = [];
            showSetup();
        });
        resetKeyLink.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { clearKey(); conversationHistory = []; showSetup(); } });
    }

    /* ── Bootstrap ── */
    function init() {
        buildWidget();
        cacheRefs();
        bindEvents();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
