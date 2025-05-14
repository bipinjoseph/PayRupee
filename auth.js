// Authentication JavaScript for PayRupee

// Import API if using modules
// import API from './api.js';

document.addEventListener('DOMContentLoaded', function() {
    // Check if API is available
    const API = window.PayRupeeAPI;
    // Login Form Validation and Submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Reset error messages
            clearErrors();

            // Get form values
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember')?.checked || false;

            // Validate form
            let isValid = true;

            if (!email) {
                showError('email', 'Email is required');
                isValid = false;
            } else if (!isValidEmail(email)) {
                showError('email', 'Please enter a valid email address');
                isValid = false;
            }

            if (!password) {
                showError('password', 'Password is required');
                isValid = false;
            }

            if (isValid) {
                // Show loading state
                const submitButton = loginForm.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';

                // Use the API for login
                if (API && API.auth) {
                    // Extract username from email (or use email as username)
                    const username = email.split('@')[0]; // Simple approach for demo
                    // Capitalize first letter of username for better display
                    const displayName = username.charAt(0).toUpperCase() + username.slice(1);

                    API.auth.login(username, password)
                        .then(response => {
                            // Make sure the user data has the username
                            const userData = response.user || {};

                            // If the API doesn't provide a name or username, add it
                            if (!userData.name && !userData.username) {
                                userData.name = displayName;
                                userData.username = username;
                            }

                            // Store user data
                            localStorage.setItem('userData', JSON.stringify(userData));

                            // Redirect to dashboard
                            window.location.href = 'dashboard.html';
                        })
                        .catch(error => {
                            // Show error message
                            showError('password', error.message || 'Invalid credentials');
                            submitButton.disabled = false;
                            submitButton.textContent = originalText;
                        });
                } else {
                    // Fallback to mock response for demo
                    setTimeout(() => {
                        // Extract username from email
                        const username = email.split('@')[0];
                        // Capitalize first letter of username for better display
                        const displayName = username.charAt(0).toUpperCase() + username.slice(1);

                        const mockResponse = {
                            success: true,
                            user: {
                                id: '123',
                                name: displayName,
                                username: username,
                                email: email
                            }
                        };

                        if (mockResponse.success) {
                            // Store user data
                            localStorage.setItem('userData', JSON.stringify(mockResponse.user));

                            // Redirect to dashboard
                            window.location.href = 'dashboard.html';
                        } else {
                            // Show error message
                            showError('password', 'Invalid email or password');
                            submitButton.disabled = false;
                            submitButton.textContent = originalText;
                        }
                    }, 1500);
                }
            }
        });
    }

    // Registration Form Validation and Submission
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        // Password strength meter
        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            passwordInput.addEventListener('input', function() {
                updatePasswordStrength(this.value);
            });
        }

        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Reset error messages
            clearErrors();

            // Get form values
            const fullname = document.getElementById('fullname').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const securityQuestion = document.getElementById('security-question').value;
            const securityAnswer = document.getElementById('security-answer').value.trim();
            const terms = document.getElementById('terms').checked;

            // Validate form
            let isValid = true;

            if (!fullname) {
                showError('fullname', 'Full name is required');
                isValid = false;
            }

            if (!email) {
                showError('email', 'Email is required');
                isValid = false;
            } else if (!isValidEmail(email)) {
                showError('email', 'Please enter a valid email address');
                isValid = false;
            }

            if (!password) {
                showError('password', 'Password is required');
                isValid = false;
            } else if (password.length < 8) {
                showError('password', 'Password must be at least 8 characters long');
                isValid = false;
            } else if (getPasswordStrength(password) < 2) {
                showError('password', 'Password is too weak');
                isValid = false;
            }

            if (!confirmPassword) {
                showError('confirm-password', 'Please confirm your password');
                isValid = false;
            } else if (password !== confirmPassword) {
                showError('confirm-password', 'Passwords do not match');
                isValid = false;
            }

            if (!securityQuestion) {
                showError('security-question', 'Please select a security question');
                isValid = false;
            }

            if (!securityAnswer) {
                showError('security-answer', 'Security answer is required');
                isValid = false;
            }

            if (!terms) {
                showError('terms', 'You must agree to the Terms of Service and Privacy Policy');
                isValid = false;
            }

            if (isValid) {
                // Show loading state
                const submitButton = registerForm.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';

                // Use the API for registration
                if (API && API.auth) {
                    // Extract first and last name
                    const nameParts = fullname.split(' ');
                    const firstName = nameParts[0];
                    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

                    // Create username from email
                    const username = email.split('@')[0]; // Simple approach for demo

                    const userData = {
                        username: username,
                        email: email,
                        password: password,
                        password_confirm: confirmPassword,
                        first_name: firstName,
                        last_name: lastName
                    };

                    API.auth.register(userData)
                        .then(response => {
                            // Store user data
                            localStorage.setItem('userData', JSON.stringify(response.user));

                            // Also store security question and answer in profile
                            // This would be handled by the backend in a real implementation

                            // Redirect to success page instead of dashboard
                            window.location.href = 'registration-success.html';
                        })
                        .catch(error => {
                            // Show error message
                            if (error.message.includes('username')) {
                                showError('fullname', error.message || 'Registration failed');
                            } else if (error.message.includes('email')) {
                                showError('email', error.message || 'This email is already registered');
                            } else if (error.message.includes('password')) {
                                showError('password', error.message || 'Password is not valid');
                            } else {
                                showError('email', error.message || 'Registration failed');
                            }
                            submitButton.disabled = false;
                            submitButton.textContent = originalText;
                        });
                } else {
                    // Fallback to mock response for demo
                    setTimeout(() => {
                        const mockResponse = {
                            success: true,
                            user: {
                                id: '123',
                                name: fullname,
                                email: email
                            }
                        };

                        if (mockResponse.success) {
                            // Store user data
                            localStorage.setItem('userData', JSON.stringify(mockResponse.user));

                            // Redirect to success page instead of dashboard
                            window.location.href = 'registration-success.html';
                        } else {
                            // Show error message
                            showError('email', 'This email is already registered');
                            submitButton.disabled = false;
                            submitButton.textContent = originalText;
                        }
                    }, 2000);
                }
            }
        });
    }

    // Forgot Password Form
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Reset error messages
            clearErrors();

            // Get form values
            const email = document.getElementById('email').value.trim();

            // Validate form
            let isValid = true;

            if (!email) {
                showError('email', 'Email is required');
                isValid = false;
            } else if (!isValidEmail(email)) {
                showError('email', 'Please enter a valid email address');
                isValid = false;
            }

            if (isValid) {
                // Show loading state
                const submitButton = forgotPasswordForm.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

                // Simulate API call
                setTimeout(() => {
                    // This would be replaced with an actual API call
                    const mockResponse = {
                        success: true
                    };

                    if (mockResponse.success) {
                        // Show success message
                        forgotPasswordForm.innerHTML = `
                            <div class="success-message">
                                <i class="fas fa-check-circle"></i>
                                <h3>Reset Link Sent</h3>
                                <p>We've sent a password reset link to <strong>${email}</strong>. Please check your email and follow the instructions to reset your password.</p>
                                <a href="login.html" class="btn btn-primary btn-block mt-4">Back to Login</a>
                            </div>
                        `;
                    } else {
                        // Show error message
                        showError('email', 'Email not found in our records');
                        submitButton.disabled = false;
                        submitButton.textContent = originalText;
                    }
                }, 1500);
            }
        });
    }

    // Check if user is already logged in
    function checkAuthStatus() {
        const authToken = localStorage.getItem('authToken');
        const currentPage = window.location.pathname.split('/').pop();

        // If user is logged in and trying to access login or register page, redirect to dashboard
        if (authToken && (currentPage === 'login.html' || currentPage === 'register.html' || currentPage === 'forgot-password.html')) {
            window.location.href = 'dashboard.html';
        }

        // If user is not logged in and trying to access protected pages, redirect to login
        if (!authToken && currentPage === 'dashboard.html') {
            window.location.href = 'login.html';
        }
    }

    // Call checkAuthStatus on page load
    checkAuthStatus();
});

// Helper Functions

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show error message for a field
function showError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    if (errorElement) {
        errorElement.textContent = message;
    }

    const inputElement = document.getElementById(fieldId);
    if (inputElement) {
        inputElement.classList.add('error');
    }
}

// Clear all error messages
function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
    });

    const inputElements = document.querySelectorAll('input, select');
    inputElements.forEach(element => {
        element.classList.remove('error');
    });
}

// Calculate password strength (0-4)
function getPasswordStrength(password) {
    let strength = 0;

    // Length check
    if (password.length >= 8) strength += 1;

    // Contains lowercase letters
    if (/[a-z]/.test(password)) strength += 1;

    // Contains uppercase letters
    if (/[A-Z]/.test(password)) strength += 1;

    // Contains numbers
    if (/[0-9]/.test(password)) strength += 1;

    // Contains special characters
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;

    return Math.min(4, strength);
}

// Update password strength meter
function updatePasswordStrength(password) {
    const strength = getPasswordStrength(password);
    const strengthMeter = document.querySelector('.strength-meter-fill');
    const strengthText = document.getElementById('strength-text');

    if (strengthMeter && strengthText) {
        strengthMeter.setAttribute('data-strength', strength);

        switch (strength) {
            case 0:
                strengthText.textContent = 'Weak';
                break;
            case 1:
                strengthText.textContent = 'Weak';
                break;
            case 2:
                strengthText.textContent = 'Medium';
                break;
            case 3:
                strengthText.textContent = 'Strong';
                break;
            case 4:
                strengthText.textContent = 'Very Strong';
                break;
        }
    }
}
