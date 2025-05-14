// Accounts page JavaScript for PayRupee

document.addEventListener('DOMContentLoaded', function() {
    // Initialize account page
    loadAccountData();
    setupAccountEventListeners();
});

// Load account data
function loadAccountData() {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    // Set default values if not present
    if (!userData.name) userData.name = 'User';
    if (userData.balance === undefined) userData.balance = 0;
    if (!userData.accountNumber) userData.accountNumber = 'PR' + Math.floor(1000000000 + Math.random() * 9000000000);
    if (!userData.openDate) userData.openDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(); // 90 days ago
    if (!userData.lastLogin) userData.lastLogin = new Date().toISOString();
    
    // Save updated user data
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Set account holder name
    const accountHolderName = document.getElementById('account-holder-name');
    if (accountHolderName) {
        accountHolderName.textContent = userData.name;
    }
    
    // Set account number
    const accountNumber = userData.accountNumber;
    const formattedAccountNumber = accountNumber.replace(/(\w{2})(\d{4})(\d{4})/, '$1$2-$3');
    
    const accountNumberDisplay = document.getElementById('account-number-display');
    if (accountNumberDisplay) {
        accountNumberDisplay.textContent = formattedAccountNumber;
    }
    
    // Set available balance
    const availableBalance = document.getElementById('available-balance');
    if (availableBalance) {
        availableBalance.textContent = userData.balance.toFixed(2);
    }
    
    // Set account open date
    const accountOpenDate = document.getElementById('account-open-date');
    if (accountOpenDate) {
        const openDate = new Date(userData.openDate);
        accountOpenDate.textContent = openDate.toLocaleDateString();
    }
    
    // Set last transaction date
    const lastTransactionDate = document.getElementById('last-transaction-date');
    if (lastTransactionDate) {
        if (userData.transactions && userData.transactions.length > 0) {
            // Sort transactions by date (newest first)
            const sortedTransactions = [...userData.transactions].sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
            });
            
            const lastTransaction = sortedTransactions[0];
            const transactionDate = new Date(lastTransaction.date);
            lastTransactionDate.textContent = transactionDate.toLocaleDateString();
        } else {
            lastTransactionDate.textContent = 'N/A';
        }
    }
    
    // Set last login time
    const lastLoginTime = document.getElementById('last-login-time');
    if (lastLoginTime) {
        const loginDate = new Date(userData.lastLogin);
        const now = new Date();
        
        // If login was today, show "Today at HH:MM"
        if (loginDate.toDateString() === now.toDateString()) {
            lastLoginTime.textContent = `Today at ${loginDate.getHours().toString().padStart(2, '0')}:${loginDate.getMinutes().toString().padStart(2, '0')}`;
        } else {
            // Otherwise show date and time
            lastLoginTime.textContent = `${loginDate.toLocaleDateString()} at ${loginDate.getHours().toString().padStart(2, '0')}:${loginDate.getMinutes().toString().padStart(2, '0')}`;
        }
    }
}

// Set up event listeners for account page
function setupAccountEventListeners() {
    // Copy account number button
    const copyAccountNumberBtn = document.getElementById('copy-account-number');
    if (copyAccountNumberBtn) {
        copyAccountNumberBtn.addEventListener('click', function() {
            const accountNumber = document.getElementById('account-number-display').textContent;
            
            // Create a temporary input element to copy from
            const tempInput = document.createElement('input');
            tempInput.value = accountNumber;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            
            // Show feedback
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Copied!';
            this.style.backgroundColor = 'var(--success-color)';
            this.style.color = 'white';
            this.style.borderColor = 'var(--success-color)';
            
            // Show toast notification
            showToast('Account number copied to clipboard', 'success');
            
            // Reset button after 2 seconds
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.backgroundColor = '';
                this.style.color = '';
                this.style.borderColor = '';
            }, 2000);
        });
    }
    
    // View statement button
    const viewStatementBtn = document.getElementById('view-statement');
    if (viewStatementBtn) {
        viewStatementBtn.addEventListener('click', function() {
            showToast('Statement feature coming soon', 'info');
        });
    }
    
    // Change password button
    const changePasswordBtn = document.getElementById('change-password');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', function() {
            showToast('Change password feature coming soon', 'info');
        });
    }
    
    // Security settings button
    const securitySettingsBtn = document.getElementById('security-settings');
    if (securitySettingsBtn) {
        securitySettingsBtn.addEventListener('click', function() {
            showToast('Security settings feature coming soon', 'info');
        });
    }
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
