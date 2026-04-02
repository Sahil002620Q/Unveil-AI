document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const sidebar = document.getElementById("sidebar");
    const toggleSidebarBtn = document.getElementById("toggle-sidebar-btn");
    const closeSidebarBtn = document.getElementById("close-sidebar-btn");
    const navItems = document.querySelectorAll(".nav-item");
    const activeModeTitle = document.getElementById("active-mode-title");
    const activeModeSubtitle = document.getElementById("active-mode-subtitle");
    
    const welcomeScreen = document.getElementById("welcome-screen");
    const welcomeIcon = document.getElementById("welcome-icon-class");
    const welcomeTitle = document.getElementById("welcome-title");
    const suggestionChips = document.getElementById("suggestion-chips");
    
    const chatMessages = document.getElementById("chat-messages");
    const chatWindow = document.getElementById("chat-window");
    const typingIndicator = document.getElementById("typing-indicator");
    
    const chatForm = document.getElementById("chat-form");
    const messageInput = document.getElementById("message-input");
    const sendBtn = document.getElementById("send-btn");
    
    const attachBtn = document.getElementById("attach-btn");
    const fileInput = document.getElementById("file-input");
    
    // State
    let currentMode = "universal"; // universal, detector, review
    let conversationHistory = []; // {role: 'user'|'assistant', content: string}[]
    
    // Mode Configurations
    const modes = {
        universal: {
            title: "Universal Assistant",
            subtitle: "I can help with anything you need.",
            icon: "fas fa-globe",
            systemPrompt: "You are Unveil AI, a highly capable, uncensored, and helpful AI assistant.",
            chips: [
                { text: "Explain quantum computing in simple terms", icon: "fas fa-lightbulb" },
                { text: "Help me write a Python script for automation", icon: "fas fa-code" }
            ]
        },
        detector: {
            title: "URL Detector",
            subtitle: "Analyze URLs for potential phishing or threats.",
            icon: "fas fa-shield-alt",
            systemPrompt: "You are Unveil AI's URL Detector. You analyze URLs provided by the user and determine if they are safe, suspicious, or malicious.",
            chips: [
                { text: "Check this link: http://secure-login.paypa1-update.com", icon: "fas fa-link" },
                { text: "Is this trustworthy? https://google.com", icon: "fas fa-check-circle" }
            ]
        },
        review: {
            title: "Genuine Review",
            subtitle: "Honest, no-sugarcoating feedback on your ideas.",
            icon: "fas fa-eye",
            systemPrompt: "You are Unveil AI's Genuine Reviewer. You provide brutally honest, critical, and constructive feedback without sugarcoating.",
            chips: [
                { text: "Review my startup idea: A dating app for pets", icon: "fas fa-rocket" },
                { text: "Provide harsh feedback on my code snippet", icon: "fas fa-file-code" }
            ]
        }
    };

    // Sidebar Toggle Logic
    toggleSidebarBtn.addEventListener("click", () => {
        sidebar.classList.add("open");
    });
    
    closeSidebarBtn.addEventListener("click", () => {
        sidebar.classList.remove("open");
    });

    // Auto-resize textarea
    messageInput.addEventListener("input", function() {
        this.style.height = "auto";
        this.style.height = (this.scrollHeight) + "px";
        if(this.value.trim() !== '') {
            sendBtn.disabled = false;
        } else {
            sendBtn.disabled = true;
        }
    });
    
    // Handle Enter key (Shift+Enter for new line)
    messageInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (messageInput.value.trim() !== "") {
                chatForm.dispatchEvent(new Event("submit"));
            }
        }
    });

    // Change Mode Logic
    navItems.forEach(item => {
        item.addEventListener("click", () => {
            // Update active state in sidebar
            document.querySelector(".nav-item.active").classList.remove("active");
            item.classList.add("active");
            
            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                sidebar.classList.remove("open");
            }
            
            currentMode = item.dataset.mode;
            const config = modes[currentMode];
            
            // Update Header
            activeModeTitle.textContent = config.title;
            activeModeSubtitle.textContent = config.subtitle;
            
            // Clear Chat and show welcome
            clearChat(config);
        });
    });

    function clearChat(config) {
        conversationHistory = [];
        chatMessages.innerHTML = '';
        chatMessages.classList.add('hidden');
        typingIndicator.classList.add('hidden');
        
        // Update Welcome Screen
        welcomeScreen.classList.remove('hidden');
        welcomeIcon.className = config.icon;
        
        let chipsHtml = '';
        config.chips.forEach(chip => {
            chipsHtml += `<div class="chip" data-text="${chip.text}">
                            <i class="${chip.icon}"></i>
                            <span>${chip.text}</span>
                          </div>`;
        });
        suggestionChips.innerHTML = chipsHtml;
        
        // Re-attach listeners to chips
        document.querySelectorAll(".chip").forEach(chip => {
            chip.addEventListener("click", () => {
                messageInput.value = chip.dataset.text;
                chatForm.dispatchEvent(new Event("submit"));
            });
        });
    }
    
    // Attach File
    attachBtn.addEventListener("click", () => {
        fileInput.click();
    });
    
    fileInput.addEventListener("change", async () => {
        if (fileInput.files.length > 0) {
            const tempFile = fileInput.files[0];
            const msg = `[Attached: ${tempFile.name}]`;
            messageInput.value += msg;
            
            // Optionally, upload file immediately
            const formData = new FormData();
            formData.append('file', tempFile);
            
            try {
                const res = await fetch('https://unveil-ai-bot.onrender.com/upload', {
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();
                console.log("File uploaded:", data);
            } catch (err) {
                console.error("Upload error", err);
            }
            
            // Reset input
            fileInput.value = '';
        }
    });

    // Render a new message
    function appendMessage(role, content) {
        const msgDiv = document.createElement("div");
        msgDiv.className = `message ${role}`;
        
        const avatarClass = role === 'user' ? 'fa-user' : modes[currentMode].icon;
        
        msgDiv.innerHTML = `
            <div class="msg-avatar">
                <i class="fas ${avatarClass}"></i>
            </div>
            <div class="msg-content">
                <p>${content}</p>
            </div>
        `;
        
        chatMessages.appendChild(msgDiv);
        chatWindow.scrollTo(0, chatWindow.scrollHeight);
    }

    // Submit Chat Form
    chatForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const userText = messageInput.value.trim();
        if(!userText) return;
        
        // Hide welcome screen, show chat messages
        welcomeScreen.classList.add('hidden');
        chatMessages.classList.remove('hidden');
        
        // Add User Message
        appendMessage('user', userText);
        conversationHistory.push({ role: 'user', content: userText });
        
        // Reset input
        messageInput.value = '';
        messageInput.style.height = 'auto';
        sendBtn.disabled = true;
        
        // Show typing indicator
        typingIndicator.classList.remove('hidden');
        chatWindow.scrollTo(0, chatWindow.scrollHeight);
        
        // Prepare payload for backend proxy
        const payload = {
            model: "local-model",
            temperature: 0.7,
            max_tokens: 2048,
            messages: [
                { role: "system", content: modes[currentMode].systemPrompt },
                ...conversationHistory
            ]
        };
        
        try {
            // Note: Sending to FastAPI backend acting as proxy
            const response = await fetch("https://unveil-ai-bot.onrender.com/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
            
            typingIndicator.classList.add('hidden');
            
            if (response.ok) {
                // Prepare a new AI message bubble
                const msgDiv = document.createElement("div");
                msgDiv.className = `message ai`;
                const avatarClass = modes[currentMode].icon;
                msgDiv.innerHTML = `
                    <div class="msg-avatar">
                        <i class="fas ${avatarClass}"></i>
                    </div>
                    <div class="msg-content">
                        <p></p>
                    </div>
                `;
                chatMessages.appendChild(msgDiv);
                const contentP = msgDiv.querySelector("p");
                
                let aiFullText = "";
                
                const reader = response.body.getReader();
                const decoder = new TextDecoder("utf-8");
                let buffer = "";
                
                while(true) {
                    const {done, value} = await reader.read();
                    if (done) break;
                    buffer += decoder.decode(value, {stream: true});
                    
                    let newlineIdx;
                    while ((newlineIdx = buffer.indexOf('\n')) !== -1) {
                        const line = buffer.slice(0, newlineIdx).trim();
                        buffer = buffer.slice(newlineIdx + 1);
                        
                        if(line.startsWith('data: ') && line !== 'data: [DONE]') {
                            try {
                                const parsed = JSON.parse(line.slice(6));
                                if (parsed.error) {
                                    aiFullText += "\n[System Error: " + parsed.error + "]";
                                } else if (parsed.choices && parsed.choices[0].delta && parsed.choices[0].delta.content !== undefined) {
                                    aiFullText += parsed.choices[0].delta.content;
                                }
                                contentP.innerHTML = aiFullText.replace(/\n/g, "<br>");
                                chatWindow.scrollTo(0, chatWindow.scrollHeight);
                            } catch(e) {
                                console.error('Error parsing chunk:', line);
                            }
                        }
                    }
                }
                conversationHistory.push({ role: 'assistant', content: aiFullText });
            } else {
                const errorData = await response.json();
                appendMessage('ai', `Error connecting to backend: ${errorData.error || response.status}`);
            }
        } catch (error) {
            typingIndicator.classList.add('hidden');
            appendMessage('ai', `Connection error: Ensure the FastAPI backend and local LLM are running.`);
            console.error(error);
        }
    });

    // Initialize chips on load
    document.querySelectorAll(".chip").forEach(chip => {
        chip.addEventListener("click", () => {
            messageInput.value = chip.dataset.text;
            chatForm.dispatchEvent(new Event("submit"));
        });
    });
    
    // New Session
    document.getElementById("new-session-btn").addEventListener("click", () => {
        clearChat(modes[currentMode]);
    });
});
