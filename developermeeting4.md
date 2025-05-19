# StudySync - Student Study Partner Matching Platform

StudySync is a web application designed to connect university students with compatible study partners based on academic goals, schedules, and learning preferences to enhance learning experiences.

![StudySync Platform](https://via.placeholder.com/800x400?text=StudySync+Platform)

## 🚀 Features

- **Smart Matching Algorithm**: Connects students based on schedules, learning habits, location, study methodology, and personality traits
- **Interactive Profile Management**: Comprehensive profile builder with academic info, study preferences, and availability scheduling
- **Visual Schedule Coordination**: Interactive time-slot selector for availability matching
- **Match Scoring System**: Multi-factor compatibility scoring with percentage breakdowns
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## 📋 Setup Instructions

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- Node.js and npm (optional, for local development)

### Installation Options

#### Option 1: Direct Access (No Installation)

The application is deployed and can be accessed directly at:
```
https://studysync.example.com
```

#### Option 2: Local Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/studysync.git
cd studysync
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Access the application at `http://localhost:3000`

## 🔍 Usage Guide

### Creating Your Profile

1. **Sign up** or **log in** to your StudySync account
2. Navigate to the **Profile** page
3. Complete all three sections:
   - **Academic Info**: Major, year, current courses
   - **Study Preferences**: Learning styles, environments, methods
   - **Availability**: Select available time slots on the weekly calendar

### Finding Study Matches

1. Go to the **Matches** page
2. View automatically generated study partner recommendations
3. Filter matches by major, year, schedule compatibility, etc.
4. Click on individual matches to view detailed compatibility breakdowns
5. Use the **Connect** or **Message** buttons to reach out to potential study partners

### Managing Study Sessions

1. Navigate to the **Calendar** section
2. View upcoming study sessions
3. Create new sessions by selecting dates, times, and inviting matched partners
4. Track attendance and set study goals for each session

## 📈 Project Progress

### Completed
- ✅ User interface design and implementation
- ✅ Profile page with academic info, study preferences, and availability sections
- ✅ Interactive time slot selector for scheduling
- ✅ Match page with filtering and sorting capabilities
- ✅ Data persistence using localStorage
- ✅ Responsive design for all screen sizes

### In Progress
- 🔄 Backend API integration for user authentication
- 🔄 Enhanced matching algorithm with machine learning components
- 🔄 Real-time messaging system
- 🔄 Study group formation feature

### Planned
- 📅 Calendar integration with Google/Outlook Calendar
- 📅 Progress tracking and study analytics
- 📅 Location-based matching with campus map integration
- 📅 Gamification elements (study streaks, achievements)

## ⚠️ Known Issues

1. **Time Zone Handling**: Currently, the platform doesn't adjust for different time zones. All times are displayed in the local time of the user.

2. **Browser Compatibility**: The interactive calendar works best in Chrome and Firefox. Safari users may experience minor visual glitches.

3. **Data Persistence**: Since we're using localStorage, data will be lost if the browser cache is cleared. Future versions will implement server-side storage.

4. **Performance on Large Datasets**: With a large number of matches (100+), the filtering system may experience slight delays. Optimization is planned.

5. **Mobile View Limitations**: While the application is responsive, some advanced features like the detailed match compatibility breakdown have limited functionality on very small screens.

## 🛠️ Technical Details

### Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **UI Framework**: Custom CSS with responsive design principles
- **State Management**: LocalStorage for data persistence
- **Icons**: SVG-based custom icon system
- **Fonts**: Inter (UI) and Playfair Display (headings)

### Architecture

The application follows a component-based architecture with these key modules:

1. **Profile Management**: Handles user data and preferences
2. **Matching Algorithm**: Processes user data to find compatible study partners
3. **Scheduling System**: Manages availability and study session planning
4. **Real-time Communication**: Facilitates interaction between matched users

### API Endpoints (Planned)

```
GET /api/matches - Retrieve matches based on user profile
POST /api/profile - Update user profile information
GET /api/sessions - Retrieve upcoming study sessions
POST /api/connect - Send connection request to potential study partner
```

## 🔒 Privacy Considerations

StudySync is designed with student privacy in mind:
- Personal contact information is only shared after mutual connection approval
- Academic performance data (GPA, etc.) is optional and only used for matching purposes
- Users can control visibility of their profiles in match searches
- Data retention policies comply with educational privacy standards

## 🤝 Contributing

We welcome contributions from the university community! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines.

## 📞 Support

For technical assistance or feature requests, please contact:

- **Email**: support@studysync.example.com
- **Help Center**: https://help.studysync.example.com
- **Office Hours**: Monday-Friday, 9am-5pm PST

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
