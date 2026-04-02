#  Unveil AI

##  Overview

This project is an **Unveil AI Chatbot** built for hackathon purposes.
It uses a powerful open-source LLM (**Dolphin 3 + LLaMA 3.1**) to provide **less-restricted, open, and raw responses** compared to traditional AI systems.

The goal is to demonstrate **freedom of AI interaction**, real-time responses, and a clean web interface.

---

##  Features

*  Uncensored AI responses
*  Real-time chat interface
*  Fast backend using FastAPI
*  Simple and responsive frontend
*  Uses advanced LLM (Dolphin 3 + LLaMA 3.1)
*  Easy to run locally

---

##  Tech Stack

### Frontend

* HTML
* CSS
* JavaScript

### Backend

* FastAPI (Python)

### AI Model

* Dolphin 3
* LLaMA 3.1

---

##  Project Structure

```
project/
│── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
│── backend/
│   ├── main.py
│   └── model_handler.py
│
│── requirements.txt
│── README.md
```

---

##  Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

---

### 2. Setup Backend

```bash
cd backend
pip install -r ../requirements.txt
```

---

### 3. Run FastAPI Server

```bash
uvicorn main:app --reload
```

Server runs on:

```
http://127.0.0.1:8000
```

---

### 4. Run Frontend

* Open `index.html` in browser
  OR
* Use Live Server (VS Code recommended)

---

##  How It Works

1. User types message in frontend
2. Request sent to FastAPI backend
3. Backend sends prompt to LLM (Dolphin + LLaMA)
4. Model generates response
5. Response displayed in UI

---

##  Target Users

* Students experimenting with AI
* Developers exploring LLMs
* Hackathon participants
* Users wanting open AI interaction

---

##  Future Scope

* Add voice input/output
* Deploy on cloud (AWS / Vercel)
* Add authentication system
* Improve UI/UX
* Multi-user chat rooms
* Fine-tuned custom models

---

##  Disclaimer

This project uses an **uncensored AI model**, so responses may be raw or unfiltered.
Use responsibly.

---

##  Team

* Sahil — AI Model & Backend
* Tanish — Frontend
* Tanisha — Frontend & Presentation

---

##  Notes for Judges

* AI is used only for model integration
* Project logic, structure, and understanding are fully explained by the team
* Code is modular and easy to run locally

---

