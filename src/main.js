document.addEventListener('DOMContentLoaded', () => {
    // DOM element references
    const listInput = document.querySelector('.lists input');
    const addButton = document.querySelector('.add-list-btn');
    const deleteListButton = document.querySelector('.delete-list-btn');
    const taskInputContainer = document.querySelector('.task-input-container');
    const taskInput = document.querySelector('.task-input');
    const addTaskBtn = document.querySelector('.add-task-btn');
    const deleteCompletedTasksBtn = document.createElement('button');
    const listNamesDiv = document.querySelector('.list-names');
    const listTitleHeader = document.querySelector('.list-title h1');
    const tasksContainer = document.querySelector('.list-tasks');

    // Application state
    let lists = [];
    let currentListIndex = null;

    // Initially hide the task input container
    taskInputContainer.style.display = 'none';

    // Configure the button to delete completed tasks
    deleteCompletedTasksBtn.innerHTML = '<div class="material-symbols-outlined">done</div>';
    deleteCompletedTasksBtn.className = 'delete-completed-tasks-btn flex justify-center self-end bg-green-500 text-white p-1 mt-4';

    // Load existing lists from local storage
    loadLists();

    // Event listeners for adding lists and tasks
    addButton.addEventListener('click', function() {
        const name = listInput.value.trim();
        if (name) {
            addList(name);
            listInput.value = '';
        }
    });

    deleteListButton.addEventListener('click', function() {
        if (currentListIndex !== null) {
            lists.splice(currentListIndex, 1);
            saveLists();
            updateUI();
            currentListIndex = null;
            taskInputContainer.style.display = 'none';
        }
    });

    addTaskBtn.addEventListener('click', function() {
        if (currentListIndex !== null && taskInput.value.trim() !== '') {
            addTaskToCurrentList(taskInput.value.trim());
            taskInput.value = '';
        }
    });

    deleteCompletedTasksBtn.addEventListener('click', function() {
        if (currentListIndex !== null) {
            lists[currentListIndex].tasks = lists[currentListIndex].tasks.filter(task => !task.done);
            saveLists();
            displayTasks(currentListIndex);
        }
    });

    // Event listener for selecting a list
    listNamesDiv.addEventListener('click', function(e) {
        if (e.target.classList.contains('list-name-item')) {
            const listIndex = parseInt(e.target.getAttribute('data-index'));
            listTitleHeader.textContent = lists[listIndex].name;
            highlightSelectedItem(e.target);
            currentListIndex = listIndex;
            displayTasks(listIndex);
            taskInputContainer.style.display = 'flex';
        }
    });

    // Function to add a new list
    function addList(name) {
        lists.push({ name: name, tasks: [] });
        saveLists();
        updateUI();
    }

    // Function to add a task to the current list
    function addTaskToCurrentList(taskName) {
        lists[currentListIndex].tasks.push({ name: taskName, done: false });
        saveLists();
        displayTasks(currentListIndex);
    }

    // Function to update the UI
    function updateUI() {
        listNamesDiv.innerHTML = '';
        lists.forEach((list, index) => {
            let div = document.createElement('div');
            div.textContent = list.name;
            div.setAttribute('data-index', index);
            div.classList.add('list-name-item', 'my-2', 'w-9/12', 'ml-7', 'border-2', 'border-solid', 'text-wrap', 'cursor-pointer', 'border-gray-500');
            listNamesDiv.appendChild(div);
        });
        if (currentListIndex === null) {
            taskInputContainer.style.display = 'none';
        }
    }

    // Function to display tasks for the selected list, including text wrapping
    function displayTasks(listIndex) {
        tasksContainer.innerHTML = '';
        lists[listIndex].tasks.forEach((task, taskIndex) => {
            const taskDiv = document.createElement('div');
            taskDiv.className = `task-item flex justify-between items-center border-2 border-solid cursor-pointer border-gray-500 p-2 mb-2 ${task.done ? 'text-gray-500 line-through' : 'text-black'}`;

            // Task name display with text wrapping
            const taskNameDiv = document.createElement('div');
            taskNameDiv.textContent = task.name;
            taskNameDiv.className = 'whitespace-normal flex-grow'; // Ensures text wraps and task name takes available space

            // Edit button
            const editBtn = document.createElement('button');
            editBtn.innerHTML = 'Edit';
            editBtn.className = 'edit-task-btn ml-2 bg-blue-300 text-gray-100 p-1';
            editBtn.addEventListener('click', () => editTask(taskIndex, listIndex));

            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = 'Delete';
            deleteBtn.className = 'delete-task-btn ml-2 bg-red-500 text-white p-1';
            deleteBtn.addEventListener('click', () => deleteTask(taskIndex, listIndex));

            // Button container for edit and delete buttons
            const btnContainer = document.createElement('div');
            btnContainer.appendChild(editBtn);
            btnContainer.appendChild(deleteBtn);

            // Appending task name and buttons to the task container
            taskDiv.appendChild(taskNameDiv);
            taskDiv.appendChild(btnContainer);

            tasksContainer.appendChild(taskDiv);
        });

        if (lists[listIndex].tasks.length > 0) {
            tasksContainer.appendChild(deleteCompletedTasksBtn);
        }
    }

    // Function to edit a task
    function editTask(taskIndex, listIndex) {
        const newName = prompt('Edit task name:', lists[listIndex].tasks[taskIndex].name);
        if (newName !== null && newName.trim() !== '') {
            lists[listIndex].tasks[taskIndex].name = newName.trim();
            saveLists();
            displayTasks(listIndex);
        }
    }

    // Function to delete a task
    function deleteTask(taskIndex, listIndex) {
        lists[listIndex].tasks.splice(taskIndex, 1);
        saveLists();
        displayTasks(listIndex);
    }

    // Function to save lists to local storage
    function saveLists() {
        localStorage.setItem('lists', JSON.stringify(lists));
    }

    // Function to load lists from local storage
    function loadLists() {
        const savedLists = localStorage.getItem('lists');
        if (savedLists) {
            lists = JSON.parse(savedLists);
            updateUI();
        }
    }

    // Function to highlight the selected list item
    function highlightSelectedItem(selectedItem) {
        document.querySelectorAll('.list-name-item').forEach(item => {
            item.classList.remove('bg-blue-500');
        });
        selectedItem.classList.add('bg-blue-500');
    }
}); 
