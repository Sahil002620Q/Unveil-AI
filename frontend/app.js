document.addEventListener('DOMContentLoaded', () => {
    const navBtns = document.querySelectorAll('.nav-btn');
    const modeTitle = document.getElementById('current-mode-title');
    const form = document.getElementById('chat-form');
    const input = document.getElementById('user-input');
    const chatHistory = document.getElementById('chat-history');
    const typingIndicator = document.getElementById('typing-indicator');
    const sendBtn = document.getElementById('send-btn');

    let currentMode = 'chat'; // 'chat', 'phishing', or 'reviewer'

    const modeLabels = {
        'chat': 'General Chat',
        'phishing': 'Phishing Detector',
        'reviewer': 'Honest Reviewer'
    };

    const modeEndpoints = {
        'chat': '/api/chat',
        'phishing': '/api/detect-phishing',
        'reviewer': '/api/honest-review'
    };

    const modePayloadKeys = {
        'chat': 'message',
        'phishing': 'url',
        'reviewer': 'content'
    };

    const modePlaceholders = {
        'chat': 'Type your message here...',
        'phishing': 'Paste the suspect URL here...',
        'reviewer': 'Paste your idea, essay, or thought to be reviewed...'
    };

    // Auto-resize textarea
    input.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        if(this.value.trim() === '') {
            this.style.height = 'auto';
        }
    });

    // Enter to submit
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            form.dispatchEvent(new Event('submit'));
        }
    });

    // Handle Mode Switching
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            currentMode = btn.getAttribute('data-mode');
            modeTitle.textContent = modeLabels[currentMode];
            input.placeholder = modePlaceholders[currentMode];
            input.focus();
            
            addSystemMessage(`Switched to ${modeLabels[currentMode]}.`);
        });
    });

    // Add a message to the UI
    function appendMessage(role, content) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', role);
        msgDiv.innerHTML = `<p>${formatContent(content)}</p>`;
        chatHistory.appendChild(msgDiv);
        scrollToBottom();
    }

    function addSystemMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', 'system');
        msgDiv.innerHTML = `<p>${text}</p>`;
        chatHistory.appendChild(msgDiv);
        scrollToBottom();
    }

    function scrollToBottom() {
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    // Basic markdown formatting simulation
    function formatContent(text) {
        // Escape HTML
        let formatted = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        // Convert newlines to breaks
        formatted = formatted.replace(/\n/g, '<br>');
        return formatted;
    }

    // Form Submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const text = input.value.trim();
        if (!text) return;

        // Reset input
        input.value = '';
        input.style.height = 'auto';
        
        // Add User Message
        appendMessage('user', text);
        
        // Show Loading
        typingIndicator.classList.remove('hidden');
        sendBtn.disabled = true;

        try {
            const endpoint = modeEndpoints[currentMode];
            const payloadKey = modePayloadKeys[currentMode];
            const payload = {};
            payload[payloadKey] = text;

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Server err: ${response.status}`);
            }

            const data = await response.json();
            appendMessage('ai', data.reply);
        } catch (error) {
            console.error('Error:', error);
            appendMessage('system', 'Error communicating with the backend. Ensure Ollama is running.');
        } finally {
            typingIndicator.classList.add('hidden');
            sendBtn.disabled = false;
            input.focus();
        }
    });
});
