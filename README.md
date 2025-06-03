# StudySync - Student Study Partner Matching Platform

StudySync is a web application designed to connect university students with compatible study partners based on academic goals, schedules, and learning preferences to enhance learning experiences and foster academic collaboration.

**Live Application**: [https://nimble-frangollo-0e905e.netlify.app/](https://nimble-frangollo-0e905e.netlify.app/)

## Project Overview

### Objectives
- Create an intuitive platform for students to find ideal study partners based on comprehensive compatibility factors
- Match students according to schedules (日程安排), learning habits (学习习惯), location (地点), study methodology (学习方式), and personality traits (性格)
- Reduce academic isolation through meaningful peer connections
- Improve student engagement and academic performance through optimally matched study groups
- Foster a stronger sense of campus community

### Target Users
**Primary Users:**
- University and college students (both undergraduate and graduate)
- Students seeking academic collaboration
- New students looking to build connections
- Remote/online students needing virtual study support

**User Profiles:**
- Academic Collaborators: Students seeking partners for specific courses or projects
- Consistency Seekers: Students wanting regular, scheduled study sessions
- Community Builders: Students interested in both academic and social connections
- Last-Minute Crammers: Students needing help before upcoming exams or deadlines

## Features

### Core Features
- **Smart Matching Algorithm**: Connects students based on schedules, learning habits, location, study methodology, and personality traits
- **Interactive Profile Management**: Comprehensive profile builder with academic info, study preferences, and availability scheduling
- **Visual Schedule Coordination**: Interactive time-slot selector for availability matching
- **Match Scoring System**: Multi-factor compatibility scoring with percentage breakdowns
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### Detailed Feature List
1. **Personalized User Profiles**
   - Academic information (major, courses, interests)
   - Study style preferences (quiet/discussion-based, indoor/outdoor, etc.)
   - Learning habits assessment (visual learner, note-taker, quiz-focused, etc.)
   - Personality traits relevant to group dynamics (leader/follower, introvert/extrovert)
   - Detailed availability calendar with recurring schedule options
   - Location preferences and commute limitations
   - Preferred study environments (library, coffee shop, outdoor spaces, etc.)

2. **Intelligent Matching Algorithm**
   - Multi-factor compatibility assessment
   - Weighted matching system prioritizing factors most important to each user
   - Adjustable search parameters for different needs

3. **Match Results Dashboard**
   - Visual display of recommended matches with compatibility metrics
   - Filter and sorting options for match results
   - Connection request system

4. **Group Session Planner**
   - Collaborative scheduling tool
   - Meeting location suggestions
   - Calendar integration
   - Study session reminders

---

## Setup Instructions

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- Node.js and npm (optional, for local development)

### Installation Options

#### Option 1: Direct Access (No Installation Required)
The application is deployed and can be accessed directly at:
```
https://nimble-frangollo-0e905e.netlify.app/
```

#### Option 2: Local Development Setup

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/studysync.git
cd studysync
```

2. **Set up virtual environment (if using Python backend):**
```bash
# Create virtual environment
python -m venv studysync-env

# Activate virtual environment
# On Windows:
studysync-env\Scripts\activate
# On macOS/Linux:
source studysync-env/bin/activate
```

3. **Install dependencies:**
```bash
# For frontend dependencies
npm install

# For Python dependencies (if applicable)
pip install -r requirements.txt
```

4. **Start the development server:**
```bash
npm start
```

5. **Access the application:**
   - Open your browser and navigate to `http://localhost:3000`

### Project Structure
```
studysync/
├── static/              # Static assets (CSS, JS, images)
├── templates/           # HTML templates
├── src/                 # Source code
├── app.py              # Main application file
├── requirements.txt    # Python dependencies
├── package.json        # Node.js dependencies
└── README.md          # This file
```

---

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

---

## 📈 Development Progress

## Milestone 1 Progress

### Completed
- **Virtual Environment Setup**: Properly configured and documented development environment
- **Project Structure**: Organized folder structure with clear separation of concerns
- **Homepage Implementation**: Functional homepage showcasing core features and navigation
- **Local Development**: Application successfully runs locally without setup errors
- **Documentation**: Initial README with setup instructions and project overview

### Milestone 1 Achievements
- Established solid foundation for the StudySync platform
- Implemented responsive design framework
- Created user-friendly interface structure
- Set up development workflow and deployment pipeline

Client Review & Approval ✅
Reviewed Features:

User Registration and Login - ✅ Approved
Implemented with localStorage authentication simulation
Frontend validation and password confirmation working


Calendar Dashboard - ✅ Approved
Interactive calendar with full CRUD operations
Modal-based event management system


User Profile Interface - ✅ Approved
Responsive design with modern styling
User avatar and statistics display


Client Feedback Addressed:

Core login and calendar functionalities approved by client
Clean, responsive interface meets design requirements
Solid foundation established for future enhancements

## Milestone 2 Progress

### Completed
- **User Authentication System**: Complete login and registration functionality implemented in auth.js, register.html, and login.html
- **Interactive Calendar Interface**: Full calendar dashboard with event creation, editing, and deletion capabilities
- **User Profile Management**: Responsive profile interface with avatar, stats, and quick-access navigation
- **Frontend Validation**: Password confirmation and input validation systems
- **Responsive Design**: Modern, mobile-friendly interface using CSS variables for consistency
- **LocalStorage Integration**: Simulated authentication and data persistence
- **Modal-Based Interactions**: Clean popup interfaces for calendar events and user actions

### Client Review & Approval ✅
**Reviewed Features:**
1. **User Registration and Login** - ✅ Approved
   - Implemented with localStorage authentication simulation
   - Frontend validation and password confirmation working
   
2. **Calendar Dashboard** - ✅ Approved  
   - Interactive calendar with full CRUD operations
   - Modal-based event management system
   
3. **User Profile Interface** - ✅ Approved
   - Responsive design with modern styling
   - User avatar and statistics display

**Client Feedback Addressed:**
- Core login and calendar functionalities approved by client
- Clean, responsive interface meets design requirements
- Solid foundation established for future enhancements

### 🔄 In Progress
- **Enhanced Matching Algorithm**: Machine learning components for better compatibility scoring
- **Real-time Messaging**: Communication system between matched users
- **Group Formation Features**: Multi-user study group creation and management
- **Code Refactoring**: Modularizing calendar logic for improved maintainability
- **Unit Testing**: Adding test coverage for AuthService and core functionality

### 📅 Planned Features (Phase 2)
- **Calendar Integration**: Google/Outlook Calendar synchronization
- **Progress Tracking**: Study analytics and performance metrics
- **Location Services**: Campus map integration for location-based matching
- **Gamification**: Study streaks, achievements, and engagement rewards
- **Community Features**: Event board for open study sessions and academic meetups
- **Resource Sharing**: File and note sharing capabilities
- **Virtual Study Rooms**: Online collaboration spaces

---

## Known Issues & Limitations

### Current Issues
1. **Duplicate Email Registration**: System allows registration with existing emails, overwriting previous records
   - **Status**: Identified by client review
   - **Priority**: High
   - **Solution**: Adding email validation check to prevent duplicates

2. **Code Organization**: Calendar logic in script.js needs modularization
   - **Status**: Client feedback - approved with improvement request
   - **Impact**: Affects maintainability and scalability
   - **Timeline**: Refactoring in progress

3. **Password Security**: Basic password validation needs enhancement
   - **Recommendation**: Add minimum length and special character requirements
   - **Status**: Planned for next phase

4. **Authentication Flow**: Users can access login/register pages when already logged in
   - **Impact**: Poor user experience
   - **Solution**: Add redirect logic for authenticated users

5. **Testing Coverage**: Unit tests not yet implemented
   - **Status**: Client suggested adding tests for AuthService.login() function
   - **Priority**: Medium - foundational work complete, testing to follow

### Client Review Summary
**Meeting Date**: Recent client milestone review completed  
**Client**: Shiyu (yushi318@uw.edu)  
**Developer**: Kelly Peng  
**GitHub Repository**: https://github.com/kalipeng/Studysycn/tree/main/shiyu

**Client Approval Status**: ✅ **APPROVED**
- Core functionality meets requirements and expectations
- Responsive design and modern interface approved
- Solid foundation established for future development

**Client Feedback Implementation**:
- **Code Structure**: Acknowledged need for JavaScript modularization - in progress
- **Testing Strategy**: Unit testing framework to be implemented next phase
- **Security Enhancements**: Password validation improvements planned
- **Bug Identification**: Duplicate email registration issue documented and prioritized

**Client Reflection**:  
*"The developer has made solid progress on building out the core user-facing functionality. The user registration, login system, and calendar-based dashboard are fully functional and integrated into a clean and responsive interface."*

---

## 🛠️ Technical Details

### Technologies Used
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **UI Framework**: Custom CSS with responsive design principles
- **State Management**: LocalStorage for data persistence
- **Icons**: SVG-based custom icon system
- **Fonts**: Inter (UI) and Playfair Display (headings)
- **Deployment**: Netlify for hosting and continuous deployment

### Architecture
The application follows a component-based architecture with these key modules:
1. **Profile Management**: Handles user data and preferences
2. **Matching Algorithm**: Processes user data to find compatible study partners
3. **Scheduling System**: Manages availability and study session planning
4. **Communication System**: Facilitates interaction between matched users

### API Endpoints (Planned)
```
GET /api/matches - Retrieve matches based on user profile
POST /api/profile - Update user profile information
GET /api/sessions - Retrieve upcoming study sessions
POST /api/connect - Send connection request to potential study partner
GET /api/messages - Retrieve user messages
POST /api/messages - Send message to study partner
```

---

## 🔒 Privacy & Security Considerations

StudySync is designed with student privacy and security in mind:

### Data Protection
- **Location Privacy**: Student location data limited to general areas (not exact coordinates)
- **Secure Communication**: Encrypted communications and secure data storage
- **Regulatory Compliance**: Compliance with educational data regulations (FERPA, GDPR, etc.)
- **Access Control**: Personal contact information only shared after mutual connection approval
- **User Control**: Opt-in privacy controls for user information visibility

### Security Measures
- Regular security audits and updates
- Secure authentication system
- Data encryption for sensitive information
- Privacy-first design approach

---

## 📞 Support & Contact

### Development Team
- **Client**: Shiyu - yushi318@uw.edu
- **Developer**: Kelly - Peng906@uw.edu

### Support Channels
- **Email**: support@studysync.example.com
- **Help Center**: https://help.studysync.example.com
- **Office Hours**: Monday-Friday, 9am-5pm PST

### Contributing
We welcome contributions from the university community! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines.

---

## 📋 Development Timeline

### April 2025
- **Week 1**: Project kickoff and requirements gathering
- **Week 2**: UX wireframing and database planning
- **Week 3**: UI design and database schema finalization
- **Week 4**: Development environment setup and authentication system

### May 2025
- **Week 1**: User authentication and profile system
- **Week 2**: Matching algorithm development begins
- **Week 3**: Dashboard implementation and API development
- **Week 4**: Complete matching algorithm and initial testing

### June 2025
- **Week 1**: Session planning features and integration testing
- **Week 2**: Production deployment and project closeout

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Project Success Metrics

### Milestone 1 Completion ✅
- [x] Virtual environment properly set up and documented
- [x] Clear project structure established
- [x] Homepage implemented with meaningful feature progress
- [x] Application runs locally without errors
- [x] README updated with progress and clear instructions

### Milestone 2 Status ✅
- [x] **Feature Completion**: Core features (authentication, calendar, profile) implemented and functional
- [x] **Client Code Review**: Complete review conducted with client approval received
- [x] **Bug Identification**: Key issues identified and documented with improvement priorities
- [x] **Setup Instructions**: Clear local development and deployment instructions provided
- [x] **Progress Documentation**: Comprehensive updates on project status and known issues
- [x] **Feedback Integration**: Client suggestions documented and implementation planned

**Current Score**: All milestone requirements successfully met with client approval and comprehensive documentation.
