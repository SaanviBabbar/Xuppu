# ☠️ XUPPU – The Goal Tracker with Zero Chill

> *"Productivity is temporary. Public embarrassment is forever."*

XUPPU is a **gamified AI-powered productivity web application** built for the **Gamified Goal Checker** hackathon track.

Instead of relying on boring checklists and reminder notifications, XUPPU transforms goal tracking into an interactive game. Complete goals to earn XP, defeat bosses, unlock achievements, and collect bananas. Ignore your goals for too long... and XUPPU might just roast you into finishing them.

Its flagship feature, the **Dead Man's Switch**, raises the stakes even further by threatening to post an embarrassing AI-generated tweet to your connected X (Twitter) account if you miss your deadline.

---

## 🌐 Live Demo

**Website:** `https://xuppu.onrender.com/`

<img width="1237" height="867" alt="image" src="https://github.com/user-attachments/assets/de8b3b72-7b34-4424-a996-ae7644e4f58c" />

<img width="1260" height="927" alt="image" src="https://github.com/user-attachments/assets/056ef66d-e2b5-4527-9991-c0806879c84e" />

---

## 🎯 The Problem

Most productivity apps suffer from the same issue:

- 📋 Static checklists
- 📊 Passive progress bars
- 🔔 Reminder notifications that users eventually ignore

Motivation fades over time, and existing tools rarely create any meaningful sense of urgency.

---

## 💡 Our Solution

XUPPU introduces **gamified accountability**.

As deadlines approach:

- 🎭 Xuppu becomes increasingly sarcastic.
- 🎨 Visual urgency intensifies through animations and effects.
- 👾 Users battle bosses while progressing toward their goals.
- 🍌 Completing tasks rewards XP, bananas, achievements, and progression.
- ☠️ Users can activate a **Dead Man's Switch**, adding real consequences for procrastination.
<img width="1462" height="491" alt="image" src="https://github.com/user-attachments/assets/8d20bf09-d0be-43b8-901b-24d29b3449d9" />

---

# ✨ Features

## 🎯 Goal Tracking

- Create goals with deadlines
- Track progress
- Difficulty levels
- Categories
  <img width="1232" height="925" alt="image" src="https://github.com/user-attachments/assets/991de43f-4d64-40f8-ac57-2852d5298993" />


---

## 🤖 AI Roast Generator

Generate unique sarcastic roasts using the OpenAI API.

Each roast is customized using:

- Goal name
- Difficulty
- Progress
- Days overdue

Example:

> "Breaking News: You scheduled 'Finish Assignment' and somehow managed to procrastinate professionally."

---

## ☠️ Dead Man's Switch

The signature feature of XUPPU.
<img width="1177" height="587" alt="image" src="https://github.com/user-attachments/assets/b45014e8-c335-43b8-b901-84411bef0d69" />


### Workflow

1. Create a goal.
2. Generate an embarrassing roast.
3. Connect your X account.
4. Arm the Dead Man's Switch.
5. Complete your goal before the deadline.

If you fail...

XUPPU automatically posts the roast to your connected X account.

> **Note:** This repository currently uses a **Mock Twitter Client** for safe development and demonstrations.

---

## 🎮 Gamification

- XP system
- Boss fights
- Multiple stages
- Banana currency
- Achievement system
- Shop system
- Combo mechanics
- Dynamic urgency levels

---

## 🎨 Interactive UI

- Animated mascot
- Dynamic visual effects
- Floating projectiles
- Sound effects
- Deadline animations
- Responsive layout

---

# 🏗 Technical Architecture

```
                 User
                   │
                   ▼
      HTML • CSS • JavaScript
                   │
              Fetch API
                   │
                   ▼
             Flask Backend
                   │
     ┌─────────────┼──────────────┐
     ▼             ▼              ▼
 Roast API    Dead Man's      Twitter OAuth
 (OpenAI)      Switch Logic      Integration
                   │
             APScheduler
                   │
          In-Memory Storage
```

---

# 🔄 Dead Man's Switch Workflow

```
User creates goal
        │
        ▼
Generate AI Roast
        │
        ▼
Connect X Account
        │
        ▼
Arm Switch
        │
        ▼
Flask stores switch
        │
        ▼
APScheduler checks deadlines
        │
        ├───────────────┐
        ▼               ▼
Goal completed      Goal missed
        │               │
        ▼               ▼
Disarm switch     Post roast to X
```

---

# 🛠 Tech Stack

## Frontend

- HTML5
- CSS3
- JavaScript

## Backend

- Python
- Flask

## AI

- OpenAI Responses API

## Scheduling

- APScheduler

## Social Integration

- X API
- OAuth 2.0 + PKCE
- Tweepy

## Deployment

- Render

## Version Control

- Git
- GitHub

---

# 📂 Project Structure

```
XUPPU
│
├── css/
│   ├── styles.css
│   └── deadmanswitch.css
│
├── js/
│   ├── app.js
│   └── deadmanswitch.js
│
├── sounds/
│
├── app.py
├── roast_gen.py
├── storage.py
├── twitter_client.py
├── requirements.txt
├── chaos.html
└── README.md
```

---

# 🚀 Running Locally

Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/XUPPU.git
```

Move into the project

```bash
cd XUPPU
```

Create a virtual environment

```bash
python -m venv venv
```

Activate it

### Windows

```bash
venv\Scripts\activate
```

### macOS / Linux

```bash
source venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run the server

```bash
python app.py
```

Open:

```
http://127.0.0.1:5000
```

---

# 🔒 Security

- OAuth 2.0 Authorization Code Flow
- PKCE authentication
- Environment variables stored in `.env`
- No API secrets hardcoded

---

# 📈 Future Improvements

- PostgreSQL database
- Redis caching
- Celery background workers
- Docker containerization
- User authentication
- Personalized AI memory
- Mobile application
- Leaderboards
- Multiplayer accountability
- Real Twitter posting enabled by default

---

# 🏆 Hackathon

Built for the **Gamified Goal Checker** track.

Challenge:

> Create a goal tracking system that motivates users through gamification instead of static checklists and reminder notifications.

---

# 👩‍💻 Author

**Saanvi**

Built as a **solo project** during the Freshers Hackathon.

---

# 📄 License

This project is licensed under the MIT License.

---

⭐ If you enjoyed this project, consider giving it a star!
