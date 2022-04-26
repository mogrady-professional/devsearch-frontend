const tokenObtainPairURL = "http://127.0.0.1:8000/api/users/token/";
let form = document.getElementById("login-form");
let token = localStorage.getItem("token");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    // console.log("Form was Submitted");

    let formData = {
        username: form.username.value,
        password: form.password.value,
    };
    // console.log("FORM DATA", formData);

    // Fetch API -> To recieve a token
    fetch(tokenObtainPairURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log("DATA:", data.access);
            if (data.access) {
                localStorage.setItem("token", data.access);
                window.location.href =
                    "http://127.0.0.1:5500/frontend/projects-list.html";
            } else {
                alert("Invalid Credentials");
            }
        })
        .catch((error) => {
            console.log("Error:", error);
        });
});