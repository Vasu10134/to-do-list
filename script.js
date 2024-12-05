// DOM Elements
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const clearTasksBtn = document.getElementById("clearTasksBtn");
const progressBar = document.getElementById("progressBar");
const themeToggle = document.getElementById("themeToggle");

// Initialize tasks array
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let isDarkMode = JSON.parse(localStorage.getItem("isDarkMode")) || false;

// Apply dark mode preference on load
function applyTheme() {
    if (isDarkMode) {
        document.body.classList.add("dark-mode");
        themeToggle.textContent = "Light Mode";
    } else {
        document.body.classList.remove("dark-mode");
        themeToggle.textContent = "Dark Mode";
    }
}

// Update Progress Bar
function updateProgressBar() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

    progressBar.style.width = `${progress}%`;
    progressBar.textContent = `${Math.round(progress)}%`;
}

// Render tasks
function renderTasks() {
    taskList.innerHTML = ""; // Clear existing tasks
    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.classList.add("list-group-item");

        const taskText = document.createElement("span");
        taskText.textContent = task.name;
        if (task.completed) taskText.classList.add("completed");

        const taskButtons = document.createElement("div");
        taskButtons.classList.add("task-buttons");

        const completeBtn = document.createElement("button");
        completeBtn.classList.add("btn-complete", "btn-sm");
        completeBtn.textContent = task.completed ? "Undo" : "Complete";
        completeBtn.onclick = () => toggleTaskCompletion(index);

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("btn-delete", "btn-sm");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => deleteTask(index);

        taskButtons.appendChild(completeBtn);

        if (task.completed) {
            const undoBtn = document.createElement("button");
            undoBtn.classList.add("btn-undo", "btn-sm");
            undoBtn.textContent = "Undo";
            undoBtn.onclick = () => toggleTaskCompletion(index);
            taskButtons.appendChild(undoBtn);
        }

        taskButtons.appendChild(deleteBtn);

        li.appendChild(taskText);
        li.appendChild(taskButtons);
        taskList.appendChild(li);
    });

    updateProgressBar();
    saveTasksToLocalStorage();
}

// Add new task
function addTask() {
    const taskName = taskInput.value.trim();
    if (!taskName) {
        alert("Please enter a task!");
        return;
    }

    tasks.push({ name: taskName, completed: false });
    taskInput.value = "";
    renderTasks();
}

// Toggle task completion
function toggleTaskCompletion(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
}

// Delete task
function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
}

// Clear all tasks
clearTasksBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear all tasks?")) {
        tasks = [];
        renderTasks();
    }
});

// Save tasks to localStorage
function saveTasksToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Dark Mode Toggle
themeToggle.addEventListener("click", () => {
    isDarkMode = !isDarkMode;
    localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
    applyTheme();
});

// Load tasks from localStorage
function loadTasksFromLocalStorage() {
    renderTasks();
}

// Apply theme and load tasks on page load
applyTheme();
loadTasksFromLocalStorage();

// Event Listeners
addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
});
