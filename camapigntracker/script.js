function loadPage(page) {
  const main = document.getElementById("mainContent");
  main.innerHTML = `<div class="loader">Loading...</div>`;

  setTimeout(() => {
    if (page === "create") {
      main.innerHTML = `
        <div class="fade">
          <h2>Create Campaign</h2>
          <input id="name" placeholder="Name">
          <input id="source" placeholder="Source">
          <input id="medium" placeholder="Medium">
          <input id="budget" placeholder="Budget">
          <button onclick="createCampaign()">Create</button>
        </div>
      `;
    }

    if (page === "analytics") {
      main.innerHTML = `
        <div class="fade">
          <h2>Analytics</h2>
          <input id="campaignId" placeholder="Campaign ID">
          <button onclick="getAnalytics()">Get Data</button>
          <div id="result"></div>
        </div>
      `;
    }
  }, 300);
}

// Register
function register() {
  fetch("https://web-production-ef9b1.up.railway.app/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    })
  }).then(() => {
    alert("Registered successfully!");
    window.location = "/camapigntracker/login.html";
  });
}

// Login
function login() {
  fetch("https://web-production-ef9b1.up.railway.app/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    })
  })
  .then(res => res.json())
  .then(data => {
    localStorage.setItem("token", data.token);
    alert("Login successful!");
    window.location = "/camapigntracker/dashboard.html";
  });
}

// Create Campaign
function createCampaign() {
  const token = localStorage.getItem("token");
  fetch("https://web-production-ef9b1.up.railway.app/campaign", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({
      name: document.getElementById("name").value,
      source: document.getElementById("source").value,
      medium: document.getElementById("medium").value,
      budget: document.getElementById("budget").value
    })
  })
  .then(res => res.json())
  .then(data => {
    alert("Campaign created successfully!");
  });
}

// Get Analytics
function getAnalytics() {
  const token = localStorage.getItem("token");
  const id = document.getElementById("campaignId").value;
  fetch("https://web-production-ef9b1.up.railway.app/analytics/" + id, {
    headers: { "Authorization": "Bearer " + token }
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById("result").innerHTML = JSON.stringify(data, null, 2);
  });
}

// Logout
function logout() {
  localStorage.removeItem("token");
  window.location = "/camapigntracker/login.html";
}