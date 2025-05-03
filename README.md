# Study Group Matching Web App – Project Proposal

## 1. Project Objectives

The goal of this project is to design and develop a web-based platform that facilitates meaningful student connections based on shared academic goals, schedules, interests, and location. The app will:

- Match students with similar availability, study habits, and academic interests.
- Foster collaboration and academic support through small group study matching.
- Promote social engagement and community among students by connecting them with peers nearby or with similar hobbies.
- Enhance student well-being and academic performance by reducing isolation and encouraging participation.

---

## 2. Target Users and Their Needs

### Primary Users
- University/College students (undergraduate and graduate)

### User Needs
- Efficient matching with compatible study partners or groups.
- Flexible scheduling based on their own availability.
- Study-style alignment (e.g., quiet/independent vs. discussion-focused).
- Discovery of nearby peers for both academic and casual interaction.
- Safe and inclusive environment for social and academic interaction.

---

## 3. Key Deliverables

1. **User Onboarding System**  
   - Profile creation with academic info, study style preferences, availability calendar, interests, and general location (e.g., campus area or neighborhood).

2. **Matching Algorithm**  
   - Matches users based on weighted similarity metrics (e.g., overlapping schedules, shared classes/interests, location).

3. **Match Result Dashboard**  
   - A list of recommended matches with options to connect, message, or create group study sessions.

4. **Group Session Planner**  
   - In-app scheduling tool to help small groups pick meeting times and locations.

5. **Optional Features**  
   - In-app messaging or group chat  
   - Event board for open study sessions or meetups  
   - Integration with school tools (e.g., campus calendars)

---

## 4. Special Constraints

### Data Privacy & Security
- Compliance with institutional data protection guidelines and local privacy regulations (e.g., GDPR, PIPEDA, or FERPA in the U.S.).
- Student location must be generalized (e.g., residence hall or zip code), not exact, to protect privacy.
- Secure storage of personal information with encrypted communication channels.

### Accessibility
- Must adhere to accessibility standards (e.g., WCAG 2.1) for inclusivity.

### Scalability
- Should be designed with modular architecture to allow future scaling for more institutions or added features.

---

## 5. Expected Outcome

By the end of this project, the app should be able to:

- Successfully connect students with compatible study partners or groups.
- Help users form stronger academic and social bonds with their peers.
- Improve student engagement and collaboration both online and in person.
- Provide an intuitive and enjoyable user experience tailored to student life.

Long term, this app has the potential to be integrated into university systems as a supplementary social-academic tool, improving both academic outcomes and campus community-building.

# developer update
---

## Feature List

- User registration and login (via `localStorage`)
- Calendar-based event scheduling with dynamic modal interface
- Event CRUD (create, edit, delete) tied to specific dates
- User profile page with avatar, stats, and dashboard navigation
- Responsive UI optimized for desktop and mobile
- Frontend validation for passwords and duplicate inputs

---

## Setup and Usage Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) (v14+)
- [Live Server Extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) for VSCode or a static file server

### Quick Start

1. **Clone the Repository**

git clone https://github.com/your-username/studysync.git
cd studysync
```

2. **Open with Live Server**

Open `index.html` with Live Server or use a simple static server:

```bash
# Using Python 3
python -m http.server 3000
```

3. **Access the App**

Open your browser and visit:  
`http://localhost:3000`

---

## 📁 File Structure

.
├── index.html           # Homepage/Dashboard
├── profile.html         # User Profile & Calendar
├── login.html           # Login page
├── register.html        # Registration page
├── script.js            # Main logic for calendar and modals
├── auth.js              # AuthService for user handling
├── css/
│   └── styles.css       # Optional styling file
└── README.md
```



## Demo Data Behavior

- User credentials are stored temporarily in `localStorage`.
- On registration, users are redirected to the login page.
- Events added to the calendar exist in memory only and do not persist after refresh.
- Demo logic includes input validation and password match checking.



##  Customization Notes

- To integrate a backend, replace the logic in `auth.js` and `script.js` with API calls.
- Add a persistent database to store events and user profiles.
- Expand modal features to support tags, color coding, or collaboration.
- Customize visuals in `styles.css` or inline CSS in each HTML file.

---

## Author

**Kelly peng**  
Front-end Developer & Designer

