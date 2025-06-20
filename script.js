document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('task-input');
    const addBtn = document.getElementById('add-btn');
    const taskList = document.getElementById('task-list');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const tasksLeft = document.getElementById('tasks-left');
    const clearCompletedBtn = document.getElementById('clear-completed');
    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';
    
    // Initialize the app
    function init() {
        renderTasks();
        updateTaskCounter();
        addBtn.addEventListener('click', addTask);
        taskInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') addTask();
        });
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentFilter = this.dataset.filter;
                renderTasks();
            });
        });
        
        clearCompletedBtn.addEventListener('click', clearCompletedTasks);
    }
    
    // Add a new task
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText) {
            const newTask = {
                id: Date.now(),
                text: taskText,
                completed: false
            };
            tasks.push(newTask);
            saveTasks();
            taskInput.value = '';
            renderTasks();
            updateTaskCounter();
        }
    }
    
    // Render tasks based on current filter
    function renderTasks() {
        taskList.innerHTML = '';
        
        let filteredTasks = tasks;
        if (currentFilter === 'active') {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (currentFilter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        }
        
        if (filteredTasks.length === 0) {
            taskList.innerHTML = '<p class="empty-message">No tasks found</p>';
            return;
        }
        
        filteredTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskItem.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
                <span class="task-text">${task.text}</span>
                <button class="delete-btn" data-id="${task.id}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;
            taskList.appendChild(taskItem);
        });
        
        // Add event listeners to new elements
        document.querySelectorAll('.task-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', toggleTaskComplete);
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', deleteTask);
        });
    }
    
    // Toggle task completion status
    function toggleTaskComplete(e) {
        const taskId = parseInt(e.target.dataset.id);
        const task = tasks.find(task => task.id === taskId);
        if (task) {
            task.completed = e.target.checked;
            saveTasks();
            renderTasks();
            updateTaskCounter();
        }
    }
    
    // Delete a task
    function deleteTask(e) {
        const taskId = parseInt(e.currentTarget.dataset.id);
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
        renderTasks();
        updateTaskCounter();
    }
    
    // Clear all completed tasks
    function clearCompletedTasks() {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
        updateTaskCounter();
    }
    
    // Update the task counter
    function updateTaskCounter() {
        const activeTasks = tasks.filter(task => !task.completed).length;
        tasksLeft.textContent = `${activeTasks} ${activeTasks === 1 ? 'task' : 'tasks'} left`;
    }
    
    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    // Initialize the app
    init();
});