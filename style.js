

const loginTab =
document.getElementById("loginTab");

const signupTab =
document.getElementById("signupTab");

const loginForm =
document.getElementById("loginForm");

const signupForm =
document.getElementById("signupForm");

const authContainer =
document.getElementById("authContainer");

const dashboard =
document.getElementById("dashboard");

const addTaskBtn =
document.getElementById("addTaskBtn");

const taskList =
document.getElementById("taskList");

const taskTitle =
document.getElementById("taskTitle");

const taskDescription =
document.getElementById("taskDescription");

const taskDate =
document.getElementById("taskDate");

const taskHours =
document.getElementById("taskHours");

const totalTasks =
document.getElementById("totalTasks");

const completedTasks =
document.getElementById("completedTasks");

const pendingTasks =
document.getElementById("pendingTasks");

const searchInput =
document.getElementById("searchInput");

const themeToggle =
document.getElementById("themeToggle");

const logoutBtn =
document.getElementById("logoutBtn");

const dashboardBtn =
document.getElementById("dashboardBtn");

const tasksBtn =
document.getElementById("tasksBtn");

const statsBtn =
document.getElementById("statsBtn");

const notesBtn =
document.getElementById("notesBtn");

const notesSection =
document.getElementById("notesSection");

const saveNoteBtn =
document.getElementById("saveNoteBtn");

const noteInput =
document.getElementById("noteInput");

const statsSection =
document.getElementById("statsSection");



let tasks =
JSON.parse(localStorage.getItem("tasks")) || [];

let users =
JSON.parse(localStorage.getItem("users")) || [];

let currentUser =
JSON.parse(localStorage.getItem("currentUser")) || null;

let savedNote =
localStorage.getItem("quickNote") || "";

noteInput.value = savedNote;



loginTab.onclick = ()=>{

  loginTab.classList.add("active");

  signupTab.classList.remove("active");

  loginForm.classList.remove("hidden");

  signupForm.classList.add("hidden");

};

signupTab.onclick = ()=>{

  signupTab.classList.add("active");

  loginTab.classList.remove("active");

  signupForm.classList.remove("hidden");

  loginForm.classList.add("hidden");

};

// =========================
// SIGNUP
// =========================

signupForm.addEventListener("submit",(e)=>{

  e.preventDefault();

  const user = {

    name:
    document.getElementById("signupName").value,

    email:
    document.getElementById("signupEmail").value,

    password:
    document.getElementById("signupPassword").value

  };

  users.push(user);

  localStorage.setItem(
    "users",
    JSON.stringify(users)
  );

  alert("Account Created!");

  signupForm.reset();

});



loginForm.addEventListener("submit",(e)=>{

  e.preventDefault();

  const email =
  document.getElementById("loginEmail").value;

  const password =
  document.getElementById("loginPassword").value;

  const foundUser = users.find(user=>

    user.email === email &&
    user.password === password

  );

  if(foundUser){

    localStorage.setItem(
      "currentUser",
      JSON.stringify(foundUser)
    );

    showDashboard();

  }else{

    alert("Wrong Email Or Password");

  }

});



function showDashboard(){

  authContainer.classList.add("hidden");

  dashboard.classList.remove("hidden");

  renderTasks();

}



if(currentUser){

  showDashboard();

}



if(Notification.permission !== "granted"){

  Notification.requestPermission();

}



addTaskBtn.addEventListener("click",()=>{

  if(

    taskTitle.value === "" ||
    taskDescription.value === "" ||
    taskDate.value === ""

  ){

    alert("Fill All Fields");

    return;

  }

  const task = {

    id:Date.now(),

    title:taskTitle.value,

    description:taskDescription.value,

    date:taskDate.value,

    hours:taskHours.value,

    completed:false

  };

  tasks.push(task);

  scheduleNotification(task);

  saveTasks();

  taskTitle.value = "";

  taskDescription.value = "";

  taskDate.value = "";

  taskHours.value = "";

});



function saveTasks(){

  localStorage.setItem(
    "tasks",
    JSON.stringify(tasks)
  );

  renderTasks();

}



function renderTasks(filteredTasks = tasks){

  taskList.innerHTML = "";

  filteredTasks.forEach(task=>{

    const div =
    document.createElement("div");

    div.className =
    `glass-card task-card
    ${task.completed ? "completed" : ""}`;

    div.innerHTML = `

      <h3>${task.title}</h3>

      <p>${task.description}</p>

      <small>
      Due: ${task.date}
      </small>

      <br><br>

      <small>
      Hours Needed:
      ${task.hours} h
      </small>

      <div class="task-footer">

        <span class="
        status
        ${task.completed ? "done" : "pending"}
        ">

        ${task.completed ? "Completed" : "Pending"}

        </span>

        <div class="task-actions">

          <button
          class="action-btn complete"
          onclick="toggleTask(${task.id})">

          <i class="fa-solid fa-check"></i>

          </button>

          <button
          class="action-btn edit"
          onclick="editTask(${task.id})">

          <i class="fa-solid fa-pen"></i>

          </button>

          <button
          class="action-btn delete"
          onclick="deleteTask(${task.id})">

          <i class="fa-solid fa-trash"></i>

          </button>

        </div>

      </div>

    `;

    taskList.appendChild(div);

  });

  updateStats();

}



function updateStats(){

  totalTasks.innerText =
  tasks.length;

  const completed =
  tasks.filter(task=>
  task.completed).length;

  completedTasks.innerText =
  completed;

  pendingTasks.innerText =
  tasks.length - completed;

}



function toggleTask(id){

  tasks = tasks.map(task=>{

    if(task.id === id){

      task.completed =
      !task.completed;

    }

    return task;

  });

  saveTasks();

}



function deleteTask(id){

  tasks =
  tasks.filter(task=>
  task.id !== id);

  saveTasks();

}



function editTask(id){

  const task =
  tasks.find(task=>
  task.id === id);

  const newTitle =
  prompt("Edit Title",task.title);

  const newDesc =
  prompt(
    "Edit Description",
    task.description
  );

  if(newTitle && newDesc){

    task.title = newTitle;

    task.description = newDesc;

    saveTasks();

  }

}



searchInput.addEventListener("input",()=>{

  const value =
  searchInput.value.toLowerCase();

  const filtered =
  tasks.filter(task=>

    task.title
    .toLowerCase()
    .includes(value)

  );

  renderTasks(filtered);

});



const filterButtons =
document.querySelectorAll(".filter-btn");

filterButtons.forEach(btn=>{

  btn.addEventListener("click",()=>{

    document
    .querySelector(".filter-btn.active")
    .classList.remove("active");

    btn.classList.add("active");

    const filter =
    btn.dataset.filter;

    if(filter === "all"){

      renderTasks(tasks);

    }

    else if(filter === "completed"){

      renderTasks(

        tasks.filter(task=>
        task.completed)

      );

    }

    else{

      renderTasks(

        tasks.filter(task=>
        !task.completed)

      );

    }

  });

});



const savedTheme =
localStorage.getItem("theme");

if(savedTheme === "dark"){

  document.body.classList.add("dark");

}

themeToggle.addEventListener("click",()=>{

  document.body.classList.toggle("dark");

  if(document.body.classList.contains("dark")){

    localStorage.setItem(
      "theme",
      "dark"
    );

    themeToggle.innerHTML =
    `<i class="fa-solid fa-sun"></i>`;

  }else{

    localStorage.setItem(
      "theme",
      "light"
    );

    themeToggle.innerHTML =
    `<i class="fa-solid fa-moon"></i>`;

  }

});


saveNoteBtn.addEventListener("click",()=>{

  localStorage.setItem(
    "quickNote",
    noteInput.value
  );

  alert("Note Saved!");

});



dashboardBtn.onclick = ()=>{

  window.scrollTo({

    top:0,

    behavior:"smooth"

  });

};

tasksBtn.onclick = ()=>{

  taskList.scrollIntoView({

    behavior:"smooth"

  });

};

statsBtn.onclick = ()=>{

  statsSection.scrollIntoView({

    behavior:"smooth"

  });

};

notesBtn.onclick = ()=>{

  notesSection.classList.remove("hidden");

  notesSection.scrollIntoView({

    behavior:"smooth"

  });

};


logoutBtn.addEventListener("click",()=>{

  localStorage.removeItem(
    "currentUser"
  );

  location.reload();

});


function scheduleNotification(task){

  const dueDate =
  new Date(task.date).getTime();

  const now =
  new Date().getTime();

  const timeLeft =
  dueDate - now;

  if(timeLeft > 0){

    setTimeout(()=>{

      new Notification(

        "Task Reminder 🔔",

        {

          body:
          `${task.title} is due now!`

        }

      );

    }, timeLeft);

  }

}



document.addEventListener("mousemove",(e)=>{

  const mouseX =
  (e.clientX / window.innerWidth) * 100;

  const mouseY =
  (e.clientY / window.innerHeight) * 100;

  document.body.style.setProperty(
    "--mouseX",
    mouseX + "%"
  );

  document.body.style.setProperty(
    "--mouseY",
    mouseY + "%"
  );

});






