const tasks = [];
const taskList = document.getElementById('list');
const addTaskInput = document.getElementById('add');
const tasksCounter = document.getElementById('tasks-counter');

console.log('Working');

function showTasks(task) {
    const li = document.createElement('li');
    li.innerHTML = `
    <input type="checkbox" id="${task.id}" ${task.completed ? 'checked' : ''} class="custom-checkbox">
    <label for="${task.id}">${task.title}</label>
    <img src="delete.png" class="delete" id="${task.id}" />`;
    taskList.append(li);
}

function renderList() {
    taskList.innerHTML = '';
    for (const element of tasks) {
        showTasks(element);
    }
}

function markTaskAsComplete(taskId) {
    for (let task of tasks) {
        if (task.id == taskId) {
            task.completed = !task.completed;
            showNotification("Task marked as completed");
        }
    }
    renderList();
}

function deleteTask(taskId) {
    const newTasks = [];
    for (let task of tasks) {
        if (task.id != taskId) {
            newTasks.push(task);
        }
    }
    tasks.length = 0;
    tasks.push(...newTasks);
    renderList();
    showNotification("Task deleted successfully!")
}

function addTask(task) {
    if (task) {
        tasks.push(task);
        renderList();
        showNotification("Task added successfully!")
        return;
    }
    showNotification("Something went wrong");
}

function showNotification(text) {
    alert(text);
}


function handleInputKeyPress(event) {
    if (event.key === "Enter") {
        const text = event.target.value;

        if (!text) {
            showNotification("Input cannot be empty");
            return;
        }

        const task = {
            title: text,
            id: Date.now(),
            completed: false
        }
        addTask(task);
        renderList();
        event.target.value = '';
    }
}

function handleClickEvents(event) {
    const target = event.target;
    const taskId = target.id;
    if (target.className === 'delete') {
        deleteTask(taskId);
    } else if (target.className === 'custom-checkbox') {
        markTaskAsComplete(taskId);
    }
}


function fetchTodos() {
    fetch('https://jsonplaceholder.typicode.com/todos')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            tasks.push(...data.slice(0, 10));
            renderList();
        })
        .catch(function (err) {
            console.log("Error: " + err.message);
        });
}

function initializeApp() {
    fetchTodos();
    addTaskInput.addEventListener('keyup', handleInputKeyPress);
    document.addEventListener('click', handleClickEvents);
}

initializeApp();