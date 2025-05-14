// Main JavaScript for PayRupee

document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    const currentYearElements = document.querySelectorAll('#current-year');
    currentYearElements.forEach(element => {
        element.textContent = new Date().getFullYear();
    });

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            document.querySelector('.header-content').classList.toggle('mobile-menu-active');

            // Toggle hamburger to X
            const bars = this.querySelectorAll('.bar');
            bars[0].classList.toggle('rotate-45');
            bars[0].classList.toggle('translate-y-2');
            bars[1].classList.toggle('opacity-0');
            bars[2].classList.toggle('-rotate-45');
            bars[2].classList.toggle('-translate-y-2');
        });
    }

    // Testimonial slider
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (testimonialSlider) {
        const prevButton = document.querySelector('.prev-testimonial');
        const nextButton = document.querySelector('.next-testimonial');

        if (prevButton && nextButton) {
            prevButton.addEventListener('click', function() {
                testimonialSlider.scrollBy({ left: -300, behavior: 'smooth' });
            });

            nextButton.addEventListener('click', function() {
                testimonialSlider.scrollBy({ left: 300, behavior: 'smooth' });
            });
        }
    }

    // Password toggle visibility
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const passwordInput = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');

            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();

            // Clear any stored tokens or user data
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');

            // Redirect to login page
            window.location.href = 'login.html';
        });
    }

    // Dashboard sidebar toggle for mobile
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            document.querySelector('.sidebar').classList.toggle('active');
        });
    }

    // Balance refresh button
    const refreshBalance = document.querySelector('.refresh-balance');
    if (refreshBalance) {
        refreshBalance.addEventListener('click', function() {
            this.classList.add('fa-spin');

            // Simulate API call delay
            setTimeout(() => {
                this.classList.remove('fa-spin');
                // Here you would update the balance with data from the API
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
                // Show the balance
                balanceAmount.textContent = '24,562.52'; // This would come from stored data
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                // Hide the balance
                balanceAmount.textContent = '**,***.**';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
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

    // Initialize charts if on dashboard page
    if (document.getElementById('spending-chart') && document.getElementById('categories-chart')) {
        initializeCharts();
    }
});

// Function to initialize dashboard charts
function initializeCharts() {
    // Spending Chart
    const spendingChartCtx = document.getElementById('spending-chart').getContext('2d');
    const spendingChart = new Chart(spendingChartCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [
                {
                    label: 'Income',
                    data: [3500, 3500, 4200, 3800, 3500, 3500, 4000],
                    backgroundColor: 'rgba(46, 204, 113, 0.2)',
                    borderColor: 'rgba(46, 204, 113, 1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Expenses',
                    data: [2100, 2400, 2200, 2800, 2600, 2300, 2500],
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

    // Categories Chart
    const categoriesChartCtx = document.getElementById('categories-chart').getContext('2d');
    const categoriesChart = new Chart(categoriesChartCtx, {
        type: 'doughnut',
        data: {
            labels: ['Housing', 'Food', 'Transportation', 'Entertainment', 'Other'],
            datasets: [{
                data: [35, 25, 15, 10, 15],
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

    // Store chart instances for later updates
    window.spendingChart = spendingChart;
    window.categoriesChart = categoriesChart;
}

// Function to update chart data based on selected period
function updateChartData(period) {
    if (!window.spendingChart) return;

    let labels, incomeData, expenseData;

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

    window.spendingChart.data.labels = labels;
    window.spendingChart.data.datasets[0].data = incomeData;
    window.spendingChart.data.datasets[1].data = expenseData;
    window.spendingChart.update();
}
