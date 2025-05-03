# StudySync – Student Organizer Web App

**StudySync** is a lightweight front-end application designed to help students manage their courses, events, and personal study schedule. It supports user registration, login, and a personalized dashboard featuring a calendar and event reminders.

---

Features

- User registration and login (via `localStorage`)
- Dynamic dashboard with:
  - Event calendar
  - Event CRUD modals (create, edit, delete)
  - Profile and notification UI
- Responsive and visually engaging design
- Event type tagging (e.g., Study Session, Group Meeting)

---

## Virtual Environment Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v14+)
- [Live Server Extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) *(for VSCode users)* or any static file server

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/studysync.git
cd studysync
```

### Open the Project in Your Editor

Use any IDE or code editor (VSCode recommended).

### 3. Serve the App

Use a live server or any static file host:

**Option 1: VSCode Live Server**
- Right-click `index.html` → "Open with Live Server"

**Option 2: Python Simple Server**
```bash
# Python 3.x
python -m http.server 3000
```

Visit: `http://localhost:3000`

---

## 📁 File Structure

```
.
├── index.html           # Homepage/Dashboard
├── profile.html         # User Profile & Calendar
├── login.html           # User Login Page
├── register.html        # User Registration Page
├── script.js            # Main application logic
├── auth.js              # AuthService for login/register/logout
├── css/
│   └── styles.css       # Optional external CSS if used
└── README.md
```

---

## Environment

No backend or database is used. All data is stored temporarily using `localStorage` in the browser. For production, connect with a real backend.

---

##  Testing

You can manually test:
- Registration flow (`register.html`)
- Login flow (`login.html`)
- Calendar event creation/edit/delete
- UI behavior on mobile/tablet/desktop

For unit testing JavaScript, consider adding:
```bash
npm install --save-dev jest
```
Then extract logic from `auth.js` or `script.js` into testable functions.

---

## Dependencies

None yet, but to manage future packages:

```bash
npm init -y
npm install package-name --save
```

---

##  Future Improvements

- Connect to a backend API
- Add persistent user sessions
- Implement color-coded event filters
- Add Google Calendar integration

---

## Author

**kelly peng**  
Front-end Developer & Designer
