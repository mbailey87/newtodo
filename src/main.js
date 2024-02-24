document.addEventListener('DOMContentLoaded', () => {
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
    let lists = [];
    let currentListIndex = null;

    taskInputContainer.style.display = 'none'; // Initially hide task input container
    deleteCompletedTasksBtn.innerHTML = '<div class="material-symbols-outlined">done</div>';
    deleteCompletedTasksBtn.className = 'delete-completed-tasks-btn flex justify-center self-end bg-green-500 text-white p-1 mt-4';

    loadLists();

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
            taskInputContainer.style.display = 'none'; // Hide task input container
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

    listNamesDiv.addEventListener('click', function(e) {
        if (e.target.classList.contains('list-name-item')) {
            const listIndex = parseInt(e.target.getAttribute('data-index'));
            listTitleHeader.textContent = lists[listIndex].name;
            highlightSelectedItem(e.target);
            currentListIndex = listIndex;
            displayTasks(listIndex);
            taskInputContainer.style.display = 'flex'; // Show task input container
        }
    });

    function addList(name) {
        lists.push({ name: name, tasks: [] });
        saveLists();
        updateUI();
    }

    function addTaskToCurrentList(taskName) {
        lists[currentListIndex].tasks.push({ name: taskName, done: false });
        saveLists();
        displayTasks(currentListIndex);
    }

    function updateUI() {
        listNamesDiv.innerHTML = '';
        lists.forEach((list, index) => {
            let div = document.createElement('div');
            div.textContent = list.name;
            div.setAttribute('data-index', index);
            div.classList.add('list-name-item', 'my-2', 'w-9/12', 'ml-7', 'border-2', 'border-solid', 'text-wrap', 'cursor-pointer', 'border-gray-500');
            listNamesDiv.appendChild(div);
        });
        // Hide task input container if no list is selected
        if (currentListIndex === null) {
            taskInputContainer.style.display = 'none';
        }
    }

    function displayTasks(listIndex) {
        tasksContainer.innerHTML = '';
        lists[listIndex].tasks.forEach((task, taskIndex) => {
            const taskDiv = document.createElement('div');
            taskDiv.textContent = task.name;
            taskDiv.className = `task-item ${task.done ? 'text-gray-500 line-through' : 'text-black'}`;
            taskDiv.addEventListener('click', () => {
                task.done = !task.done;
                saveLists();
                displayTasks(listIndex);
                const taskDiv = document.createElement('div');
                taskDiv.textContent = task.name;
                taskDiv.className = `task-item ${task.class} ${task.done ? 'text-gray-500 line-through' : 'text-black'}`;
            });
            tasksContainer.appendChild(taskDiv);
        });
        // Add the delete completed tasks button if there are tasks
        if (lists[listIndex].tasks.length > 0) {
            tasksContainer.appendChild(deleteCompletedTasksBtn);
        }
    }

    function saveLists() {
        localStorage.setItem('lists', JSON.stringify(lists));
    }

    function loadLists() {
        const savedLists = localStorage.getItem('lists');
        if (savedLists) {
            lists = JSON.parse(savedLists);
            updateUI();
        }
    }

    function highlightSelectedItem(selectedItem) {
        document.querySelectorAll('.list-name-item').forEach(item => {
            item.classList.remove('bg-blue-500');
        });
        selectedItem.classList.add('bg-blue-500');
    }
});
