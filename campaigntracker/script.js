const API = "https://web-production-ef9b1.up.railway.app";

// Redirect if not logged in
if (document.querySelector(".dashboard")) {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location = "/campaigntracker/login.html";
  }
}

function setActive(page) {
  document.querySelectorAll(".sidebar li").forEach(li => li.classList.remove("active"));
  const items = document.querySelectorAll(".sidebar li");
  if (page === "create") items[0].classList.add("active");
  if (page === "analytics") items[1].classList.add("active");
  if (page === "campaigns") items[2].classList.add("active");
}

// ===== WELCOME SCREEN WITH REAL STATS =====
function loadWelcome() {
  setActive("");
  const main = document.getElementById("mainContent");
  main.innerHTML = `<div class="loader">Loading...</div>`;

  const token = localStorage.getItem("token");

  fetch(API + "/campaign/all", {
    headers: { "Authorization": "Bearer " + token }
  })
  .then(res => res.json())
  .then(async campaigns => {
    let totalClicks = 0;
    let totalConversions = 0;
    let totalRevenue = 0;

    const promises = campaigns.map(c =>
      fetch(API + "/analytics/" + c.id, {
        headers: { "Authorization": "Bearer " + token }
      }).then(r => r.json())
    );

    const results = await Promise.all(promises);
    results.forEach(r => {
      totalClicks += r.clicks || 0;
      totalConversions += r.conversions || 0;
      totalRevenue += parseFloat(r.revenue) || 0;
    });

    main.innerHTML = `
      <div class="welcome-screen">
        <div class="welcome-badge">Campaign Tracker</div>
        <h1 class="welcome-title">Welcome!</h1>
        <p class="welcome-subtitle">Manage and track your marketing campaigns from one place.</p>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">&#128196;</div>
            <div class="stat-info">
              <div class="stat-number">${campaigns.length}</div>
              <div class="stat-label">Campaigns</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">&#9654;</div>
            <div class="stat-info">
              <div class="stat-number">${totalClicks}</div>
              <div class="stat-label">Total Clicks</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">&#10003;</div>
            <div class="stat-info">
              <div class="stat-number">${totalConversions}</div>
              <div class="stat-label">Conversions</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">&#8377;</div>
            <div class="stat-info">
              <div class="stat-number">₹${totalRevenue.toFixed(2)}</div>
              <div class="stat-label">Revenue</div>
            </div>
          </div>
        </div>
        <button onclick="loadPage('create')" class="cta-btn">+ Create New Campaign</button>
      </div>
    `;
  })
  .catch(() => {
    main.innerHTML = `<div class="fade"><p style="color:var(--danger)">Failed to load stats.</p></div>`;
  });
}

// ===== LOAD PAGE =====
function loadPage(page) {
  setActive(page);
  const main = document.getElementById("mainContent");
  main.innerHTML = `<div class="loader">Loading...</div>`;

  const token = localStorage.getItem("token");

  setTimeout(() => {
    if (page === "create") {
      main.innerHTML = `
        <div class="fade">
          <h2>Create Campaign</h2>
          <input id="name" placeholder="Campaign Name">
          <input id="source" placeholder="Source (e.g. Google, Facebook)">
          <input id="medium" placeholder="Medium (e.g. CPC, Email)">
          <input id="budget" placeholder="Budget (₹)" type="number" min="0">
          <button onclick="createCampaign()">Create Campaign</button>
        </div>
      `;
    }

    if (page === "analytics") {
      fetch(API + "/campaign/all", {
        headers: { "Authorization": "Bearer " + token }
      })
      .then(res => res.json())
      .then(campaigns => {
        if (!campaigns || campaigns.length === 0) {
          main.innerHTML = `
            <div class="fade">
              <h2>Analytics</h2>
              <p style="color: var(--text-secondary); margin-top: 20px;">No campaigns yet. Create your first one!</p>
              <button onclick="loadPage('create')" class="cta-btn" style="margin-top: 20px;">+ Create Campaign</button>
            </div>
          `;
          return;
        }

        let options = campaigns.map(c =>
          `<option value="${c.id}">${c.name} (ID: ${c.id})</option>`
        ).join("");

        main.innerHTML = `
          <div class="fade">
            <h2>Analytics</h2>
            <select id="campaignSelect" style="
              width: 100%;
              padding: 14px 16px;
              margin: 8px 0 16px;
              border-radius: 10px;
              border: 1px solid var(--border);
              background: var(--bg-card);
              color: var(--text-primary);
              font-family: 'Plus Jakarta Sans', sans-serif;
              font-size: 14px;
              outline: none;
              cursor: pointer;
            ">
              <option value="">-- Select a Campaign --</option>
              ${options}
            </select>
            <button onclick="getAnalytics()">Get Analytics</button>
            <div id="result"></div>
          </div>
        `;
      })
      .catch(() => {
        main.innerHTML = `<div class="fade"><h2>Analytics</h2><p style="color:var(--danger)">Failed to load campaigns.</p></div>`;
      });
    }

    if (page === "campaigns") {
      main.innerHTML = `<div class="loader">Loading campaigns...</div>`;
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
              <div class="card" style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <h3 style="color: var(--text-primary); margin-bottom: 8px;">ID: ${c.id} — ${c.name}</h3>
                  <p style="color: var(--text-secondary); font-size: 13px;">Source: ${c.source} | Medium: ${c.medium} | Budget: ₹${c.budget}</p>
                </div>
                <button onclick="deleteCampaign(${c.id})" style="width: auto; padding: 8px 16px; background: rgba(239,68,68,0.15); color: #ef4444; border: 1px solid rgba(239,68,68,0.3); margin-top: 0;">Delete</button>
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

// ===== REGISTER =====
function register() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!name || !email || !password) {
    alert("All fields are required!");
    return;
  }
  if (!email.includes("@")) {
    alert("Please enter a valid email address!");
    return;
  }
  if (password.length < 6) {
    alert("Password must be at least 6 characters!");
    return;
  }

  fetch(API + "/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.message === "Registered successfully") {
      alert("Registered successfully!");
      window.location = "/campaigntracker/login.html";
    } else {
      alert(data.message || "Registration failed!");
    }
  })
  .catch(() => alert("Something went wrong. Try again!"));
}

// ===== LOGIN =====
function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Email and password are required!");
    return;
  }

  fetch(API + "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.token) {
      localStorage.setItem("token", data.token);
      window.location = "/campaigntracker/dashboard.html";
    } else {
      alert(data.message || "Login failed!");
    }
  })
  .catch(() => alert("Something went wrong. Try again!"));
}

// ===== CREATE CAMPAIGN =====
function createCampaign() {
  const name = document.getElementById("name").value.trim();
  const source = document.getElementById("source").value.trim();
  const medium = document.getElementById("medium").value.trim();
  const budget = document.getElementById("budget").value.trim();

  if (!name || !source || !medium || !budget) {
    alert("All fields are required!");
    return;
  }
  if (isNaN(budget) || Number(budget) < 0) {
    alert("Budget must be a valid positive number!");
    return;
  }

  const token = localStorage.getItem("token");
  fetch(API + "/campaign/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ name, source, medium, budget })
  })
  .then(res => res.json())
  .then(data => {
    const main = document.getElementById("mainContent");
    main.innerHTML = `
      <div class="fade">
        <div style="text-align: center; padding: 60px 20px;">
          <div style="font-size: 48px; margin-bottom: 20px; color: var(--success);">&#10003;</div>
          <h2 style="color: var(--success); margin-bottom: 10px;">Campaign Created!</h2>
          <p style="color: var(--text-secondary); margin-bottom: 30px;">Your campaign has been created with ID: ${data.id}</p>
          <button onclick="loadPage('create')" class="cta-btn" style="width: auto; padding: 12px 24px; margin-right: 10px;">+ Create Another</button>
          <button onclick="loadPage('campaigns')" class="cta-btn" style="width: auto; padding: 12px 24px;">View Campaigns</button>
        </div>
      </div>
    `;
  })
  .catch(() => alert("Failed to create campaign. Try again!"));
}

// ===== GET ANALYTICS =====
function getAnalytics() {
  const token = localStorage.getItem("token");
  const select = document.getElementById("campaignSelect");
  const id = select.value;

  if (!id) {
    alert("Please select a campaign first!");
    return;
  }

  document.getElementById("result").innerHTML = `<div class="loader">Loading analytics...</div>`;

  fetch(API + "/analytics/" + id, {
    headers: { "Authorization": "Bearer " + token }
  })
  .then(res => res.json())
  .then(data => {
    if (data.message) {
      document.getElementById("result").innerHTML = `<p style="color:var(--danger); margin-top:16px;">${data.message}</p>`;
      return;
    }

    const convRate = data.clicks > 0
      ? ((data.conversions / data.clicks) * 100).toFixed(1)
      : "0.0";

    document.getElementById("result").innerHTML = `
      <div style="margin-top: 24px;">
        <h3 style="color: var(--text-secondary); font-size: 14px; font-weight: 600; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 1px;">
          Results for: ${data.name}
        </h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
          <div class="card" style="text-align: center; padding: 28px 20px;">
            <div style="font-size: 36px; font-weight: 800; color: var(--primary-light);">${data.clicks}</div>
            <div style="font-size: 13px; color: var(--text-secondary); margin-top: 6px; font-weight: 500;">Total Clicks</div>
          </div>
          <div class="card" style="text-align: center; padding: 28px 20px;">
            <div style="font-size: 36px; font-weight: 800; color: var(--success);">${data.conversions}</div>
            <div style="font-size: 13px; color: var(--text-secondary); margin-top: 6px; font-weight: 500;">Conversions</div>
          </div>
          <div class="card" style="text-align: center; padding: 28px 20px;">
            <div style="font-size: 36px; font-weight: 800; color: var(--accent);">₹${parseFloat(data.revenue).toFixed(2)}</div>
            <div style="font-size: 13px; color: var(--text-secondary); margin-top: 6px; font-weight: 500;">Total Revenue</div>
          </div>
          <div class="card" style="text-align: center; padding: 28px 20px;">
            <div style="font-size: 36px; font-weight: 800; color: var(--primary-light);">${convRate}%</div>
            <div style="font-size: 13px; color: var(--text-secondary); margin-top: 6px; font-weight: 500;">Conversion Rate</div>
          </div>
        </div>
      </div>
    `;
  })
  .catch(() => {
    document.getElementById("result").innerHTML = `<p style="color:var(--danger); margin-top:16px;">Failed to load analytics.</p>`;
  });
}

// ===== DELETE CAMPAIGN =====
function deleteCampaign(id) {
  if (!confirm("Are you sure you want to delete this campaign?")) return;
  const token = localStorage.getItem("token");
  fetch(API + "/campaign/delete/" + id, {
    method: "DELETE",
    headers: { "Authorization": "Bearer " + token }
  })
  .then(res => res.json())
  .then(() => {
    loadPage("campaigns");
  })
  .catch(() => alert("Failed to delete campaign. Try again!"));
}

// ===== LOGOUT =====
function logout() {
  localStorage.removeItem("token");
  window.location = "/campaigntracker/login.html";
}