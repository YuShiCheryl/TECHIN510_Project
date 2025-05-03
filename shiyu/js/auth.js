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
            localStorage.setItem('registeredUser', JSON.stringify({
                email: userData.email,
                name: userData.name
            }));
            
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
            
            // Check if user exists in localStorage (for demo purposes)
            const registeredUser = JSON.parse(localStorage.getItem('registeredUser'));
            
            if (registeredUser && registeredUser.email === email) {
                // Store login state
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', JSON.stringify(registeredUser));
                return registeredUser;
            } else {
                throw new Error('Invalid email or password');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw new Error('Login failed. Please check your credentials.');
        }
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

    // Get current user
    getCurrentUser: function() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }
}; 