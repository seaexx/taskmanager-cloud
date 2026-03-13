// API endpoint - will be configured via environment variable in K8s
const API_URL = window.ENV?.API_URL || '';

// Load tasks on page load
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    document.getElementById('taskForm').addEventListener('submit', addTask);
});

async function loadTasks() {
    try {
        const response = await fetch(`${API_URL}/api/tasks`);
        const tasks = await response.json();
        displayTasks(tasks);
    } catch (error) {
        console.error('Error loading tasks:', error);
        document.getElementById('taskList').innerHTML = 
            '<p style="color: red;">Error connecting to server. Check if backend is running.</p>';
    }
}

function displayTasks(tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    
    tasks.forEach(task => {
        const taskDiv = document.createElement('div');
        taskDiv.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        const dueDate = task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date';
        
        taskDiv.innerHTML = `
            <div class="task-content">
                <h3>${task.title}</h3>
                ${task.description ? `<p>${task.description}</p>` : ''}
                <p><small>Due: ${dueDate}</small></p>
            </div>
            <div class="task-actions">
                <button onclick="toggleTask(${task.id})">${task.completed ? 'Undo' : 'Complete'}</button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;
        
        taskList.appendChild(taskDiv);
    });
}

async function addTask(e) {
    e.preventDefault();
    
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const due_date = document.getElementById('dueDate').value;
    
    try {
        await fetch(`${API_URL}/api/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, due_date })
        });
        
        document.getElementById('taskForm').reset();
        loadTasks();
    } catch (error) {
        console.error('Error adding task:', error);
        alert('Failed to add task');
    }
}

async function toggleTask(id) {
    try {
        await fetch(`${API_URL}/api/tasks/${id}`, { method: 'PATCH' });
        loadTasks();
    } catch (error) {
        console.error('Error toggling task:', error);
    }
}

async function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        try {
            await fetch(`${API_URL}/api/tasks/${id}`, { method: 'DELETE' });
            loadTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    }
}
