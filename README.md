# PayRupee Banking System

PayRupee is a personal banking system built with Django and Django REST Framework. It provides a secure and reliable platform for managing user accounts, performing banking operations, and tracking transactions.

## Features

- **User Account Management**: Secure registration with email verification, login with credential validation, session/token management (JWT), and login event tracking.

- **Automatic Account Creation**: On successful registration, assigns a unique account number in the format PR-XXXX-XXXX-XXXX, sets initial balance to 0, and records account creation date.

- **Core Banking Operations**:
  - **Deposit**: Allow users to deposit funds, update balance, and record each transaction.
  - **Withdraw**: Allow users to withdraw funds only if sufficient balance exists.
  - **Transfer**: Allow users to send money to another account, update sender/receiver balances, and record both sides of transaction.

- **Transaction Management**: RESTful API to fetch recent transactions, filter by date/type/amount, and generate downloadable statements.

## Technology Stack

- **Backend**: Django, Django REST Framework
- **Authentication**: JWT (JSON Web Token)
- **Database**: SQLite (development), MySQL (production)
- **API Documentation**: Markdown

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/payrupee.git
   cd payrupee
   ```

2. Create a virtual environment and activate it:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Apply migrations:
   ```
   python manage.py migrate
   ```

5. Create a superuser:
   ```
   python manage.py createsuperuser
   ```

6. Run the development server:
   ```
   python manage.py runserver
   ```

7. Access the API at http://localhost:8000/api/

## API Documentation

For detailed API documentation, see [API_DOCUMENTATION.md](API_DOCUMENTATION.md).

## Project Structure

```
payrupee/
├── accounts/              # User account management app
│   ├── models.py          # User and LoginLog models
│   ├── serializers.py     # User-related serializers
│   ├── urls.py            # URL routing for user endpoints
│   └── views.py           # API views for user operations
├── banking/               # Banking operations app
│   ├── models.py          # Account model
│   ├── serializers.py     # Account-related serializers
│   ├── urls.py            # URL routing for banking endpoints
│   └── views.py           # API views for banking operations
├── transactions/          # Transaction management app
│   ├── models.py          # Transaction and Category models
│   ├── serializers.py     # Transaction-related serializers
│   ├── urls.py            # URL routing for transaction endpoints
│   └── views.py           # API views for transaction operations
├── payrupee/              # Project settings
│   ├── settings.py        # Django settings
│   ├── urls.py            # Main URL routing
│   ├── wsgi.py            # WSGI configuration
│   └── asgi.py            # ASGI configuration
├── manage.py              # Django management script
├── requirements.txt       # Project dependencies
└── README.md              # Project documentation
```

## Security Features

- JWT token-based authentication
- Password validation and hashing
- Login event tracking
- Transaction validation and consistency

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Django and Django REST Framework communities
- Contributors to the project
