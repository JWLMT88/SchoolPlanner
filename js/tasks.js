const dataStore = new DataStore();
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

const renderTasks = () => {
    taskList.innerHTML = dataStore.tasks.map(task => `
        <li class="task-item" draggable="true" data-id="${task.id}">
            <input type="checkbox" ${task.completed ? 'checked' : ''}>
            <span>${task.text}</span>
            <button class="delete-btn">Delete</button>
        </li>
    `).join('');

    // Add event listeners for drag and drop
    taskList.querySelectorAll('.task-item').forEach(taskItem => {
        taskItem.addEventListener('dragstart', dragStart);
        taskItem.addEventListener('dragover', dragOver);
        taskItem.addEventListener('drop', drop);
    });
};

const addTask = (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (text) {
        dataStore.addTask(text);
        taskInput.value = '';
        renderTasks();
    }
};

const toggleTask = (id) =>   {
    dataStore.toggleTask(id);
    renderTasks();
};

const deleteTask = (id) => {
    dataStore.deleteTask(id);
    renderTasks();
};

// Drag and drop functionality
let draggedItem = null;

function dragStart(e) {
    draggedItem = e.target;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', e.target.dataset.id);
}

function dragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function drop(e) {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text');
    const dropTarget = e.target.closest('.task-item');
    
    if (dropTarget && draggedItem !== dropTarget) {
        const items = Array.from(taskList.children);
        const fromIndex = items.indexOf(draggedItem);
        const toIndex = items.indexOf(dropTarget);
        
        if (fromIndex < toIndex) {
            taskList.insertBefore(draggedItem, dropTarget.nextSibling);
        } else {
            taskList.insertBefore(draggedItem, dropTarget);
        }
        
        // Update the order in dataStore
        const newTasks = items.map(item => dataStore.tasks.find(task => task.id === item.dataset.id));
        dataStore.tasks = newTasks;
        safeLocalStorageSet('tasks', dataStore.tasks);
    }
}

taskForm.addEventListener('submit', addTask);
taskList.addEventListener('change', (e) => {
    if (e.target.type === 'checkbox') {
        toggleTask(e.target.closest('.task-item').dataset.id);
    }
});
taskList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        deleteTask(e.target.closest('.task-item').dataset.id);
    }
});

renderTasks();