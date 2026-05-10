const API = "https://web-production-ef9b1.up.railway.app";

function loadWelcome() {
  const main = document.getElementById("mainContent");
  main.innerHTML = `
    <div class="welcome-screen">
      <div class="welcome-badge">Campaign Tracker</div>
      <h1 class="welcome-title">Welcome!</h1>
      <p class="welcome-subtitle">Manage and track your marketing campaigns from one place.</p>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">&#128196;</div>
          <div class="stat-info">
            <div class="stat-number">1</div>
            <div class="stat-label">Campaigns</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">&#9654;</div>
          <div class="stat-info">
            <div class="stat-number">0</div>
            <div class="stat-label">Total Clicks</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">&#10003;</div>
          <div class="stat-info">
            <div class="stat-number">0</div>
            <div class="stat-label">Conversions</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">&#8377;</div>
          <div class="stat-info">
            <div class="stat-number">0</div>
            <div class="stat-label">Revenue</div>
          </div>
        </div>
      </div>
      <button onclick="loadPage('create')" class="cta-btn">+ Create New Campaign</button>
    </div>
  `;
}

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

    if (page === "campaigns") {
      main.innerHTML = `<div class="loader">Loading campaigns...</div>`;
      const token = localStorage.getItem("token");
      fetch(API + "/campaign/all", {
        headers: { "Authorization": "Bearer " + token }
      })
      .then(res => res.json())
      .then(data => {
        if (!data || data.length === 0) {
          main.innerHTML = `
            <div class="fade">
              <h2>My Campaigns</h2>
              <p style="color: var(--text-secondary); margin-top: 20px;">No campaigns yet. Create your first one!</p>
              <button onclick="loadPage('create')" class="cta-btn" style="margin-top: 20px;">+ Create Campaign</button>
            </div>
          `;
        } else {
          let html = `<div class="fade"><h2>My Campaigns</h2>`;
          data.forEach(c => {
            html += `
              <div class="card">
                <h3 style="color: var(--text-primary); margin-bottom: 8px;">${c.name}</h3>
                <p style="color: var(--text-secondary); font-size: 13px;">Source: ${c.source} | Medium: ${c.medium} | Budget: ₹${c.budget}</p>
              </div>
            `;
          });
          html += `</div>`;
          main.innerHTML = html;
        }
      })
      .catch(() => {
        main.innerHTML = `<div class="fade"><h2>My Campaigns</h2><p style="color: var(--danger);">Failed to load campaigns.</p></div>`;
      });
    }
  }, 300);
}

// Register
function register() {
  fetch(API + "/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    })
  }).then(() => {
    alert("Registered successfully!");
    window.location = "/campaigntracker/login.html";
  });
}

// Login
function login() {
  fetch(API + "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.token) {
      localStorage.setItem("token", data.token);
      alert("Login successful!");
      window.location = "/campaigntracker/dashboard.html";
    } else {
      alert("Login failed: " + JSON.stringify(data));
    }
  });
}

// Create Campaign
function createCampaign() {
  const token = localStorage.getItem("token");
  fetch(API + "/campaign/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({
      name: document.getElementById("name").value,
      source: document.getElementById("source").value,
      medium: document.getElementById("medium").value,
      budget: document.getElementById("budget").value,
      user_id: 1
    })
  })
  .then(res => res.json())
  .then(data => {
    alert("Campaign created! ID: " + data.id);
  })
  .catch(err => alert("Error: " + err));
}

// Get Analytics
function getAnalytics() {
  const token = localStorage.getItem("token");
  const id = document.getElementById("campaignId").value;
  fetch(API + "/analytics/" + id, {
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
  window.location = "/campaigntracker/login.html";
}