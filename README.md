# CodeStart (Learn2Code)

CodeStart is an interactive web-based platform designed for beginners to master programming. It offers a comprehensive learning experience through interactive theory, challenging MCQs, adaptive quizzes, and a powerful real-time online compiler.

## Features

- **Interactive Theory**: Engaging, simple explanations with real-world examples that make sense to beginners.
- **Fill in the Blanks**: Complete missing code to build strong fundamental logic and code-writing muscle memory.
- **MCQs & Quizzes**: Test your knowledge immediately with practical practice questions and instant feedback.
- **Online Compiler**: Write, run, and test your code instantly directly in your web browser. Includes dedicated compilers for:
  - C
  - C++
  - Java
  - JavaScript
  - Python
- **Progress Tracking**: Visualize your learning journey, track your quiz scores, and stay motivated.
- **Community Support**: Join thousands of active learners to ask questions, share solutions, and grow together.
- **Interactive Chatbot**: Built-in chatbot support to help you along the way.

## Technologies Used

- **HTML5**: For structuring the web pages.
- **CSS3**: For styling, animations, and creating a modern, responsive user interface.
- **JavaScript (Vanilla)**: For adding interactivity, handling compiler logic, and managing user sessions.
- **Font Awesome**: For beautiful icons.
- **Google Fonts**: Utilizing the 'Outfit' font family.

## Project Structure

- `index.html`: The main landing page showcasing the platform's features.
- `languages.html`: The courses page listing available programming languages.
- `Login.html`: User authentication page.
- `dashboard.html`: The user's main dashboard after logging in.
- `profile.html`: User profile management.
- `*-compiler.html/css/js`: Dedicated compiler interfaces and logic for C, C++, Java, JavaScript, and Python.
- `chatbot.css` / `chatbot.js`: The integrated chatbot component.
- `style.css` / `script.js`: Global styles and scripts for the platform.

## How to Run Locally

1. Clone or download this repository to your local machine.
2. Navigate to the project folder (`Learn2code`).
3. Open `index.html` in any modern web browser (Google Chrome, Mozilla Firefox, Safari, Edge, etc.).
4. No additional servers or installations are required to view the static pages!

## License

&copy; 2026 CodeStart. All rights reserved.




# 🚀 CodeStart - AI Powered Coding Learning Platform (learn2code)

> Learn. Practice. Build. Track. Improve.

CodeStart is a modern AI-powered coding education platform designed to help beginners become confident programmers through interactive learning, real-time coding practice, personalized analytics, and intelligent learning recommendations.

Unlike traditional learning websites, CodeStart analyzes every learner's progress and provides personalized study plans, performance insights, and AI-powered guidance to accelerate learning.

---

# 🌟 Features

## 🔐 Authentication

- Secure Authentication using NextAuth.js
- Email & Password Login
- Google Authentication
- GitHub Authentication
- Persistent User Sessions
- Protected Dashboard
- Forgot Password
- Email Verification

---

## 👤 User Dashboard

Every user gets a personalized dashboard including:

- Learning Progress
- Daily Coding Streak
- XP Points
- Earned Badges
- Completed Courses
- Saved Notes
- Bookmarked Questions
- Compiler History
- Quiz History
- Practice Statistics

---

## 📚 Interactive Learning

Each programming language contains

- Beginner Friendly Theory
- Code Examples
- Visual Explanations
- Syntax Highlighting
- Real-world Examples
- Common Mistakes
- Interview Tips

Supported Languages

- C
- C++
- Java
- Python
- JavaScript

---

## ✍️ Interactive Practice

Students can strengthen concepts using

- MCQs
- Fill in the Blanks
- Code Completion
- Debugging Questions
- Output Prediction
- Coding Challenges
- Daily Practice Problems

---

## 💻 Online Compiler

Integrated compiler for

- C
- C++
- Java
- JavaScript
- Python

Features

- Run Code
- Custom Input
- Save Code
- Download Code
- Copy Code
- Dark Theme
- Execution History

---

## 🤖 AI Learning Assistant

Built-in AI chatbot that can

- Explain concepts
- Solve doubts
- Explain errors
- Debug code
- Suggest better solutions
- Generate examples
- Recommend next topics

---

## 📊 Performance Analytics

Every learner gets a complete analytics dashboard.

### Learning Statistics

- Overall Progress (%)
- Weekly Progress
- Monthly Progress
- Learning Time
- Quiz Accuracy
- Average Score
- Compiler Usage
- Practice Completion
- Language-wise Progress

### Skill Analysis

CodeStart automatically detects

- Strong Topics
- Weak Topics
- Frequently Wrong Concepts
- Time Spent Per Topic
- Improvement Rate

---

## 🎯 Personalized Roadmap

Based on performance, the system recommends

- What to learn next
- Topics needing revision
- Daily practice targets
- Weekly goals
- Interview preparation roadmap
- Beginner → Intermediate → Advanced path

---

## 🏆 Gamification

Keep learners motivated through

- XP Points
- Achievement Badges
- Daily Streaks
- Leaderboards
- Weekly Challenges
- Certificates
- Completion Rewards

---

## 👥 Community

- Discussion Forums
- Ask Questions
- Share Solutions
- Code Reviews
- Public Profiles
- Follow Learners
- Like & Comment

---

## 📈 Admin Dashboard

Admin can

- Manage Courses
- Add MCQs
- Upload Theory
- View Users
- Track Analytics
- Monitor Platform Usage
- Moderate Community

---

# 🛠 Tech Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Shadcn UI

---

## Backend

- Next.js API Routes
- Node.js
- Prisma ORM

---

## Authentication

- NextAuth.js
- Google OAuth
- GitHub OAuth
- Credentials Provider

---

## Database

- PostgreSQL
- Prisma ORM

Database stores

- Users
- Profiles
- Courses
- Lessons
- Quiz Results
- Compiler History
- Progress
- Badges
- Streaks
- Notes
- Bookmarks
- Certificates

---

## AI Integration

- OpenAI API
- AI Chatbot
- Learning Recommendation Engine
- Personalized Feedback
- Error Explanation

---

## Other Tools

- Font Awesome
- React Icons
- React Hook Form
- Zod
- Recharts
- Monaco Editor
- Judge0 API (Compiler)

---

# 📂 Project Structure

```
CodeStart/
│
├── app/
│
├── components/
│
├── lib/
│
├── prisma/
│
├── public/
│
├── styles/
│
├── hooks/
│
├── context/
│
├── services/
│
├── types/
│
├── utils/
│
├── middleware.ts
│
├── auth.ts
│
├── prisma.ts
│
├── package.json
│
└── README.md
```

---

# 🗄 Database Schema

Main Tables

- Users
- Accounts
- Sessions
- Courses
- Lessons
- QuizAttempts
- MCQs
- FillBlanks
- CompilerHistory
- UserProgress
- Achievements
- Badges
- Notes
- Bookmarks
- DailyStreak
- Recommendations
- Certificates

---

# 📊 Learning Intelligence

The platform continuously calculates

✅ Overall Performance Score

✅ Topic-wise Accuracy

✅ Coding Speed

✅ Quiz Accuracy

✅ Daily Learning Consistency

✅ Weakest Topics

✅ Strongest Topics

✅ Practice Completion

✅ Interview Readiness Score

✅ Estimated Skill Level

The recommendation engine uses these insights to provide personalized guidance instead of showing the same content to every learner.

---

# 🔒 Authentication Flow

```
User
      ↓
Register/Login
      ↓
NextAuth Authentication
      ↓
JWT Session
      ↓
Database
      ↓
Dashboard
      ↓
Progress Tracking
      ↓
AI Recommendation Engine
```

---

# 🚀 Future Features

- AI Code Review
- Voice Learning Assistant
- Coding Contests
- Company-wise Interview Questions
- Resume Builder
- Mock Interviews
- AI Career Advisor
- Roadmap Generator
- Peer Coding
- Pair Programming
- Mobile App
- Offline Learning
- Placement Preparation
- DSA Tracker
- GitHub Integration
- LeetCode Sync
- Codeforces Sync

---

# 💡 Vision

CodeStart aims to become a complete coding ecosystem where every learner receives personalized education instead of a one-size-fits-all curriculum.

By combining authentication, analytics, AI recommendations, compiler integration, and community learning, the platform guides users toward becoming industry-ready software developers.

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/your-username/codestart.git
```

## Install Dependencies

```bash
npm install
```

## Configure Environment

Create a `.env` file

```env
DATABASE_URL=

NEXTAUTH_URL=

NEXTAUTH_SECRET=

GOOGLE_CLIENT_ID=

GOOGLE_CLIENT_SECRET=

GITHUB_ID=

GITHUB_SECRET=

OPENAI_API_KEY=

JUDGE0_API_KEY=
```

---

## Run Database

```bash
npx prisma migrate dev
```

```bash
npx prisma generate
```

---

## Start Development Server

```bash
npm run dev
```

Visit

```
http://localhost:3000
```

---

# 🤝 Contributing

Contributions are welcome!

Feel free to

- Report Bugs
- Suggest Features
- Improve Documentation
- Submit Pull Requests

---

# 📄 License

MIT License

---

# 👨‍💻 Developer

Made with ❤️ by **Kiran Mali**

Building the next generation of AI-powered coding education.