document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("myForm");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Get form data
    const formData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      message: document.getElementById("message").value,
    };

    // Store data in local storage
    localStorage.setItem("formData", JSON.stringify(formData));

    // Redirect to receiver.html
    window.location.href = "receiver.html";
  });
});
document
  .getElementById("feedbackForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // NavBar JavaScript
    hamburger = document.querySelector(".hamburger");
    hamburger.onclick = function () {
      navBar = document.querySelector(".nav-bar");
      navBar.classList.toggle("active");
    };

    profileName = document.querySelector(".profile-name");
    profileName.onclick = function () {
      profileMenu = document.querySelector(".profile-menu");
      profileMenu.classList.toggle("active");
    };
    // Gather form data
    const email = document.getElementById("email").value;
    const name = document.getElementById("name").value;
    const priority = document.getElementById("priority").value;
    const type = document.getElementById("feedbackType").value;
    const content = document.getElementById("feedback").value;

    // Create a new complaint object
    const newComplaint = {
      email: email,
      name: name,
      priority: priority,
      type: type,
      status: "Open", // Initial status
      date: new Date().toISOString().slice(0, 10), // Today's date
      content: content,
      completed: false, // Initially not completed
    };

    // Save to local storage
    let complaints = JSON.parse(localStorage.getItem("complaints")) || [];
    complaints.push(newComplaint);
    localStorage.setItem("complaints", JSON.stringify(complaints));

    // Show thank you message
    showThankYou();

    // Reset form
    document.getElementById("feedbackForm").reset();
  });

function showThankYou() {
  // Create overlay and message
  const overlay = document.createElement("div");
  overlay.classList.add("overlay");

  const message = document.createElement("div");
  message.classList.add("overlay-content");
  message.innerHTML =
    "<h3>Thank you for your feedback!</h3><p>We appreciate your valuable input.</p>";

  overlay.appendChild(message);
  document.body.appendChild(overlay);

  // Remove overlay after 3 seconds
  setTimeout(function () {
    overlay.remove();
  }, 3000);
}
// NavBar JavaScript
hamburger = document.querySelector(".hamburger");
hamburger.onclick = function () {
  navBar = document.querySelector(".nav-bar");
  navBar.classList.toggle("active");
};
profileName = document.querySelector(".profile-name");
profileName.onclick = function () {
  profileMenu = document.querySelector(".profile-menu");
  profileMenu.classList.toggle("active");
};
