// Menunggu hingga seluruh konten halaman (DOM) selesai dimuat
document.addEventListener('DOMContentLoaded', () => {

    const taskForm = document.getElementById('task-form');
    const taskNameInput = document.getElementById('task-name');
    const taskCourseInput = document.getElementById('task-course');
    const taskDeadlineInput = document.getElementById('task-deadline');
    const taskList = document.getElementById('task-list');
    const filterStatus = document.getElementById('filter-status');
    const incompleteTasksCount = document.getElementById('incomplete-tasks-count');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const renderTasks = () => {
        taskList.innerHTML = '';

        const currentFilter = filterStatus.value;
        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'all') return true;
            if (currentFilter === 'complete') return task.isComplete;
            if (currentFilter === 'incomplete') return !task.isComplete;
        });

        filteredTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = `task-item ${task.isComplete ? 'complete' : ''}`;
            taskItem.dataset.id = task.id;

            taskItem.innerHTML = `
                <div class="task-details">
                    <h3>${task.name}</h3>
                    <p><strong>Mata Kuliah:</strong> ${task.course}</p>
                    <p><strong>Deadline:</strong> ${task.deadline}</p>
                </div>
                <div class="task-actions">
                    <button class="complete-btn">${task.isComplete ? 'Batal' : 'Selesai'}</button>
                    <button class="delete-btn">Hapus</button>
                </div>
            `;
            taskList.appendChild(taskItem);
        });

        updateIncompleteCount();
    };
    
    const updateIncompleteCount = () => {
        const count = tasks.filter(task => !task.isComplete).length;
        incompleteTasksCount.textContent = count;
    };
    
    const addTask = (name, course, deadline) => {
        const newTask = {
            id: Date.now(), 
            name,
            course,
            deadline,
            isComplete: false,
        };
        tasks.push(newTask);
        saveTasks();
        renderTasks();
    };

    const deleteTask = (id) => {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    };

    const toggleComplete = (id) => {
        const task = tasks.find(task => task.id === id);
        if (task) {
            task.isComplete = !task.isComplete;
            saveTasks();
            renderTasks();
        }
    };

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault(); 

        const name = taskNameInput.value.trim();
        const course = taskCourseInput.value.trim();
        const deadline = taskDeadlineInput.value;
        
        if (name === '' || course === '' || deadline === '') {
            alert('Semua kolom wajib diisi!');
            return;
        }

        addTask(name, course, deadline);

        taskForm.reset();
    });

    taskList.addEventListener('click', (e) => {
        const target = e.target;
        const taskItem = target.closest('.task-item');
        if (!taskItem) return;

        const taskId = Number(taskItem.dataset.id);

        if (target.classList.contains('delete-btn')) {
            deleteTask(taskId);
        } else if (target.classList.contains('complete-btn')) {
            toggleComplete(taskId);
        }
    });

    filterStatus.addEventListener('change', renderTasks);
    
    renderTasks();
});