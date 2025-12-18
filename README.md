# 🎓 AlumNexus: Smart Alumni Platform

**AlumNexus** is a next-generation, AI-powered platform designed to bridge the gap between educational institutions and their alumni networks. By leveraging Google Gemini AI, the platform transforms static directories into dynamic ecosystems of mentorship, career growth, and community engagement.

---

## 🚀 Key Features

### 🤖 AI-Powered Intelligence (Google Gemini)
- **Smart Mentorship Matching**: Connects students with alumni based on career goals, skills, and communication preferences.
- **Community Highlights**: Curates real-time "Success Stories" and "Campus Updates" using generative AI.
- **Job Market Scan**: AI-driven discovery of relevant opportunities tailored to the institution's departments.
- **Profile Optimization**: Analyzes user profiles to provide suggestions for completeness and professional impact.
- **Automated Summaries**: Generates professional bios instantly from user data.

### 💼 Career & Growth
- **Alumni Directory**: A searchable, filterable network for students to find mentors and alumni to find talent.
- **Job Board**: Post and find internships, full-time roles, and contract positions.
- **PDF Resume Export**: Download a professionally formatted profile as a PDF for external use.

### 📅 Community Engagement
- **Event Management**: RSVP to webinars, reunions, and workshops with AI-driven recommendations based on interests.
- **Creator Dashboard**: Advanced analytics for platform administrators to track sentiment and engagement.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Tailwind CSS, Lucide React, Recharts (Analytics).
- **Backend**: Node.js, Express.
- **Database**: MySQL (optimized for local environments like XAMPP).
- **AI Engine**: Google Gemini API (`@google/genai`).
- **Tools**: jsPDF, Concurrent execution.

---

## ⚙️ Installation & Setup

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **MySQL/XAMPP** (Ensure a database named `alumnexus` exists)
- **Google Gemini API Key** (Get one at [ai.google.dev](https://ai.google.dev/))

### 2. Database Configuration
Run the following SQL command in your MySQL terminal to create the required table:
```sql
CREATE DATABASE alumnexus;
USE alumnexus;

CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role ENUM('STUDENT', 'ALUMNI', 'ADMIN', 'CREATOR') NOT NULL,
    avatar TEXT,
    graduation_year INT,
    department VARCHAR(100),
    job_title VARCHAR(100),
    company VARCHAR(100),
    bio TEXT,
    skills JSON,
    interests JSON,
    privacy_settings JSON,
    social_links JSON,
    preferences JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Installation
```bash
# Clone the repository and install dependencies
npm install
```

### 4. Running the Project
```bash
# Set your API Key in the environment
# On Windows (CMD): set API_KEY=your_key_here
# On Mac/Linux: export API_KEY=your_key_here

# Run both Frontend and Backend concurrently
npm run dev
```
- **Frontend**: [http://localhost:5173](http://localhost:5173) (or your serve port)
- **Backend**: [http://localhost:3001](http://localhost:3001)

---

## 📂 Project Structure

- `/src`: Frontend React components and logic.
- `/server`: Node.js/Express backend and MySQL integration.
- `services/geminiService.ts`: Core AI logic and API interactions.
- `constants.ts`: Mock data for offline/fallback modes.
- `types.ts`: Global TypeScript definitions.

---

## 🛤️ Future Roadmap
- [ ] Real-time Chat Messaging between Mentors and Mentees.
- [ ] Integration with LinkedIn API for automated profile sync.
- [ ] Video calling integration directly within the platform.
- [ ] Donation and Alumni Fundraising modules.

---

**Developed with ❤️ for Educational Excellence.**
