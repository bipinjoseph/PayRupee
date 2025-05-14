// API Service for PayRupee Frontend

const API_BASE_URL = 'http://localhost:8000/api';

// Helper function for making API requests
async function apiRequest(endpoint, method = 'GET', data = null, withCredentials = true) {
    const url = `${API_BASE_URL}${endpoint}`;

    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: withCredentials ? 'include' : 'omit'
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || 'Something went wrong');
        }

        return responseData;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Authentication API
const authAPI = {
    // Register a new user
    register: async (userData) => {
        return apiRequest('/auth/register/', 'POST', userData);
    },

    // Login user
    login: async (username, password) => {
        return apiRequest('/auth/login/', 'POST', { username, password });
    },

    // Logout user
    logout: async () => {
        return apiRequest('/auth/logout/', 'POST');
    },

    // Change password
    changePassword: async (oldPassword, newPassword, confirmPassword) => {
        return apiRequest('/profile/change-password/', 'POST', {
            old_password: oldPassword,
            new_password: newPassword,
            confirm_password: confirmPassword
        });
    }
};

// User Profile API
const profileAPI = {
    // Get user profile
    getProfile: async () => {
        return apiRequest('/profile/');
    },

    // Update user profile
    updateProfile: async (profileData) => {
        return apiRequest('/profile/', 'PUT', profileData);
    }
};

// Bank Account API
const accountAPI = {
    // Get all accounts
    getAccounts: async () => {
        return apiRequest('/accounts/');
    },

    // Get account details
    getAccount: async (accountId) => {
        return apiRequest(`/accounts/${accountId}/`);
    },

    // Get account balance
    getBalance: async (accountId) => {
        return apiRequest(`/accounts/${accountId}/balance/`);
    }
};

// Transaction API
const transactionAPI = {
    // Get transaction history
    getTransactions: async (filters = {}) => {
        const queryParams = new URLSearchParams();

        if (filters.accountId) {
            queryParams.append('account_id', filters.accountId);
        }

        if (filters.type) {
            queryParams.append('type', filters.type);
        }

        if (filters.page) {
            queryParams.append('page', filters.page);
        }

        if (filters.pageSize) {
            queryParams.append('page_size', filters.pageSize);
        }

        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
        return apiRequest(`/transactions/${queryString}`);
    },

    // Get transaction details
    getTransaction: async (transactionId) => {
        return apiRequest(`/transactions/${transactionId}/`);
    },

    // Make a deposit
    deposit: async (accountId, amount, description = '') => {
        return apiRequest('/deposit/', 'POST', {
            account_id: accountId,
            amount,
            description
        });
    },

    // Make a withdrawal
    withdraw: async (accountId, amount, description = '') => {
        return apiRequest('/withdraw/', 'POST', {
            account_id: accountId,
            amount,
            description
        });
    },

    // Make a transfer
    transfer: async (fromAccountId, toAccountId, amount, description = '') => {
        return apiRequest('/transfer/', 'POST', {
            from_account_id: fromAccountId,
            to_account_id: toAccountId,
            amount,
            description
        });
    },

    // Get transaction categories
    getCategories: async () => {
        return apiRequest('/categories/');
    },

    // Categorize a transaction
    categorizeTransaction: async (transactionId, categoryId, notes = '') => {
        return apiRequest(`/transactions/${transactionId}/categorize/`, 'POST', {
            category_id: categoryId,
            notes
        });
    }
};

// Export all APIs
const API = {
    auth: authAPI,
    profile: profileAPI,
    account: accountAPI,
    transaction: transactionAPI
};

// For use in browser
window.PayRupeeAPI = API;

// For use with module imports
export default API;
