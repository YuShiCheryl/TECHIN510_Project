// AuthService implementation
const AuthService = {
    // Register a new user
    register: async function(userData) {
        try {
            // For demo purposes, we'll simulate a successful registration
            // In a real application, this would make an API call to your backend
            console.log('Registering user:', userData);
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Store user data in localStorage for demo purposes
            const userToStore = {
                email: userData.email,
                name: userData.name,
                id: 'user_' + Date.now()
            };
            
            localStorage.setItem('registeredUser', JSON.stringify(userToStore));
            
            // Automatically log in the user after registration
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify(userToStore));
            
            return { success: true };
        } catch (error) {
            console.error('Registration error:', error);
            throw new Error('Registration failed. Please try again.');
        }
    },

    // Login user
    login: async function(email, password) {
        try {
            // For demo purposes, we'll simulate a successful login
            // In a real application, this would make an API call to your backend
            console.log('Logging in user:', email);
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // For demo purposes, accept any email/password combination
            // and create a user account automatically if it doesn't exist
            let registeredUser = JSON.parse(localStorage.getItem('registeredUser') || 'null');
            
            if (!registeredUser || registeredUser.email !== email) {
                // Create a new user automatically for demo purposes
                registeredUser = {
                    email: email,
                    name: email.split('@')[0], // Use email prefix as name
                    id: 'user_' + Date.now()
                };
                localStorage.setItem('registeredUser', JSON.stringify(registeredUser));
                console.log('Auto-created user for demo:', registeredUser);
            }
            
            // Store login state
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify(registeredUser));
            
            return registeredUser;
        } catch (error) {
            console.error('Login error:', error);
            throw new Error('Login failed. Please try again.');
        }
    },

    // Demo login function for testing
    createDemoUser: function() {
        const demoUser = {
            email: 'demo@studysync.com',
            name: 'Demo User',
            id: 'demo_user'
        };
        
        localStorage.setItem('registeredUser', JSON.stringify(demoUser));
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(demoUser));
        
        return demoUser;
    },

    // Logout user
    logout: function() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    },

    // Check if user is logged in
    isLoggedIn: function() {
        return localStorage.getItem('isLoggedIn') === 'true';
    },

    // Get current user - with fallback to demo user for testing
    getCurrentUser: function() {
        const user = localStorage.getItem('currentUser');
        if (user) {
            return JSON.parse(user);
        }
        
        // For demo purposes, if no user is logged in, create a demo user
        // This prevents the redirect to login page during development/testing
        if (!this.isLoggedIn()) {
            console.log('No user found, creating demo user for testing...');
            return this.createDemoUser();
        }
        
        return null;
    },

    // Initialize demo user if needed (for development)
    initDemo: function() {
        if (!this.isLoggedIn()) {
            this.createDemoUser();
        }
    }
}; 