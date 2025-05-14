/**
 * PayRupee Transactions Module
 * Handles all transaction-related functionality including deposit, withdraw, and transfer
 */

// Transaction types
const TRANSACTION_TYPES = {
    DEPOSIT: 'deposit',
    WITHDRAWAL: 'withdrawal',
    TRANSFER_OUT: 'transfer_out',
    TRANSFER_IN: 'transfer_in'
};

// Transaction statuses
const TRANSACTION_STATUS = {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed',
    CANCELLED: 'cancelled'
};

/**
 * Transaction class to handle all transaction operations
 */
class TransactionManager {
    constructor() {
        // Initialize transactions from localStorage or create empty array
        this.userData = JSON.parse(localStorage.getItem('userData') || '{}');
        if (!this.userData.transactions) {
            this.userData.transactions = [];
        }
    }

    /**
     * Save transaction to localStorage and update user data
     * @param {Object} transaction - Transaction object
     * @returns {Object} - The saved transaction with ID
     */
    saveTransaction(transaction) {
        // Generate transaction ID
        transaction.id = this.generateTransactionId();
        
        // Set default values if not provided
        transaction.date = transaction.date || new Date();
        transaction.status = transaction.status || TRANSACTION_STATUS.COMPLETED;
        
        // Add transaction to array
        this.userData.transactions.unshift(transaction); // Add to beginning of array
        
        // Update user data in localStorage
        localStorage.setItem('userData', JSON.stringify(this.userData));
        
        // Mark user as having transactions
        this.userData.hasTransactions = true;
        localStorage.setItem('userData', JSON.stringify(this.userData));
        
        // Return the saved transaction
        return transaction;
    }

    /**
     * Generate a unique transaction ID
     * @returns {string} - Unique transaction ID
     */
    generateTransactionId() {
        return 'TRX-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    }

    /**
     * Process a deposit transaction
     * @param {number} amount - Amount to deposit
     * @param {string} description - Transaction description
     * @returns {Object} - The processed transaction
     */
    deposit(amount, description = 'Deposit') {
        // Validate amount
        if (!amount || amount <= 0) {
            throw new Error('Invalid deposit amount');
        }
        
        // Create transaction object
        const transaction = {
            type: TRANSACTION_TYPES.DEPOSIT,
            amount: amount,
            description: description,
            date: new Date(),
            status: TRANSACTION_STATUS.COMPLETED
        };
        
        // Update user balance
        this.userData.balance = (this.userData.balance || 0) + amount;
        
        // Save transaction
        const savedTransaction = this.saveTransaction(transaction);
        
        // Return the transaction
        return savedTransaction;
    }

    /**
     * Process a withdrawal transaction
     * @param {number} amount - Amount to withdraw
     * @param {string} description - Transaction description
     * @returns {Object} - The processed transaction
     */
    withdraw(amount, description = 'Withdrawal') {
        // Validate amount
        if (!amount || amount <= 0) {
            throw new Error('Invalid withdrawal amount');
        }
        
        // Check if user has sufficient balance
        const currentBalance = this.userData.balance || 0;
        if (currentBalance < amount) {
            throw new Error('Insufficient balance');
        }
        
        // Create transaction object
        const transaction = {
            type: TRANSACTION_TYPES.WITHDRAWAL,
            amount: -amount, // Negative amount for withdrawal
            description: description,
            date: new Date(),
            status: TRANSACTION_STATUS.COMPLETED
        };
        
        // Update user balance
        this.userData.balance = currentBalance - amount;
        
        // Save transaction
        const savedTransaction = this.saveTransaction(transaction);
        
        // Return the transaction
        return savedTransaction;
    }

    /**
     * Process a transfer transaction
     * @param {string} toAccount - Recipient account number
     * @param {number} amount - Amount to transfer
     * @param {string} description - Transaction description
     * @returns {Object} - The processed transaction
     */
    transfer(toAccount, amount, description = 'Transfer') {
        // Validate amount
        if (!amount || amount <= 0) {
            throw new Error('Invalid transfer amount');
        }
        
        // Validate recipient account
        if (!toAccount) {
            throw new Error('Invalid recipient account');
        }
        
        // Check if user has sufficient balance
        const currentBalance = this.userData.balance || 0;
        if (currentBalance < amount) {
            throw new Error('Insufficient balance');
        }
        
        // Create outgoing transaction object
        const outgoingTransaction = {
            type: TRANSACTION_TYPES.TRANSFER_OUT,
            amount: -amount, // Negative amount for outgoing transfer
            description: description,
            date: new Date(),
            status: TRANSACTION_STATUS.COMPLETED,
            recipientAccount: toAccount
        };
        
        // Update user balance
        this.userData.balance = currentBalance - amount;
        
        // Save outgoing transaction
        const savedTransaction = this.saveTransaction(outgoingTransaction);
        
        // Return the transaction
        return savedTransaction;
    }

    /**
     * Get all transactions for the user
     * @param {Object} filters - Optional filters for transactions
     * @returns {Array} - Array of transactions
     */
    getTransactions(filters = {}) {
        let transactions = this.userData.transactions || [];
        
        // Apply filters if provided
        if (filters.type) {
            transactions = transactions.filter(t => t.type === filters.type);
        }
        
        if (filters.startDate) {
            const startDate = new Date(filters.startDate);
            transactions = transactions.filter(t => new Date(t.date) >= startDate);
        }
        
        if (filters.endDate) {
            const endDate = new Date(filters.endDate);
            transactions = transactions.filter(t => new Date(t.date) <= endDate);
        }
        
        // Return filtered transactions
        return transactions;
    }

    /**
     * Get recent transactions
     * @param {number} limit - Maximum number of transactions to return
     * @returns {Array} - Array of recent transactions
     */
    getRecentTransactions(limit = 5) {
        const transactions = this.userData.transactions || [];
        return transactions.slice(0, limit);
    }
}

// Create global instance of TransactionManager
window.transactionManager = new TransactionManager();
