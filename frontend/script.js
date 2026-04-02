document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const sidebar = document.getElementById('sidebar');
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const mobileCloseBtn = document.getElementById('mobile-close-btn');
    const newSessionBtn = document.getElementById('new-session-btn');
    const navItems = document.querySelectorAll('.nav-item');
    
    const headerTitle = document.getElementById('header-title');
    const chatContainer = document.getElementById('chat-container');
    const messagesWrapper = document.getElementById('messages-wrapper');
    const welcomeScreen = document.getElementById('welcome-screen');
    const welcomeTitle = document.getElementById('welcome-title');
    const welcomeSubtitle = document.getElementById('welcome-subtitle');
    const welcomeIcon = document.getElementById('welcome-icon');
    const suggestionChips = document.querySelectorAll('.chip');
    
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const attachBtn = document.getElementById('attach-btn');
    const fileInput = document.getElementById('file-input');
    const typingIndicator = document.getElementById('typing-indicator');

    // --- State ---
    let currentMode = 'chat';
    let isDesktopCollapsed = false;

    // --- Mode Configurations ---
    const modeConfigs = {
        'chat': {
            title: 'Universal Assistant',
            icon: '<i class="fa-solid fa-wand-magic-sparkles"></i>',
            welcomeTitle: 'How can I help you today?',
            welcomeSubtitle: 'Ask anything or enter a prompt.',
            endpoint: '/api/chat',
            payloadKey: 'message',
            placeholder: 'Message Unveil AI...'
        },
        'phishing': {
            title: 'URL Detector',
            icon: '<i class="fa-solid fa-shield-halved"></i>',
            welcomeTitle: 'Paste a suspicious URL',
            welcomeSubtitle: 'I will analyze domain parameters to detect phishing.',
            endpoint: '/api/detect-phishing',
            payloadKey: 'url',
            placeholder: 'Paste URL here (e.g. http://secure-login-paypal.com)'
        },
        'reviewer': {
            title: 'Genuine Review',
            icon: '<i class="fa-solid fa-scale-balanced"></i>',
            welcomeTitle: 'Looking for brutally honest feedback?',
            welcomeSubtitle: 'Paste your essay, idea, or code for an unapologetic review.',
            endpoint: '/api/honest-review',
            payloadKey: 'content',
            placeholder: 'Paste your content here...'
        }
    };

    // --- Sidebar Toggle Logic ---
    function isMobile() {
        return window.innerWidth <= 768;
    }

    menuToggleBtn.addEventListener('click', () => {
        if (isMobile()) {
            sidebar.classList.add('open');
        } else {
            isDesktopCollapsed = !isDesktopCollapsed;
            if (isDesktopCollapsed) {
                sidebar.classList.add('collapsed');
            } else {
                sidebar.classList.remove('collapsed');
            }
        }
    });

    mobileCloseBtn.addEventListener('click', () => {
        sidebar.classList.remove('open');
    });

    window.addEventListener('resize', () => {
        if (!isMobile()) {
            sidebar.classList.remove('open');
            if(isDesktopCollapsed) sidebar.classList.add('collapsed');
        } else {
            sidebar.classList.remove('collapsed');
        }
    });

    // --- Switch Modes ---
    function setMode(mode) {
        currentMode = mode;
        const conf = modeConfigs[mode];
        
        // Update styling
        navItems.forEach(item => item.classList.remove('active'));
        document.querySelector(`.nav-item[data-mode="${mode}"]`).classList.add('active');
        
        // Update header & welcome
        headerTitle.textContent = conf.title;
        welcomeIcon.innerHTML = conf.icon;
        welcomeTitle.textContent = conf.welcomeTitle;
        welcomeSubtitle.textContent = conf.welcomeSubtitle;
        chatInput.placeholder = conf.placeholder;

        // Clear chat history
        clearSession();
        
        // Focus input
        chatInput.focus();
        if (isMobile()) sidebar.classList.remove('open');
    }

    navItems.forEach(item => {
        item.addEventListener('click', () => setMode(item.dataset.mode));
    });

    // --- Session Handling ---
    function clearSession() {
        messagesWrapper.innerHTML = '';
        welcomeScreen.style.display = 'flex';
        resetInputHeight();
    }

    newSessionBtn.addEventListener('click', () => {
        clearSession();
    });

    // --- File Attachment ---
    attachBtn.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if(!file) return;

        // Immediately show a system message
        appendMessage('ai-bubble', `<i class="fa-solid fa-file-circle-check"></i> File <b>${file.name}</b> attached. (UI Mockup)`);
        
        // Optional snippet to actually post to the /api/upload endpoint
        /*
        const formData = new FormData();
        formData.append('file', file);
        try {
            await fetch('/api/upload', { method: 'POST', body: formData });
        } catch(err) { console.error(err); }
        */
        
        // Clear input so same file can be uploaded again if needed
        fileInput.value = '';
    });

    // --- Auto-resize Textarea ---
    function resetInputHeight() {
        chatInput.style.height = 'auto';
    }

    chatInput.addEventListener('input', () => {
        chatInput.style.height = 'auto';
        chatInput.style.height = (chatInput.scrollHeight) + 'px';
        if (chatInput.value.trim() === '') resetInputHeight();
    });

    // --- Chat Submission ---
    suggestionChips.forEach(chip => {
        chip.addEventListener('click', () => {
            chatInput.value = chip.textContent;
            chatInput.focus();
            resetInputHeight();
        });
    });

    function escapeHTML(str) { return str.replace(/[&<>'"]/g, tag => ({'&': '&amp;','<': '&lt;','>': '&gt;',"'": '&#39;','"': '&quot;'}[tag] || tag)); }

    function appendMessage(typeClass, content) {
        welcomeScreen.style.display = 'none';
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-bubble ${typeClass}`;
        
        // simple newline to br tag conversion along with raw html injection (use safely in prod)
        msgDiv.innerHTML = content;
        
        messagesWrapper.appendChild(msgDiv);
        scrollToBottom();
    }

    function scrollToBottom() {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    async function submitMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        // Construct request
        const conf = modeConfigs[currentMode];
        const payload = {};
        payload[conf.payloadKey] = text;

        // Update UI
        appendMessage('user-bubble', escapeHTML(text).replace(/\n/g, '<br/>'));
        chatInput.value = '';
        resetInputHeight();
        sendBtn.disabled = true;
        
        // Show typing indicator
        welcomeScreen.style.display = 'none'; // Ensure hidden
        typingIndicator.classList.remove('hidden');
        scrollToBottom();

        try {
            // Wait for 500ms to visually show typing
            await new Promise(r => setTimeout(r, 500));
            
            const response = await fetch(conf.endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            
            // Format AI reply (e.g. handle newlines)
            const formattedReply = escapeHTML(data.reply).replace(/\n/g, '<br/>');
            appendMessage('ai-bubble', formattedReply);

        } catch (error) {
            console.error('API Error:', error);
            appendMessage('ai-bubble', '<span style="color:#ef4444;"><i class="fa-solid fa-triangle-exclamation"></i> Error connecting to local LLM backend. Please ensure Ollama or API server is running on localhost.</span>');
        } finally {
            typingIndicator.classList.add('hidden');
            sendBtn.disabled = false;
            chatInput.focus();
            scrollToBottom();
        }
    }

    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submitMessage();
        }
    });

    sendBtn.addEventListener('click', submitMessage);

});
