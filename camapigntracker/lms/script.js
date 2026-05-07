const API = "http://localhost:5000";

/* Register */
function register() {
    fetch(API + "/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: name.value,
            email: email.value,
            password: password.value
        })
    }).then(() => {
        alert("Registered!");
        window.location = "login.html";
    });
}

/* Login */
function login() {
    fetch(API + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email.value,
            password: password.value
        })
    })
    .then(res => res.json())
    .then(data => {
        localStorage.setItem("user", JSON.stringify(data));
        window.location = "dashboard.html";
    });
}

/* Enroll */
function enroll(course_id) {
    let user = JSON.parse(localStorage.getItem("user"));

    fetch(API + "/enroll", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            user_id: user.id,
            course_id: course_id
        })
    }).then(() => alert("Enrolled!"));
}