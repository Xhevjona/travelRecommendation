const form = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');

const successMessage = document.createElement('p');
successMessage.classList.add('success-message');
form.appendChild(successMessage);

form.addEventListener('submit', function(e) {
    e.preventDefault();

    document.querySelectorAll('.error-message').forEach(span => {
        span.style.display = 'none';
        span.textContent = '';
    });
    successMessage.style.display = 'none';
    successMessage.textContent = '';

    let hasError = false;

    if (nameInput.value.trim() === '') {
        setError(nameInput, "Name is required");
        hasError = true;
    }

    if (emailInput.value.trim() === '') {
        setError(emailInput, "Email is required");
        hasError = true;
    } else if (!isValidEmail(emailInput.value.trim())) {
        setError(emailInput, "Email is not valid");
        hasError = true;
    }

    if (messageInput.value.trim() === '') {
        setError(messageInput, "Message cannot be empty");
        hasError = true;
    }

    if (!hasError) {
        successMessage.textContent = "Message sent successfully!";
        successMessage.style.display = 'block';
        successMessage.style.color = 'red';

        form.reset();
    }
});

function setError(input, message) {
    const errorSpan = input.parentElement.querySelector('.error-message');
    errorSpan.textContent = message;
    errorSpan.style.display = 'block';
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}