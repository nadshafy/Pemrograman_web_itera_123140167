// Memastikan DOM sudah sepenuhnya dimuat
document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const openModalBtn = document.getElementById('open-modal-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const dataModal = document.getElementById('data-modal');
    const modalTitle = document.getElementById('modal-title');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const scheduleForm = document.getElementById('schedule-form');
    const taskForm = document.getElementById('task-form');

    const calendarGrid = document.getElementById('calendar-grid');
    const taskList = document.getElementById('task-list');
    const noTaskMsg = document.getElementById('no-task-msg');
    const calendarMonthYear = document.getElementById('current-month-year');

    const STORAGE_KEY_SCHEDULES = 'dashboardSchedules';
    const STORAGE_KEY_TASKS = 'dashboardTasks';

    const getStorageData = (key) => {
        const dataJSON = localStorage.getItem(key);
        return dataJSON ? JSON.parse(dataJSON) : [];
    };

    const saveStorageData = (key, data) => {
        localStorage.setItem(key, JSON.stringify(data));
    };

    
    class Schedule {
        constructor(id, courseName, lecturerName, date, startTime, endTime, roomLocation, color) {
            this.id = id;
            this.courseName = courseName;
            this.lecturerName = lecturerName;
            this.date = date;
            this.startTime = startTime;
            this.endTime = endTime;
            this.roomLocation = roomLocation;
            this.color = color; 
        }
    }

    class Task {
        constructor(id, taskName, deadline, isDone = false) {
            this.id = id;
            this.taskName = taskName;
            this.deadline = deadline;
            this.isDone = isDone;
        }
    }

    const openModal = () => {
        modalTitle.textContent = 'Tambah Data Baru';
        scheduleForm.reset();
        taskForm.reset();
        document.getElementById('schedule-id').value = '';
        document.getElementById('task-id').value = '';
        dataModal.classList.remove('hidden');
        modalBackdrop.classList.remove('hidden');
    };

    const closeModal = () => {
        dataModal.classList.add('hidden');
        modalBackdrop.classList.add('hidden');
    };

    openModalBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const formId = btn.dataset.form;
            document.querySelectorAll('.form-container').forEach(form => {
                if (form.id === formId) {
                    form.classList.remove('hidden');
                } else {
                    form.classList.add('hidden');
                }
            });
        });
    });

        const renderCalendar = () => {
        calendarGrid.innerHTML = '';
        const today = new Date();
        const schedules = getStorageData(STORAGE_KEY_SCHEDULES);

        const monthYearFormatter = new Intl.DateTimeFormat('id-ID', {
            month: 'long',
            year: 'numeric'
        });
        
        if (calendarMonthYear) {
            calendarMonthYear.textContent = monthYearFormatter.format(today);
        }

        const dayFormatter = new Intl.DateTimeFormat('id-ID', { weekday: 'short' });
        const dateFormatter = new Intl.DateTimeFormat('id-ID', { day: '2-digit' });

        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(today);
            currentDay.setDate(today.getDate() + i);

            const dayName = dayFormatter.format(currentDay);
            const dateNum = dateFormatter.format(currentDay);
            const dateString = currentDay.toISOString().split('T')[0];

            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.innerHTML = `
                <div class="calendar-day-header">
                    <div class="day-name">${dayName}</div>
                    <div class="date-num">${dateNum}</div>
                </div>
                <div class="schedules-container" data-date="${dateString}"></div>
            `;
            
            calendarGrid.appendChild(dayElement);

            const schedulesForDay = schedules.filter(s => s.date === dateString);
            const schedulesContainer = dayElement.querySelector('.schedules-container');
            
            if (schedulesForDay.length > 0) {
                schedulesForDay.forEach(schedule => {
                    renderScheduleEntry(schedule, schedulesContainer);
                });
            }
        }
    };

    const renderScheduleEntry = (schedule, container) => {
        const entry = document.createElement('div');
        entry.className = `schedule-entry ${schedule.color}`;
        entry.dataset.id = schedule.id;

        entry.innerHTML = `
            <strong>${schedule.courseName}</strong>
            <p>${schedule.startTime} - ${schedule.endTime}</p>
            <p>${schedule.roomLocation || ''}</p>
            <div class="entry-actions">
                <button class="entry-action-btn edit-btn edit-schedule-btn" data-id="${schedule.id}" title="Edit">✏️</button>
                <button class="entry-action-btn delete-btn delete-schedule-btn" data-id="${schedule.id}" title="Hapus">🗑️</button>
            </div>
        `;
        container.appendChild(entry);
    };

    const renderTasks = () => {
        taskList.innerHTML = '';
        const tasks = getStorageData(STORAGE_KEY_TASKS);

        if (tasks.length === 0) {
            noTaskMsg.classList.remove('hidden');
        } else {
            noTaskMsg.classList.add('hidden');
            tasks.forEach(task => {
                const taskItem = document.createElement('li');
                taskItem.className = `task-item ${task.isDone ? 'done' : ''}`;
                taskItem.dataset.id = task.id;

                taskItem.innerHTML = `
                    <div class="task-info">
                        <input type="checkbox" class="task-checkbox" data-id="${task.id}" ${task.isDone ? 'checked' : ''}>
                        <div class.task-details">
                            <label for="task-${task.id}">${task.taskName}</label>
                            <span class="deadline">Deadline: ${formatDate(task.deadline)}</span>
                        </div>
                    </div>
                    <div class="task-actions">
                        <button class="entry-action-btn edit-btn edit-task-btn" data-id="${task.id}" title="Edit">✏️</button>
                        <button class="entry-action-btn delete-btn delete-task-btn" data-id="${task.id}" title="Hapus">🗑️</button>
                    </div>
                `;
                taskList.appendChild(taskItem);
            });
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Tanpa deadline';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(date);
    };

    scheduleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const id = document.getElementById('schedule-id').value;
        const courseName = document.getElementById('course-name').value;
        const lecturerName = document.getElementById('lecturer-name').value;
        const date = document.getElementById('schedule-date').value;
        const startTime = document.getElementById('start-time').value.replace(':', '.');
        const endTime = document.getElementById('end-time').value.replace(':', '.');
        const roomLocation = document.getElementById('room-location').value;
        const color = document.querySelector('input[name="color"]:checked').value;

        const scheduleId = id || `sched-${Date.now()}`;
        const newSchedule = new Schedule(scheduleId, courseName, lecturerName, date, startTime, endTime, roomLocation, color);

        let schedules = getStorageData(STORAGE_KEY_SCHEDULES);
        if (id) { // Mode Edit
            schedules = schedules.map(s => s.id === id ? newSchedule : s);
        } else { // Mode Tambah
            schedules.push(newSchedule);
        }

        saveStorageData(STORAGE_KEY_SCHEDULES, schedules);
        renderCalendar();
        closeModal();
    });

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const id = document.getElementById('task-id').value;
        const taskName = document.getElementById('task-name').value;
        const deadline = document.getElementById('task-deadline').value;

        const taskId = id || `task-${Date.now()}`;
        const newTask = new Task(taskId, taskName, deadline);

        let tasks = getStorageData(STORAGE_KEY_TASKS);
        if (id) { 
            const oldTask = tasks.find(t => t.id === id);
            newTask.isDone = oldTask ? oldTask.isDone : false;
            tasks = tasks.map(t => t.id === id ? newTask : t);
        } else {
            tasks.push(newTask);
        }

        saveStorageData(STORAGE_KEY_TASKS, tasks);
        renderTasks();
        closeModal();
    });

    calendarGrid.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const id = target.dataset.id;
        let schedules = getStorageData(STORAGE_KEY_SCHEDULES);

        if (target.classList.contains('delete-schedule-btn')) {
            if (confirm('Yakin ingin menghapus agenda ini?')) {
                schedules = schedules.filter(s => s.id !== id);
                saveStorageData(STORAGE_KEY_SCHEDULES, schedules);
                renderCalendar();
            }
        } else if (target.classList.contains('edit-schedule-btn')) {
            const schedule = schedules.find(s => s.id === id);
            if (!schedule) return;
            
            tabBtns[0].click(); 
            
            document.getElementById('schedule-id').value = schedule.id;
            document.getElementById('course-name').value = schedule.courseName;
            document.getElementById('lecturer-name').value = schedule.lecturerName;
            document.getElementById('schedule-date').value = schedule.date;
            document.getElementById('start-time').value = schedule.startTime.replace('.', ':');
            document.getElementById('end-time').value = schedule.endTime.replace('.', ':');
            document.getElementById('room-location').value = schedule.roomLocation;
            document.querySelector(`input[name="color"][value="${schedule.color}"]`).checked = true;

            modalTitle.textContent = 'Edit Agenda Kuliah';
            dataModal.classList.remove('hidden');
            modalBackdrop.classList.remove('hidden');
        }
    });

    taskList.addEventListener('click', (e) => {
        const target = e.target;
        const id = target.dataset.id;
        let tasks = getStorageData(STORAGE_KEY_TASKS);

        if (target.classList.contains('task-checkbox')) {
            const task = tasks.find(t => t.id === id);
            if (task) {
                task.isDone = target.checked;
                saveStorageData(STORAGE_KEY_TASKS, tasks);
                renderTasks();
            }
        } else if (target.closest('.delete-task-btn')) {
            if (confirm('Yakin ingin menghapus tugas ini?')) {
                tasks = tasks.filter(t => t.id !== id);
                saveStorageData(STORAGE_KEY_TASKS, tasks);
                renderTasks();
            }
        } else if (target.closest('.edit-task-btn')) {
            const task = tasks.find(t => t.id === id);
            if (!task) return;

            tabBtns[1].click();

            document.getElementById('task-id').value = task.id;
            document.getElementById('task-name').value = task.taskName;
            document.getElementById('task-deadline').value = task.deadline;

            modalTitle.textContent = 'Edit Tugas';
            dataModal.classList.remove('hidden');
            modalBackdrop.classList.remove('hidden');
        }
    });

    const runMockDataSimulation = async () => {
        console.log("Memulai simulasi pengambilan data asinkron...");
        try {
            await new Promise(resolve => setTimeout(resolve, 1500)); 
            console.log("Simulasi data berhasil diambil.");
        } catch (error) {
            console.error("Simulasi gagal:", error);
        }
    };

    renderCalendar();
    renderTasks();
    runMockDataSimulation();
});