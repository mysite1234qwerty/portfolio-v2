/**
 * AI Design Assistant Widget for Aditi Sharma Portfolio
 * Integrated on the bottom-left beside the sound toggle.
 * Provides design idea brainstorming, UX critique, and micro-interaction guidance.
 */
(function () {
    'use strict';

    // State
    var isOpen = false;
    var isThinking = false;
    var messages = [
        {
            role: 'assistant',
            content: 'Hello! I am Aditi’s AI Design Assistant. Ask me to brainstorm interaction patterns, review IA concepts, or suggest tactile micro-interactions for your project.'
        }
    ];

    // Local API Key Storage
    var savedApiKey = localStorage.getItem('pf.ai_key') || '';
    var savedProvider = localStorage.getItem('pf.ai_provider') || 'openai';

    // Create DOM Elements
    function init() {
        // 1. Trigger Pill Button (beside sound toggle)
        var btn = document.createElement('button');
        btn.id = 'ai-chat-toggle';
        btn.className = 'ai-chat-toggle';
        btn.setAttribute('aria-label', 'Open AI Design Assistant');
        btn.innerHTML = `
            <svg class="ai-sparkle-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                <path d="M5 3v4"/>
                <path d="M19 17v4"/>
                <path d="M3 5h4"/>
                <path d="M17 19h4"/>
            </svg>
            <span class="ai-btn-label">Design Ideas</span>
        `;
        document.body.appendChild(btn);

        // 2. Chat Popover Window
        var popover = document.createElement('div');
        popover.id = 'ai-chat-popover';
        popover.className = 'ai-chat-popover';
        popover.setAttribute('role', 'dialog');
        popover.setAttribute('aria-hidden', 'true');
        popover.innerHTML = `
            <div class="ai-chat-header">
                <div class="ai-header-info">
                    <span class="ai-status-dot"></span>
                    <div>
                        <strong>Design Assistant</strong>
                        <span class="ai-header-sub">Ideation & UX Critiques</span>
                    </div>
                </div>
                <div class="ai-header-actions">
                    <button id="ai-settings-btn" class="ai-icon-btn" title="API Key Settings">⚙</button>
                    <button id="ai-close-btn" class="ai-icon-btn" title="Close">×</button>
                </div>
            </div>

            <div id="ai-settings-panel" class="ai-settings-panel" style="display: none;">
                <label class="ai-label">Custom API Key (OpenAI / Gemini):</label>
                <input type="password" id="ai-key-input" class="ai-key-input" placeholder="Paste your API key (optional)..." value="${savedApiKey}">
                <div class="ai-settings-row">
                    <select id="ai-provider-select" class="ai-select">
                        <option value="openai" ${savedProvider === 'openai' ? 'selected' : ''}>OpenAI (gpt-4o-mini)</option>
                        <option value="gemini" ${savedProvider === 'gemini' ? 'selected' : ''}>Google Gemini</option>
                    </select>
                    <button id="ai-save-key-btn" class="ai-save-btn">Save Key</button>
                </div>
                <p class="ai-subtext">Keys stay in your browser local storage.</p>
            </div>

            <div class="ai-chat-body" id="ai-chat-body">
                <div class="ai-chips-row">
                    <button class="ai-chip" data-prompt="Suggest 3 micro-interactions for the Breez electric chauffeur app">Breez UX</button>
                    <button class="ai-chip" data-prompt="How was decision fatigue tackled in the 'What Scene?' group planning app?">What Scene?</button>
                    <button class="ai-chip" data-prompt="How did Canteen 2.0 reduce dwell time by 75%?">Canteen 2.0</button>
                    <button class="ai-chip" data-prompt="What editorial UX patterns elevate Célestine high jewelry e-commerce?">Célestine</button>
                    <button class="ai-chip" data-prompt="How would you approach super-app decluttering like the MyJio redesign?">MyJio Redesign</button>
                </div>
                <div id="ai-messages-list" class="ai-messages-list"></div>
            </div>

            <form id="ai-chat-form" class="ai-chat-form">
                <input type="text" id="ai-chat-input" class="ai-chat-input" placeholder="Ask for design ideas or UX tips..." autocomplete="off">
                <button type="submit" id="ai-chat-submit" class="ai-chat-submit" aria-label="Send">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
            </form>
        `;
        // 3. Mobile Backdrop
        var backdrop = document.createElement('div');
        backdrop.id = 'ai-chat-backdrop';
        backdrop.className = 'ai-chat-backdrop';
        backdrop.setAttribute('aria-hidden', 'true');
        document.body.appendChild(backdrop);

        // Bind events
        btn.addEventListener('click', toggleChat);
        document.getElementById('ai-close-btn').addEventListener('click', toggleChat);
        backdrop.addEventListener('click', toggleChat);

        window.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && isOpen) toggleChat();
        });

        // Settings toggle
        var settingsBtn = document.getElementById('ai-settings-btn');
        var settingsPanel = document.getElementById('ai-settings-panel');
        settingsBtn.addEventListener('click', function () {
            var show = settingsPanel.style.display === 'none';
            settingsPanel.style.display = show ? 'block' : 'none';
            if (window.PFSound) window.PFSound.play('tab-hover');
        });

        document.getElementById('ai-save-key-btn').addEventListener('click', function () {
            var key = document.getElementById('ai-key-input').value.trim();
            var prov = document.getElementById('ai-provider-select').value;
            localStorage.setItem('pf.ai_key', key);
            localStorage.setItem('pf.ai_provider', prov);
            savedApiKey = key;
            savedProvider = prov;
            settingsPanel.style.display = 'none';
            if (window.PFSound) window.PFSound.play('snap');
        });

        // Form Submit
        var form = document.getElementById('ai-chat-form');
        var input = document.getElementById('ai-chat-input');
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var val = input.value.trim();
            if (!val || isThinking) return;
            input.value = '';
            sendMessage(val);
        });

        // Suggestion Chips
        popover.querySelectorAll('.ai-chip').forEach(function (chip) {
            chip.addEventListener('click', function () {
                var prompt = chip.getAttribute('data-prompt');
                if (prompt && !isThinking) {
                    if (window.PFSound) window.PFSound.play('tab-select');
                    sendMessage(prompt);
                }
            });
        });

        renderMessages();
    }

    function toggleChat() {
        isOpen = !isOpen;
        var popover = document.getElementById('ai-chat-popover');
        var btn = document.getElementById('ai-chat-toggle');
        var backdrop = document.getElementById('ai-chat-backdrop');
        if (isOpen) {
            popover.classList.add('is-open');
            popover.setAttribute('aria-hidden', 'false');
            if (backdrop) backdrop.classList.add('is-open');
            btn.classList.add('is-active');
            if (window.PFSound) window.PFSound.play('select');
            setTimeout(function () {
                var input = document.getElementById('ai-chat-input');
                if (input) input.focus();
            }, 100);
        } else {
            popover.classList.remove('is-open');
            popover.setAttribute('aria-hidden', 'true');
            if (backdrop) backdrop.classList.remove('is-open');
            btn.classList.remove('is-active');
            if (window.PFSound) window.PFSound.play('photo-close');
        }
    }

    function formatMarkdown(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/^### (.*$)/gim, '<h4 class="ai-md-h4">$1</h4>')
            .replace(/^• (.*$)/gim, '<li class="ai-md-li">$1</li>')
            .replace(/\n\n/g, '<br><br>');
    }

    function renderMessages() {
        var list = document.getElementById('ai-messages-list');
        if (!list) return;
        list.innerHTML = '';

        messages.forEach(function (m) {
            var msgDiv = document.createElement('div');
            msgDiv.className = 'ai-msg ai-msg-' + m.role;
            msgDiv.innerHTML = '<div class="ai-msg-bubble">' + formatMarkdown(m.content) + '</div>';
            list.appendChild(msgDiv);
        });

        if (isThinking) {
            var loadingDiv = document.createElement('div');
            loadingDiv.className = 'ai-msg ai-msg-assistant';
            loadingDiv.innerHTML = '<div class="ai-msg-bubble ai-loading-dots"><span></span><span></span><span></span></div>';
            list.appendChild(loadingDiv);
        }

        var body = document.getElementById('ai-chat-body');
        if (body) body.scrollTop = body.scrollHeight;
    }

    async function sendMessage(userText) {
        messages.push({ role: 'user', content: userText });
        isThinking = true;
        renderMessages();
        if (window.PFSound) window.PFSound.play('tab-select');

        try {
            var res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: messages,
                    apiKey: savedApiKey,
                    provider: savedProvider
                })
            });

            var data = await res.json();
            var reply = data.reply || data.error || 'I had trouble generating ideas. Please try again.';
            messages.push({ role: 'assistant', content: reply });
            if (window.PFSound) window.PFSound.play('snap');
        } catch {
            messages.push({
                role: 'assistant',
                content: 'Network connection issue. Please verify the server is running.'
            });
        } finally {
            isThinking = false;
            renderMessages();
        }
    }

    // Auto-mount on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
