const form = document.getElementById('form')
const firstname_input = document.getElementById('firstname-input')
const email_input = document.getElementById('email-input')
const password_input = document.getElementById('password-input')
const repeat_password_input = document.getElementById('repeat-password-input')
const error_message = document.getElementById('error-message')

form.addEventListener('submit', (e) => {
    let errors = [];

    if (firstname_input) {
        // If firstname exists, we are on the Signup Page
        errors = getSignupFormErrors(firstname_input.value, email_input.value, password_input.value, repeat_password_input.value);
    } else {
        // If it doesn't, we are on the Login Page
        errors = getLoginFormErrors(email_input.value, password_input.value);
    }

    if (errors.length > 0) {
        e.preventDefault();
        error_message.innerText = errors.join(". ");
    } else {
        e.preventDefault();

        if (firstname_input) {
            // --- SUCCESSFUL SIGNUP ---
            const user = {
                firstname: firstname_input.value,
                email: email_input.value,
                password: btoa(password_input.value) // Simple Base64 "encryption"
            };
            localStorage.setItem('registeredUser', JSON.stringify(user));
            alert("Account created successfully! Please Login.");
            window.location.href = "login_userauth.html";
        } else {
            // --- SUCCESSFUL LOGIN ---
            const savedUser = JSON.parse(localStorage.getItem('registeredUser'));

            if (savedUser && email_input.value === savedUser.email && btoa(password_input.value) === savedUser.password) {
                localStorage.setItem('isLoggedIn', 'true');
                window.location.href = "website1.html";
            } else {
                error_message.innerText = "Invalid email or password";
            }
        }
    }
});

// MISSING FUNCTION RESTORED:
function getSignupFormErrors(firstname, email, password, repeatPassword) {
    // Inside getSignupFormErrors function
    let errors = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
        errors.push('Please enter a valid email address');
        email_input.parentElement.classList.add('incorrect');
    }


    if (!firstname) {
        errors.push('Firstname is required');
        firstname_input.parentElement.classList.add('incorrect');
    }
    if (!email) {
        errors.push('Email is required');
        email_input.parentElement.classList.add('incorrect');
    }
    if (!password) {
        errors.push('Password is required');
        password_input.parentElement.classList.add('incorrect');
    } else if (password.length < 8) {
        errors.push('Password must have at least 8 characters');
        password_input.parentElement.classList.add('incorrect');
    }
    if (password !== repeatPassword) {
        errors.push('Passwords do not match');
        repeat_password_input.parentElement.classList.add('incorrect');
    }

    return errors;
}

function getLoginFormErrors(email, password) {
    let errors = [];
    if (!email) {
        errors.push('Email is required');
        email_input.parentElement.classList.add('incorrect');
    }
    if (!password) {
        errors.push('Password is required');
        password_input.parentElement.classList.add('incorrect');
    }
    return errors;
}

const allInputs = [firstname_input, email_input, password_input, repeat_password_input].filter(input => input != null);

allInputs.forEach(input => {
    input.addEventListener('input', () => {
        if (input.parentElement.classList.contains('incorrect')) {
            input.parentElement.classList.remove('incorrect');
            error_message.innerText = '';
        }
    });
});