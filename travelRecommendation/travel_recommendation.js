const container = document.querySelector(".search-container");
const toggle = document.getElementById("toggleSearch");

toggle.addEventListener("click", () => {
    container.classList.toggle("expanded");

    if (container.classList.contains("expanded")) {
        document.getElementById("searchInput").focus();
    }
}); 





/* Contact JS */

const contactForm = document.getElementById("contactForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");

contactForm.addEventListener("submit", function(e){
    e.preventDefault(); 

    document.querySelectorAll(".error-message").forEach(span => span.textContent = "");
    [nameInput, emailInput, messageInput].forEach(input => input.classList.remove("input-error"));

    let isValid = true;

    if(nameInput.value.trim() === ""){
        showError(nameInput, "Please enter your name");
        isValid = false;
    }

    if(emailInput.value.trim() === ""){
        showError(emailInput, "Please enter your email");
        isValid = false;
    } else if(!validateEmail(emailInput.value.trim())){
        showError(emailInput, "Please enter a valid email");
        isValid = false;
    }

    if(messageInput.value.trim() === ""){
        showError(messageInput, "Please write your message");
        isValid = false;
    }

    if(!isValid) return; 

    alert("Message sent successfully! Thank you.");
    contactForm.reset();
});

function showError(input, message){
    const formGroup = input.parentElement;
    const errorSpan = formGroup.querySelector(".error-message");
    errorSpan.textContent = message;
    input.classList.add("input-error");
}

function validateEmail(email){
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}