const projectsUrl = "http://127.0.0.1:8000/api/projects/"; // Endpoint for projects
const baseURL = "http://127.0.0.1:8000";
const login = "http://127.0.0.1:5500/devsearch/frontend/login.html";

const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
let token = localStorage.getItem("token");

console.log("TOKEN: ", token);

if (token) {
    loginBtn.remove(); // Remove login button
} else {
    logoutBtn.remove(); // Remove logout button
    window.location.href = login;
}

// Handle Logout
logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    window.location.href = login;
});

let getProjects = () => {
    // Fetch API Request -> GET Request
    fetch(projectsUrl)
        .then((response) => response.json()) // Convert response to JSON
        .then((data) => buildProjects(data)) // Log data
        .catch((error) => console.log(error)); // Log error
};

// Build Projects
let buildProjects = (projects) => {
    console.log(projects);
    let projectsWrapper = document.getElementById("projects--wrapper");
    projectsWrapper.innerHTML = ""; // Clear projects

    // Check for empty projects
    if (projects.length === 0) {
        projectsWrapper.innerHTML = ` 
        <h3 style="text-align:center;">No Projects Found!</h3>`;
        return;
    } else {
        // console.log("projectsWrapper: ", projectsWrapper);
        // Loop through projects
        for (let i = 0; i < projects.length; i++) {
            let project = projects[i];
            let projectCad = `
            <div class="project--card">
                <img src="${baseURL}${project.featured_image}" alt="${
        project.title
      }">
                <div>
                    <div class="card--header">
                        <h3>${project.title}</h3>
                        <strong class="vote--option" data-vote="up" data-project="${
                          project.id
                        }">&#43;</strong>
                        <strong class="vote--option" data-vote="down" data-project="${
                          project.id
                        }">&#8722;</strong>
                    </div>
                    <i>${project.vote_ratio}% Positive Feedback</i>
                    <p>${project.description.substring(0, 150)}</p>
                </div>
            </div>    
                `;
            projectsWrapper.innerHTML += projectCad;
        }
    }

    // Add event listener to vote buttons
    addVoteEvents();
    // let voteBtns = document.getElementsByClassName("vote--option");
};

let addVoteEvents = () => {
    let voteBtns = document.getElementsByClassName("vote--option");

    for (let i = 0; voteBtns.length > i; i++) {
        voteBtns[i].addEventListener("click", (e) => {
            let token = localStorage.getItem("token");
            console.log("TOKEN:", token);
            let vote = e.target.dataset.vote;
            let project = e.target.dataset.project;

            fetch(`http://127.0.0.1:8000/api/projects/${project}/vote/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ value: vote }),
                })
                .then((response) => response.json())
                .then((data) => {
                    console.log("Success:", data);
                    getProjects();
                });
        });
    }
};

getProjects();