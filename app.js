// To-Do List Application

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const todoForm = document.getElementById('todo-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const tasksCounter = document.getElementById('tasks-counter');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const emptyState = document.getElementById('empty-state');
    
    // Task array to store all tasks
    let tasks = [];
    
    // ==== CORE FUNCTIONS ====
    
    /**
     * Load tasks from localStorage if available
     */
    function loadTasks() {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            tasks = JSON.parse(savedTasks);
            renderTasks();
        }
    }
    
    /**
     * Save tasks to localStorage
     */
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    /**
     * Add a new task
     * @param {string} taskText - The text content of the task
     */
    function addTask(taskText) {
        if (taskText.trim() === '') return;
        
        const newTask = {
            id: Date.now(), // Use timestamp as unique ID
            text: taskText,
            completed: false
        };
        
        tasks.push(newTask);
        saveTasks();
        renderTasks();
        
        // Clear input field
        taskInput.value = '';
    }
    
    /**
     * Remove a task
     * @param {number} taskId - The ID of the task to remove
     */
    function removeTask(taskId) {
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
        renderTasks();
    }
    
    /**
     * Toggle task completion status
     * @param {number} taskId - The ID of the task to toggle
     */
    function toggleTaskCompletion(taskId) {
        tasks = tasks.map(task => {
            if (task.id === taskId) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        
        saveTasks();
        renderTasks();
    }
    
    /**
     * Clear all completed tasks
     */
    function clearCompletedTasks() {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
    }
    
    /**
     * Render tasks to the DOM
     */
    function renderTasks() {
        // Update tasks counter
        tasksCounter.textContent = tasks.length;
        
        // Show/hide empty state
        if (tasks.length === 0) {
            emptyState.style.display = 'block';
            taskList.style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            taskList.style.display = 'block';
        }
        
        // Clear existing tasks
        taskList.innerHTML = '';
        
        // Add each task to the list
        tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = `list-group-item task-item d-flex justify-content-between align-items-center ${task.completed ? 'completed' : ''}`;
            
            const taskContent = document.createElement('div');
            taskContent.className = 'd-flex align-items-center';
            
            const checkbox = document.createElement('div');
            checkbox.className = 'form-check';
            
            const checkboxInput = document.createElement('input');
            checkboxInput.className = 'form-check-input me-2';
            checkboxInput.type = 'checkbox';
            checkboxInput.id = `task-${task.id}`;
            checkboxInput.checked = task.completed;
            checkboxInput.addEventListener('change', () => toggleTaskCompletion(task.id));
            
            const taskLabel = document.createElement('label');
            taskLabel.className = 'form-check-label';
            taskLabel.htmlFor = `task-${task.id}`;
            taskLabel.textContent = task.text;
            
            checkbox.appendChild(checkboxInput);
            taskContent.appendChild(checkbox);
            taskContent.appendChild(taskLabel);
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-sm btn-outline-danger';
            deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';
            deleteBtn.addEventListener('click', () => removeTask(task.id));
            
            taskItem.appendChild(taskContent);
            taskItem.appendChild(deleteBtn);
            
            taskList.appendChild(taskItem);
        });
    }
    
    // ==== EVENT LISTENERS ====
    
    // Form submission event for adding tasks
    todoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        addTask(taskInput.value);
    });
    
    // Clear completed tasks button
    clearCompletedBtn.addEventListener('click', clearCompletedTasks);
    
    // Initialize the application
    loadTasks();
});