//const baseURL = "http://127.0.0.1:8000"; // local
const baseURL = 'https://devsearch-heroku.herokuapp.com//'; // Production
//const projectsURL = "http://127.0.0.1:8000/api/projects/"; // Endpoint for projects api // local
const projectsURL = 'https://devsearch-heroku.herokuapp.com//api/projects/'; // Endpoint for projects api // Production
//const projectURL = "http://127.0.0.1:8000/projects/project/"; // local
const projectURL = 'https://devsearch-heroku.herokuapp.com//projects/project/'; // Production
//const profilesURL = "http://127.0.0.1:8000"; // local
const profilesURL = 'https://devsearchbucket1544.s3.amazonaws.com/profiles/'; // Production
//const login = "http://127.0.0.1:5500/frontend/home.html"; // local
const login = 'http://www.api.devsearch.ie'; // frontend

const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
let token = localStorage.getItem('token');

console.log('TOKEN: ', token);

if (token) {
  loginBtn.remove(); // Remove login button
  console.log('Logged in');
} else {
  logoutBtn.remove(); // Remove logout button
  console.log('Not logged in');
  window.location.href = login;
}

// Handle Logout
logoutBtn.addEventListener('click', (e) => {
  // e.preventDefault();
  localStorage.removeItem('token');
  window.location.href = login;
});

let getProjects = () => {
  // Fetch API Request -> GET Request
  fetch(projectsURL)
    .then((response) => response.json()) // Convert response to JSON
    .then((data) => buildProjects(data)) // Log data
    .catch((error) => console.log(error)); // Log error
};

// Build Projects
let buildProjects = (projects) => {
  console.log(projects);
  let projectsWrapper = document.getElementById('projects--wrapper');
  projectsWrapper.innerHTML = ''; // Clear projects

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
            <div class="card-deck mb-3 text-center">
            <div class="card mb-4 box-shadow">
                <div class="card-header">
                    <h4 class="my-0 font-weight-normal">${project.title}</h4>
                </div>
                <img class="card-img-top" src="${
                  project.featured_image
                }" alt="${project.title}" />
                <div class="card-body">
                    <h1 class="card-title pricing-card-title">Votes: 
                    ${project.vote_total}<br><small class="text-muted"><i>${
        project.vote_ratio
      }% Positive Feedback</i></small>
                    </h1>
                    <div>
                    <img
                      class="rounded-circle"
                      src="${project.owner.profile_image}"
                      alt="${project.owner.name} Profile image"
                      width="140"
                      height="140"
                    />
                    <h2>${project.owner.name}</h2>
                    <p>
                    ${project.owner.bio}
                    </p>
                  </div>
                    <blockquote class="blockquote mb-0">
                    <p>${project.description.substring(0, 150)}</p>
                    <p>
                    <a class="btn btn-secondary" href="${projectURL}${
        project.id
      }" role="button" target="_blank"
                      >View Project »</a
                    >
                  </p>
                    <footer class="blockquote-footer">Developer: 
                      <cite title="Source Title">${project.owner.name}</cite>
                    </footer>
                    </blockquote>
                    <button
                    type="button"
                    class="btn btn-lg btn-block btn-outline-primary vote--option" data-vote="up" data-project="${
                      project.id
                    }"
                  >
                    &#43; Up Vote
                  </button>
                  <button
                    type="button"
                    class="btn btn-lg btn-block btn-outline-primary vote--option" data-vote="down" data-project="${
                      project.id
                    }"
                  >
                    &#8722; Down Vote
                  </button>
                </div>
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
  let voteBtns = document.getElementsByClassName('vote--option');

  for (let i = 0; voteBtns.length > i; i++) {
    voteBtns[i].addEventListener('click', (e) => {
      let token = localStorage.getItem('token');
      console.log('TOKEN:', token);
      let vote = e.target.dataset.vote;
      let project = e.target.dataset.project;

      fetch(`${baseURL}api/projects/${project}/vote/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ value: vote }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Success:', data);
          alert('Vote Successful!');
          getProjects();
        });
    });
  }
};

getProjects();
