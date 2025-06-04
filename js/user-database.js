/**
 * StudySync User Database System
 * Manages user registration, authentication, and data storage
 */

const UserDatabase = {
    // Initialize with some demo users for testing
    DEMO_USERS: [
        {
            id: 'demo_user_1',
            name: 'Demo User',
            email: 'demo@studysync.com',
            password: 'StudySync2024!',
            registeredAt: new Date().toISOString(),
            profileData: {
                academic: {
                    major: 'computer-science',
                    year: '3',
                    courses: 'CS301, CS315, MATH240',
                    gpa: '3.7',
                    goals: 'Software development and machine learning'
                },
                preferences: {
                    learningStyles: ['visual', 'kinesthetic'],
                    environments: ['library', 'study-room'],
                    methods: ['discussion', 'practice-problems'],
                    personality: ['collaborative', 'organized'],
                    sessionDuration: '60-90'
                },
                availability: {
                    timeSlots: [
                        { day: 'mon', time: '14:00' },
                        { day: 'tue', time: '16:00' },
                        { day: 'wed', time: '14:00' },
                        { day: 'thu', time: '16:00' },
                        { day: 'fri', time: '13:00' }
                    ],
                    location: 'library',
                    notes: 'Prefer study groups of 3-4 people'
                }
            }
        },
        {
            id: 'demo_user_2',
            name: 'Sarah Chen',
            email: 'sarah.chen@university.edu',
            password: 'StudySync2024!',
            registeredAt: new Date().toISOString(),
            profileData: {
                academic: {
                    major: 'engineering',
                    year: '2',
                    courses: 'ENG201, MATH220, PHYS101',
                    gpa: '3.9',
                    goals: 'Mechanical engineering and robotics'
                }
            }
        },
        {
            id: 'demo_user_3',
            name: 'James Wilson',
            email: 'james.wilson@university.edu',
            password: 'StudySync2024!',
            registeredAt: new Date().toISOString(),
            profileData: {
                academic: {
                    major: 'mathematics',
                    year: '4',
                    courses: 'MATH401, MATH420, STAT301',
                    gpa: '3.8',
                    goals: 'Data science and analytics'
                }
            }
        },
        {
            id: 'demo_user_4',
            name: 'Emma Rodriguez',
            email: 'emma.rodriguez@university.edu',
            password: 'StudySync2024!',
            registeredAt: new Date().toISOString(),
            profileData: {
                academic: {
                    major: 'psychology',
                    year: '3',
                    courses: 'PSY301, PSY315, STAT200',
                    gpa: '3.6',
                    goals: 'Clinical psychology and research'
                }
            }
        },
        {
            id: 'demo_user_5',
            name: 'Alex Kim',
            email: 'alex.kim@university.edu',
            password: 'StudySync2024!',
            registeredAt: new Date().toISOString(),
            profileData: {
                academic: {
                    major: 'business',
                    year: '2',
                    courses: 'BUS201, ECON101, ACCT150',
                    gpa: '3.5',
                    goals: 'Entrepreneurship and finance'
                }
            }
        }
    ],

    // Initialize the database
    init: function() {
        try {
            // Check if users already exist
            let users = this.getAllUsers();
            
            // If no users exist, add demo users
            if (users.length === 0) {
                console.log('Initializing user database with demo users...');
                localStorage.setItem('studysync_users', JSON.stringify(this.DEMO_USERS));
                console.log('Added', this.DEMO_USERS.length, 'demo users to database');
            } else {
                console.log('User database loaded with', users.length, 'users');
            }
            
            return true;
        } catch (error) {
            console.error('Failed to initialize user database:', error);
            return false;
        }
    },

    // Get all users
    getAllUsers: function() {
        try {
            return JSON.parse(localStorage.getItem('studysync_users') || '[]');
        } catch (error) {
            console.error('Error loading users:', error);
            return [];
        }
    },

    // Save users to storage
    saveUsers: function(users) {
        try {
            localStorage.setItem('studysync_users', JSON.stringify(users));
            return true;
        } catch (error) {
            console.error('Error saving users:', error);
            return false;
        }
    },

    // Find user by email
    findUserByEmail: function(email) {
        const users = this.getAllUsers();
        return users.find(user => user.email.toLowerCase() === email.toLowerCase());
    },

    // Find user by ID
    findUserById: function(id) {
        const users = this.getAllUsers();
        return users.find(user => user.id === id);
    },

    // Register new user
    registerUser: function(userData) {
        try {
            // Validate input
            if (!userData.name || !userData.email || !userData.password) {
                throw new Error('Missing required fields: name, email, and password are required');
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userData.email)) {
                throw new Error('Invalid email format');
            }

            // Validate password strength
            if (userData.password.length < 6) {
                throw new Error('Password must be at least 6 characters long');
            }

            // Check if email already exists
            if (this.findUserByEmail(userData.email)) {
                throw new Error('This email is already registered. Please use a different email or try logging in.');
            }

            // Create new user
            const newUser = {
                id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                name: userData.name.trim(),
                email: userData.email.toLowerCase().trim(),
                password: userData.password, // In real app, this would be hashed
                registeredAt: new Date().toISOString(),
                profileData: {}
            };

            // Add to users array
            const users = this.getAllUsers();
            users.push(newUser);
            
            // Save to storage
            if (this.saveUsers(users)) {
                console.log('User registered successfully:', newUser.email);
                return { success: true, user: newUser };
            } else {
                throw new Error('Failed to save user data');
            }
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: error.message };
        }
    },

    // Authenticate user
    loginUser: function(email, password) {
        try {
            // Find user
            const user = this.findUserByEmail(email);
            
            if (!user) {
                // For demo purposes, if user doesn't exist, create them automatically
                console.log('User not found, creating demo user for:', email);
                const result = this.registerUser({
                    name: this.generateNameFromEmail(email),
                    email: email,
                    password: password
                });
                
                if (result.success) {
                    return { success: true, user: result.user };
                } else {
                    throw new Error('User not found and could not create demo user');
                }
            }

            // Password validation: accept either the user's actual password OR the demo password
            const isValidPassword = (user.password === password) || (password === 'StudySync2024!');
            
            if (!isValidPassword) {
                console.log('Password validation failed. User password:', user.password, 'Provided password:', password);
                throw new Error('Incorrect password. Please enter your registered password.');
            }

            console.log('User logged in successfully:', user.email);
            return { success: true, user: user };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    },

    // Generate name from email for demo users
    generateNameFromEmail: function(email) {
        const username = email.split('@')[0];
        return username.replace(/[._]/g, ' ')
                      .split(' ')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                      .join(' ');
    },

    // Update user profile data
    updateUserProfile: function(userId, profileData) {
        try {
            const users = this.getAllUsers();
            const userIndex = users.findIndex(user => user.id === userId);
            
            if (userIndex === -1) {
                throw new Error('User not found');
            }

            // Update profile data
            users[userIndex].profileData = { ...users[userIndex].profileData, ...profileData };
            
            if (this.saveUsers(users)) {
                console.log('Profile updated for user:', userId);
                return { success: true, user: users[userIndex] };
            } else {
                throw new Error('Failed to save profile data');
            }
        } catch (error) {
            console.error('Profile update error:', error);
            return { success: false, error: error.message };
        }
    },

    // Get user statistics
    getStats: function() {
        const users = this.getAllUsers();
        return {
            totalUsers: users.length,
            demoUsers: users.filter(u => u.id.startsWith('demo_')).length,
            registeredUsers: users.filter(u => !u.id.startsWith('demo_')).length,
            usersWithProfiles: users.filter(u => u.profileData && Object.keys(u.profileData).length > 0).length
        };
    },

    // Delete user (for testing purposes)
    deleteUser: function(userId) {
        try {
            const users = this.getAllUsers();
            const filteredUsers = users.filter(user => user.id !== userId);
            
            if (this.saveUsers(filteredUsers)) {
                console.log('User deleted:', userId);
                return { success: true };
            } else {
                throw new Error('Failed to delete user');
            }
        } catch (error) {
            console.error('Delete user error:', error);
            return { success: false, error: error.message };
        }
    },

    // Clear all users (for testing purposes)
    clearAllUsers: function() {
        try {
            localStorage.removeItem('studysync_users');
            console.log('All users cleared from database');
            return { success: true };
        } catch (error) {
            console.error('Clear users error:', error);
            return { success: false, error: error.message };
        }
    },

    // Export users data (for backup)
    exportUsers: function() {
        return {
            users: this.getAllUsers(),
            exportedAt: new Date().toISOString(),
            version: '1.0'
        };
    },

    // Import users data (for restore)
    importUsers: function(data) {
        try {
            if (data && data.users && Array.isArray(data.users)) {
                if (this.saveUsers(data.users)) {
                    console.log('Users imported successfully:', data.users.length, 'users');
                    return { success: true };
                } else {
                    throw new Error('Failed to save imported users');
                }
            } else {
                throw new Error('Invalid import data format');
            }
        } catch (error) {
            console.error('Import users error:', error);
            return { success: false, error: error.message };
        }
    }
};

// Initialize the database when the script loads
UserDatabase.init();

// Make it available globally
window.UserDatabase = UserDatabase; 