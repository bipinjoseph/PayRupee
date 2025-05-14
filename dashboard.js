// Dashboard JavaScript for PayRupee

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard with placeholder data
    loadPlaceholderData();

    // Create personalized greeting
    createPersonalizedGreeting();

    // Initialize dashboard components
    initializeNotifications();
    initializeCharts();
    setupEventListeners();

    // Load recent transactions
    loadRecentTransactions();

    // Initialize sidebar scroll behavior
    initializeSidebarScrollBehavior();
});

// Load placeholder data for the dashboard
function loadPlaceholderData() {
    // Get or create user data
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');

    // Set default values if not present
    if (!userData.name) userData.name = 'User';
    if (userData.balance === undefined) userData.balance = 0;
    if (!userData.accountNumber) userData.accountNumber = 'PR' + Math.floor(1000000000 + Math.random() * 9000000000);
    if (!userData.openDate) userData.openDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(); // 90 days ago
    if (!userData.lastLogin) userData.lastLogin = new Date().toISOString();

    // Save updated user data
    localStorage.setItem('userData', JSON.stringify(userData));

    // Set user name
    const userNameElements = document.querySelectorAll('.user-name');
    const userFullnameElements = document.querySelectorAll('.user-fullname');

    // Update all user name elements in the UI
    userNameElements.forEach(element => {
        element.textContent = userData.name;
    });

    userFullnameElements.forEach(element => {
        element.textContent = userData.name;
    });

    // Set balance amount in the main balance card
    const balanceAmount = document.querySelector('.balance-amount .amount');
    if (balanceAmount) {
        balanceAmount.textContent = userData.balance.toFixed(2);
        // Store the actual balance value as a data attribute for hiding/showing
        balanceAmount.setAttribute('data-balance', userData.balance.toFixed(2));
    }

    // Update balance change message for new account
    const balanceChange = document.querySelector('.balance-change');
    if (balanceChange) {
        balanceChange.innerHTML = '<i class="fas fa-info-circle"></i><span>Your account is ready. Use the Quick Actions below to make a deposit.</span>';
        balanceChange.classList.remove('positive', 'negative');
    }

    // Set account number in dashboard
    const accountNumber = userData.accountNumber || 'PR' + Math.floor(1000000000 + Math.random() * 9000000000);
    const displayAccountNumber = `Account: **** ${accountNumber.slice(-4)}`;

    const dashboardAccountNumber = document.getElementById('dashboard-account-number');
    if (dashboardAccountNumber) {
        dashboardAccountNumber.textContent = displayAccountNumber;
    }

    // Update account type and number in the balance card
    const balanceTitle = document.querySelector('.balance-header h2');
    if (balanceTitle) {
        balanceTitle.textContent = 'Savings Account';
    }

    // Add account number below the balance
    // Use the accountNumber and displayAccountNumber variables already defined above

    const accountNumberElement = document.querySelector('.account-number-display');
    if (accountNumberElement) {
        accountNumberElement.textContent = displayAccountNumber;
    } else {
        // Create account number element if it doesn't exist
        const balanceAmount = document.querySelector('.balance-amount');
        if (balanceAmount) {
            const accountNumberDiv = document.createElement('div');
            accountNumberDiv.className = 'account-number-display';
            accountNumberDiv.textContent = displayAccountNumber;
            accountNumberDiv.style.fontSize = '0.9rem';
            accountNumberDiv.style.color = 'var(--gray-600)';
            accountNumberDiv.style.marginTop = '-10px';
            accountNumberDiv.style.marginBottom = '15px';

            // Insert after balance amount
            balanceAmount.parentNode.insertBefore(accountNumberDiv, balanceAmount.nextSibling);
        }
    }

    // Load placeholder accounts
    loadPlaceholderAccounts();

    // Load placeholder transactions
    loadPlaceholderTransactions();
}

// Load placeholder account (single savings account)
function loadPlaceholderAccounts() {
    // We don't need to use the accounts list anymore since we're showing only one account
    // in the balance card section
}

// Load placeholder transactions
function loadPlaceholderTransactions() {
    const transactionsTable = document.querySelector('.transactions-table tbody');
    if (!transactionsTable) return;

    // Clear loading message
    transactionsTable.innerHTML = '';

    // Add placeholder transactions
    const transactions = [
        { id: 1, created_at: '2023-05-01T10:30:00', description: 'Salary Deposit', transaction_type: 'deposit', amount: 3000, status: 'completed' },
        { id: 2, created_at: '2023-05-02T14:20:00', description: 'Grocery Shopping', transaction_type: 'withdrawal', amount: 150, status: 'completed' },
        { id: 3, created_at: '2023-05-03T09:15:00', description: 'Utility Bill Payment', transaction_type: 'withdrawal', amount: 200, status: 'completed' },
        { id: 4, created_at: '2023-05-04T16:45:00', description: 'Online Purchase', transaction_type: 'withdrawal', amount: 75, status: 'completed' },
        { id: 5, created_at: '2023-05-05T11:30:00', description: 'Transfer to Savings', transaction_type: 'transfer', amount: 500, status: 'completed' }
    ];

    transactions.forEach(transaction => {
        const date = new Date(transaction.created_at);
        const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="transaction-date">
                    <span class="date">${formattedDate}</span>
                    <span class="time">${formattedTime}</span>
                </div>
            </td>
            <td>
                <div class="transaction-description">
                    <span class="description">${transaction.description}</span>
                    <span class="location">Online Banking</span>
                </div>
            </td>
            <td>
                <span class="transaction-category">${getTransactionCategory(transaction)}</span>
            </td>
            <td>
                <span class="transaction-amount ${transaction.transaction_type === 'deposit' ? 'income' : 'expense'}">
                    ${transaction.transaction_type === 'deposit' ? '+' : '-'}₹${transaction.amount.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}
                </span>
            </td>
            <td>
                <span class="transaction-status ${transaction.status}">${transaction.status}</span>
            </td>
            <td>
                <div class="transaction-actions">
                    <button class="action-btn" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn" title="Download Receipt">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            </td>
        `;

        transactionsTable.appendChild(row);
    });
}

// Load account data from API
function loadAccountData(API) {
    // Show loading state
    const accountsList = document.querySelector('.accounts-list');
    const balanceAmount = document.querySelector('.balance-amount .amount');

    if (accountsList) {
        accountsList.innerHTML = '<div class="loading">Loading accounts...</div>';
    }

    if (balanceAmount) {
        balanceAmount.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    }

    // Get accounts from API
    API.account.getAccounts()
        .then(accounts => {
            // Update total balance
            if (balanceAmount) {
                let totalBalance = 0;
                accounts.forEach(account => {
                    totalBalance += parseFloat(account.balance);
                });

                balanceAmount.textContent = totalBalance.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });

                // Update balance change message based on account status
                const balanceChange = document.querySelector('.balance-change');
                if (balanceChange) {
                    if (totalBalance > 0) {
                        balanceChange.innerHTML = '<i class="fas fa-check-circle"></i><span>Your account is active</span>';
                        balanceChange.classList.add('positive');
                        balanceChange.classList.remove('negative');
                    } else {
                        balanceChange.innerHTML = '<span>Make a deposit to get started!</span>';
                        balanceChange.classList.remove('positive', 'negative');
                    }
                }
            }

            // Update accounts list
            if (accountsList) {
                if (accounts.length === 0) {
                    accountsList.innerHTML = '<div class="no-accounts">No accounts found</div>';
                } else {
                    accountsList.innerHTML = '';

                    accounts.forEach(account => {
                        const accountCard = document.createElement('div');
                        accountCard.className = 'account-card';
                        accountCard.innerHTML = `
                            <div class="account-info">
                                <div class="account-name">
                                    <h3>${getAccountTypeName(account.account_type)}</h3>
                                    <span class="account-number">**** ${account.account_number.slice(-4)}</span>
                                </div>
                                <div class="account-balance">
                                    <span class="amount">₹${parseFloat(account.balance).toLocaleString('en-US', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}</span>
                                </div>
                            </div>
                            <div class="account-actions">
                                <button class="btn btn-sm btn-outline" onclick="location.href='deposit.html?account=${account.id}'">Deposit</button>
                                <button class="btn btn-sm btn-outline" onclick="location.href='withdraw.html?account=${account.id}'">Withdraw</button>
                            </div>
                        `;

                        accountsList.appendChild(accountCard);
                    });
                }
            }

            // Load transaction history
            loadTransactionHistory(API, accounts[0]?.id);
        })
        .catch(error => {
            console.error('Error loading accounts:', error);

            if (balanceAmount) {
                balanceAmount.textContent = '0.00';

                // Update balance change message for new users
                const balanceChange = document.querySelector('.balance-change');
                if (balanceChange) {
                    balanceChange.innerHTML = '<span>Welcome to your new account!</span>';
                    balanceChange.classList.remove('positive', 'negative');
                }
            }

            if (accountsList) {
                accountsList.innerHTML = '<div class="error">Error loading accounts</div>';
            }

            showToast('Error loading account data', 'error');
        });
}

// Helper function to get account type display name
function getAccountTypeName(accountType) {
    switch (accountType) {
        case 'checking':
            return 'Checking Account';
        case 'savings':
            return 'Savings Account';
        case 'investment':
            return 'Investment Account';
        default:
            return accountType;
    }
}

// Load transaction history
function loadTransactionHistory(API, accountId) {
    const transactionsTable = document.querySelector('.transactions-table tbody');

    if (!transactionsTable) return;

    // Show loading state
    transactionsTable.innerHTML = `
        <tr>
            <td colspan="6" class="text-center">
                <i class="fas fa-spinner fa-spin"></i> Loading transactions...
            </td>
        </tr>
    `;

    // Get transactions from API
    API.transaction.getTransactions({ accountId, page: 1, pageSize: 5 })
        .then(response => {
            const transactions = response.results || [];

            if (transactions.length === 0) {
                transactionsTable.innerHTML = `
                    <tr>
                        <td colspan="6" class="text-center">
                            No transactions found
                        </td>
                    </tr>
                `;
                return;
            }

            // Clear table
            transactionsTable.innerHTML = '';

            // Add transactions to table
            transactions.forEach(transaction => {
                const date = new Date(transaction.created_at);
                const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>
                        <div class="transaction-date">
                            <span class="date">${formattedDate}</span>
                            <span class="time">${formattedTime}</span>
                        </div>
                    </td>
                    <td>
                        <div class="transaction-description">
                            <span class="description">${transaction.description || getDefaultDescription(transaction)}</span>
                            <span class="location">${getTransactionLocation(transaction)}</span>
                        </div>
                    </td>
                    <td>
                        <span class="transaction-category">${getTransactionCategory(transaction)}</span>
                    </td>
                    <td>
                        <span class="transaction-amount ${transaction.transaction_type === 'deposit' ? 'income' : 'expense'}">
                            ${transaction.transaction_type === 'deposit' ? '+' : '-'}₹${parseFloat(transaction.amount).toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}
                        </span>
                    </td>
                    <td>
                        <span class="transaction-status ${transaction.status}">${transaction.status}</span>
                    </td>
                    <td>
                        <div class="transaction-actions">
                            <button class="action-btn" title="View Details" data-transaction-id="${transaction.id}">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn" title="Download Receipt" data-transaction-id="${transaction.id}">
                                <i class="fas fa-download"></i>
                            </button>
                        </div>
                    </td>
                `;

                transactionsTable.appendChild(row);
            });

            // Add event listeners to action buttons
            const actionButtons = transactionsTable.querySelectorAll('.action-btn');
            actionButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const action = this.getAttribute('title');
                    const transactionId = this.getAttribute('data-transaction-id');
                    const transactionRow = this.closest('tr');

                    if (action === 'View Details') {
                        // Show transaction details modal
                        showTransactionDetails(transactionRow, transactionId, API);
                    } else if (action === 'Download Receipt') {
                        // Simulate receipt download
                        const description = transactionRow.querySelector('.description').textContent;
                        const date = transactionRow.querySelector('.date').textContent;
                        showToast(`Downloading receipt for ${description} on ${date}`, 'info');
                    }
                });
            });
        })
        .catch(error => {
            console.error('Error loading transactions:', error);

            transactionsTable.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">
                        Error loading transactions
                    </td>
                </tr>
            `;

            showToast('Error loading transaction history', 'error');
        });
}

// Helper function to get default description for a transaction
function getDefaultDescription(transaction) {
    switch (transaction.transaction_type) {
        case 'deposit':
            return 'Deposit';
        case 'withdrawal':
            return 'Withdrawal';
        case 'transfer':
            return 'Transfer';
        default:
            return 'Transaction';
    }
}

// Helper function to get transaction location
function getTransactionLocation(transaction) {
    if (transaction.transaction_type === 'transfer' && transaction.recipient_account) {
        return `To Account: **** ${transaction.recipient_account.account_number.slice(-4)}`;
    }

    return 'Online Banking';
}

// Helper function to get transaction category
function getTransactionCategory(transaction) {
    switch (transaction.transaction_type) {
        case 'deposit':
            return 'Income';
        case 'withdrawal':
            return 'Expense';
        case 'transfer':
            return 'Transfer';
        default:
            return 'Other';
    }
}

// Initialize notification functionality
function initializeNotifications() {
    // Get the mark all read button
    const markAllReadBtn = document.querySelector('.mark-all-read');

    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function() {
            const unreadNotifications = document.querySelectorAll('.notification-item.unread');
            unreadNotifications.forEach(notification => {
                notification.classList.remove('unread');
            });

            // Update notification badge
            const badge = document.querySelector('.notification-badge');
            if (badge) {
                badge.textContent = '0';
                badge.style.display = 'none';
            }
        });
    }
}

// Initialize dashboard charts
function initializeCharts() {
    // Get user data to check if this is a new user
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    // Always treat as new user unless explicitly marked as having transactions
    const isNewUser = !userData.hasTransactions;

    // Default data for new users - all zeros
    const newUserData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        income: [0, 0, 0, 0, 0, 0, 0],
        expenses: [0, 0, 0, 0, 0, 0, 0]
    };

    // Sample data for existing users
    const existingUserData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        income: [3500, 3500, 4200, 3800, 3500, 3500, 4000],
        expenses: [2100, 2400, 2200, 2800, 2600, 2300, 2500]
    };

    // Choose which data to use
    const chartData = isNewUser ? newUserData : existingUserData;

    // Spending Chart
    const spendingChartCtx = document.getElementById('spending-chart');
    if (spendingChartCtx) {
        const spendingChart = new Chart(spendingChartCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [
                    {
                        label: 'Income',
                        data: chartData.income,
                        backgroundColor: 'rgba(46, 204, 113, 0.2)',
                        borderColor: 'rgba(46, 204, 113, 1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Expenses',
                        data: chartData.expenses,
                        backgroundColor: 'rgba(231, 76, 60, 0.2)',
                        borderColor: 'rgba(231, 76, 60, 1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₹' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });

        // Store chart instance for later updates
        window.spendingChart = spendingChart;
    }

    // Categories Chart
    const categoriesChartCtx = document.getElementById('categories-chart');
    if (categoriesChartCtx) {
        // For new users, show empty chart or default distribution
        const categoryData = isNewUser ?
            [20, 20, 20, 20, 20] : // Equal distribution for new users
            [35, 25, 15, 10, 15];  // Sample data for existing users

        const categoriesChart = new Chart(categoriesChartCtx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Housing', 'Food', 'Transportation', 'Entertainment', 'Other'],
                datasets: [{
                    data: categoryData,
                    backgroundColor: [
                        '#4CAF50',
                        '#2196F3',
                        '#FFC107',
                        '#9C27B0',
                        '#F44336'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                },
                cutout: '70%'
            }
        });

        // Store chart instance for later updates
        window.categoriesChart = categoriesChart;
    }
}

// Set up event listeners for dashboard interactions
function setupEventListeners() {
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();

            // Redirect to login page
            window.location.href = 'login.html';
        });
    }

    // Chart period buttons
    const periodButtons = document.querySelectorAll('.period-btn');
    if (periodButtons.length > 0) {
        periodButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                periodButtons.forEach(btn => btn.classList.remove('active'));

                // Add active class to clicked button
                this.classList.add('active');

                // Update chart data based on selected period
                updateChartData(this.dataset.period);
            });
        });
    }

    // Transaction action buttons
    const actionButtons = document.querySelectorAll('.transaction-actions .action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('title');
            const transactionRow = this.closest('tr');

            if (action === 'View Details') {
                showTransactionDetails(transactionRow);
            } else if (action === 'Download Receipt') {
                const description = transactionRow.querySelector('.description').textContent;
                const date = transactionRow.querySelector('.date').textContent;
                showToast(`Downloading receipt for ${description} on ${date}`, 'info');
            }
        });
    });

    // Quick action buttons
    const depositBtn = document.querySelector('.action-card[href="deposit.html"]');
    const withdrawBtn = document.querySelector('.action-card[href="withdraw.html"]');
    const transferBtn = document.querySelector('.action-card[href="transfer.html"]');

    if (depositBtn) {
        depositBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'deposit.html';
        });
    }

    if (withdrawBtn) {
        withdrawBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'withdraw.html';
        });
    }

    if (transferBtn) {
        transferBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'transfer.html';
        });
    }

    // Deposit and withdraw buttons have been removed from the balance card

    // Balance refresh button
    const refreshBalance = document.querySelector('.refresh-balance');
    if (refreshBalance) {
        refreshBalance.addEventListener('click', function() {
            const icon = this.querySelector('i');
            icon.classList.add('fa-spin');

            // Simulate API call delay
            setTimeout(() => {
                icon.classList.remove('fa-spin');
                // Always show zero balance for new account
                showToast('Balance updated successfully', 'success');
            }, 1000);
        });
    }

    // Hide/Show balance
    const hideBalance = document.querySelector('.hide-balance');
    if (hideBalance) {
        hideBalance.addEventListener('click', function() {
            const balanceAmount = document.querySelector('.balance-amount .amount');
            const icon = this.querySelector('i');

            if (balanceAmount.textContent.includes('*')) {
                // Show the balance - always show zero
                balanceAmount.textContent = '0.00';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
                this.setAttribute('title', 'Hide Balance');
            } else {
                // Hide the balance
                balanceAmount.textContent = '**,***.**';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
                this.setAttribute('title', 'Show Balance');
            }
        });
    }

    // This is a duplicate logout button handler that can be removed
    // The main one is already defined at the top of setupEventListeners

    // These are duplicate quick action button handlers that can be removed
    // The main ones are already defined at the top of setupEventListeners
}

// Update chart data based on selected period
function updateChartData(period) {
    if (!window.spendingChart) return;

    // Get user data to check if this is a new user
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const isNewUser = !userData.hasTransactions;

    let labels, incomeData, expenseData;

    // For new users, show empty data
    if (isNewUser) {
        switch(period) {
            case 'week':
                labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                incomeData = [0, 0, 0, 0, 0, 0, 0];
                expenseData = [0, 0, 0, 0, 0, 0, 0];
                break;
            case 'month':
                labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
                incomeData = [0, 0, 0, 0];
                expenseData = [0, 0, 0, 0];
                break;
            case 'year':
                labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                incomeData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                expenseData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                break;
            default:
                return;
        }
    } else {
        // For existing users, show sample data
        switch(period) {
            case 'week':
                labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                incomeData = [500, 0, 0, 0, 3500, 200, 0];
                expenseData = [150, 320, 240, 180, 90, 450, 280];
                break;
            case 'month':
                labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
                incomeData = [700, 3500, 200, 0];
                expenseData = [890, 760, 920, 830];
                break;
            case 'year':
                labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                incomeData = [3500, 3500, 4200, 3800, 3500, 3500, 4000, 3800, 3500, 3800, 3500, 5000];
                expenseData = [2100, 2400, 2200, 2800, 2600, 2300, 2500, 2700, 2400, 2600, 3100, 3800];
                break;
            default:
                return;
        }
    }

    window.spendingChart.data.labels = labels;
    window.spendingChart.data.datasets[0].data = incomeData;
    window.spendingChart.data.datasets[1].data = expenseData;
    window.spendingChart.update();
}

// Show transaction details in a modal
function showTransactionDetails(transactionRow) {
    // Extract transaction data
    const date = transactionRow.querySelector('.date').textContent;
    const time = transactionRow.querySelector('.time').textContent;
    const description = transactionRow.querySelector('.description').textContent;
    const location = transactionRow.querySelector('.location').textContent;
    const category = transactionRow.querySelector('.transaction-category').textContent;
    const amount = transactionRow.querySelector('.transaction-amount').textContent;
    const status = transactionRow.querySelector('.transaction-status').textContent;

    // Create modal HTML
    const modalHTML = `
        <div class="modal-overlay">
            <div class="modal-container">
                <div class="modal-header">
                    <h3>Transaction Details</h3>
                    <button class="modal-close"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <div class="transaction-detail">
                        <span class="detail-label">Date:</span>
                        <span class="detail-value">${date} at ${time}</span>
                    </div>
                    <div class="transaction-detail">
                        <span class="detail-label">Description:</span>
                        <span class="detail-value">${description}</span>
                    </div>
                    <div class="transaction-detail">
                        <span class="detail-label">Location:</span>
                        <span class="detail-value">${location}</span>
                    </div>
                    <div class="transaction-detail">
                        <span class="detail-label">Category:</span>
                        <span class="detail-value">${category}</span>
                    </div>
                    <div class="transaction-detail">
                        <span class="detail-label">Amount:</span>
                        <span class="detail-value ${amount.includes('-') ? 'expense' : 'income'}">${amount}</span>
                    </div>
                    <div class="transaction-detail">
                        <span class="detail-label">Status:</span>
                        <span class="detail-value">${status}</span>
                    </div>
                    <div class="transaction-detail">
                        <span class="detail-label">Transaction ID:</span>
                        <span class="detail-value">TRX-${Math.random().toString(36).substring(2, 11).toUpperCase()}</span>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary modal-close">Close</button>
                    <button class="btn btn-primary download-receipt">Download Receipt</button>
                </div>
            </div>
        </div>
    `;

    // Add modal to the DOM
    const modalElement = document.createElement('div');
    modalElement.innerHTML = modalHTML;
    document.body.appendChild(modalElement);

    // Add event listeners for modal actions
    const closeButtons = document.querySelectorAll('.modal-close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            document.body.removeChild(modalElement);
        });
    });

    const downloadButton = document.querySelector('.download-receipt');
    if (downloadButton) {
        downloadButton.addEventListener('click', function() {
            showToast(`Downloading receipt for ${description} on ${date}`, 'info');
        });
    }

    // Close modal when clicking outside
    const modalOverlay = document.querySelector('.modal-overlay');
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            document.body.removeChild(modalElement);
        }
    });
}

// Show toast notification
function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    // Add icon based on type
    let icon;
    switch (type) {
        case 'success':
            icon = 'fa-check-circle';
            break;
        case 'error':
            icon = 'fa-exclamation-circle';
            break;
        case 'warning':
            icon = 'fa-exclamation-triangle';
            break;
        default:
            icon = 'fa-info-circle';
    }

    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        </div>
        <button class="toast-close"><i class="fas fa-times"></i></button>
    `;

    // Add to DOM
    const toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        const newToastContainer = document.createElement('div');
        newToastContainer.className = 'toast-container';
        document.body.appendChild(newToastContainer);
        newToastContainer.appendChild(toast);
    } else {
        toastContainer.appendChild(toast);
    }

    // Add close button functionality
    const closeButton = toast.querySelector('.toast-close');
    closeButton.addEventListener('click', function() {
        toast.remove();
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.classList.add('toast-fade-out');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Create personalized greeting based on user data and time of day
function createPersonalizedGreeting() {
    // Get the greeting section element
    const greetingSection = document.getElementById('personalized-greeting');
    if (!greetingSection) {
        console.error('Personalized greeting section not found in the DOM');
        return;
    }

    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userName = userData.name || 'User';

    // Get current hour to determine greeting
    const currentHour = new Date().getHours();
    let timeGreeting;

    if (currentHour < 12) {
        timeGreeting = 'Good morning';
    } else if (currentHour < 18) {
        timeGreeting = 'Good afternoon';
    } else {
        timeGreeting = 'Good evening';
    }

    // Create greeting content
    const greetingHTML = `
        <h2>${timeGreeting}, <span class="user-name">${userName}</span>!</h2>
        <p>Welcome to your PayRupee dashboard. Here you can manage your accounts, make transactions, and track your financial activities all in one place.</p>
    `;

    // Insert greeting into the section
    greetingSection.innerHTML = greetingHTML;

    // Make sure the section is visible
    greetingSection.style.display = 'block';

    // Add a highlight animation
    setTimeout(() => {
        greetingSection.classList.add('highlight-animation');
    }, 300);
}

// Initialize sidebar - static version
function initializeSidebarScrollBehavior() {
    const sidebar = document.querySelector('.sidebar');
    const dashboardContainer = document.querySelector('.dashboard-container');

    if (!sidebar || !dashboardContainer) {
        console.error('Sidebar or dashboard container not found');
        return;
    }

    console.log('Sidebar initialized as static');

    // No dynamic behavior needed for static sidebar
}

// Load recent transactions
function loadRecentTransactions() {
    const transactionsBody = document.getElementById('recent-transactions-body');
    if (!transactionsBody) return;

    // Clear loading message
    transactionsBody.innerHTML = '';

    // Get recent transactions using the transaction manager
    let recentTransactions = [];

    // Check if transaction manager is available
    if (window.transactionManager) {
        recentTransactions = window.transactionManager.getRecentTransactions(5);
    } else {
        // Fallback to direct localStorage access if transaction manager is not available
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        if (!userData.transactions || userData.transactions.length === 0) {
            // Create sample transactions for new users
            const sampleTransactions = [
                {
                    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                    description: 'Initial Deposit',
                    amount: 5000,
                    type: 'deposit',
                    status: 'completed'
                },
                {
                    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
                    description: 'Grocery Shopping',
                    amount: -1200,
                    type: 'withdrawal',
                    status: 'completed'
                },
                {
                    date: new Date(), // Today
                    description: 'Salary Credit',
                    amount: 25000,
                    type: 'deposit',
                    status: 'pending'
                }
            ];

            // Store sample transactions in localStorage
            userData.transactions = sampleTransactions;
            localStorage.setItem('userData', JSON.stringify(userData));
        }

        // Sort transactions by date (newest first)
        recentTransactions = userData.transactions.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        }).slice(0, 5);
    }

    if (recentTransactions.length === 0) {
        transactionsBody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center">
                    <div class="no-transactions">
                        No recent transactions
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    recentTransactions.forEach(transaction => {
        const date = new Date(transaction.date);
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

        const row = document.createElement('tr');

        // Determine amount class based on transaction type or amount
        const isIncome = transaction.type === 'deposit' || transaction.type === 'transfer_in' || transaction.amount > 0;
        const amountClass = isIncome ? 'income' : 'expense';
        const amountPrefix = isIncome ? '+' : '';
        const amount = typeof transaction.amount === 'number' ? transaction.amount : parseFloat(transaction.amount || 0);

        row.innerHTML = `
            <td>${formattedDate}</td>
            <td>${transaction.description}</td>
            <td class="transaction-amount ${amountClass}">${amountPrefix}₹${Math.abs(amount).toFixed(2)}</td>
            <td><span class="transaction-status ${transaction.status}">${transaction.status}</span></td>
        `;

        // Add click event to show transaction details
        row.addEventListener('click', () => {
            showTransactionDetails({
                date: formattedDate,
                time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                description: transaction.description,
                location: transaction.location || 'Online Banking',
                category: getTransactionCategory(transaction),
                amount: `${amountPrefix}₹${Math.abs(amount).toFixed(2)}`,
                status: transaction.status,
                id: transaction.id || 'TRX-' + Math.random().toString(36).substring(2, 11).toUpperCase()
            });
        });

        transactionsBody.appendChild(row);
    });
}
