document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('myForm');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        // Store data in local storage
        localStorage.setItem('formData', JSON.stringify(formData));

        // Redirect to receiver.html
        window.location.href = 'receiver.html';
    });
});