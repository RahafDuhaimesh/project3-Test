/** @format */
let ifLogin = JSON.parse(window.localStorage.getItem("ifLogin"));
let logInUser = JSON.parse(window.localStorage.getItem("logInUser"));

let login = document.getElementById("login");
let signup = document.getElementById("signup");

let profileMenu = document.getElementById("profileMenu");
let services = document.getElementById("services");
let profileName = document.getElementById("profileName");

let profile = document.getElementById("profile");
let logout = document.getElementById("logout");

if (ifLogin) {
  // Function to check screen width and hide/show the element
  function checkScreenWidth() {
    if (window.matchMedia("(max-width: 426px)").matches) {
      login.style.display = "none";
      signup.style.display = "none";

      profile.style.display = "block";
      logout.style.display = "block";

      services.style.display = "inline-block";
    } else {
      profileName.innerText = logInUser.firstName;

      profile.style.display = "none";
      logout.style.display = "none";

      login.style.display = "none";
      signup.style.display = "none";

      profileMenu.style.display = "inline-block";
      services.style.display = "inline-block";
    }
  }
  checkScreenWidth();
  window.addEventListener("resize", checkScreenWidth);
}

// Set (false) for ifLogin when clicking on logout
document.getElementById("logoutNotRes").addEventListener("click", function () {
  ifLogin = false;
  localStorage.setItem("ifLogin", JSON.stringify(ifLogin));
  window.location.href = "home.html";
});

document.getElementById("logoutRes").addEventListener("click", function () {
  ifLogin = false;
  localStorage.setItem("ifLogin", JSON.stringify(ifLogin));
  window.location.href = "home.html";
});

// NavBar JavaScript
document.querySelector(".hamburger").onclick = function () {
  document.querySelector(".nav-bar").classList.toggle("active");
};

document.querySelector(".profile-name").onclick = function () {
  document.querySelector(".profile-menu").classList.toggle("active");
};
