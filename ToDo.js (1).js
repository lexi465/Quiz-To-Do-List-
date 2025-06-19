const subjectInput = document.getElementById('subject-input');
const chaptersInput = document.getElementById('chapters-input');
const timeInput = document.getElementById('time-input');
const addTaskButton = document.getElementById('add-task');
const tasksList = document.getElementById('tasks-list');

let tasks = [];

function renderTasks() {
    tasksList.innerHTML = '';
    tasks.forEach((task, idx) => {
        const li = document.createElement('li');
        li.className = 'task-item' + (task.completed ? ' completed' : '');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;
        checkbox.onchange = () => {
            task.completed = !task.completed;
            renderTasks();
        };

        
        const details = document.createElement('div');
        details.className = 'task-details';
        details.innerHTML = `<strong>Subject:</strong> ${task.subject} <br>
                             <strong>Chapters:</strong> ${task.chapters} <br>
                             <strong>Time:</strong> ${task.time} min`;

        
        const timer = document.createElement('span');
        timer.className = 'task-timer';
        timer.textContent = formatTime(task.remainingTime);

        // Timer controls
        const startBtn = document.createElement('button');
        startBtn.textContent = task.timerRunning ? 'Pause' : 'Start';
        startBtn.onclick = () => toggleTimer(idx);
        startBtn.className = 'timer-btn';

        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Reset';
        resetBtn.onclick = () => resetTimer(idx);
        resetBtn.className = 'timer-btn';

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '❌';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = () => deleteTask(idx);

        li.appendChild(checkbox);
        li.appendChild(details);
        li.appendChild(timer);
        li.appendChild(startBtn);
        li.appendChild(resetBtn);
        li.appendChild(deleteBtn);
        tasksList.appendChild(li);
    });
}

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
}

addTaskButton.addEventListener('click', () => {
    const subject = subjectInput.value.trim();
    const chapters = chaptersInput.value.trim();
    const time = parseInt(timeInput.value);
    if (subject && chapters && time > 0) {
        tasks.push({
            subject,
            chapters,
            time,
            completed: false,
            remainingTime: time * 60,
            timerRunning: false,
            timerInterval: null
        });
        renderTasks();
        subjectInput.value = '';
        chaptersInput.value = '';
        timeInput.value = '';
    }
});

function toggleTimer(idx) {
    const task = tasks[idx];
    if (task.timerRunning) {
        clearInterval(task.timerInterval);
        task.timerRunning = false;
    } else {
        task.timerRunning = true;
        task.timerInterval = setInterval(() => {
            if (task.remainingTime > 0) {
                task.remainingTime--;
                renderTasks();
            } else {
                clearInterval(task.timerInterval);
                task.timerRunning = false;
                alert(`Time's up for ${task.subject}!`);
                renderTasks();
            }
        }, 1000);
    }
    renderTasks();
}

function resetTimer(idx) {
    const task = tasks[idx];
    clearInterval(task.timerInterval);
    task.remainingTime = task.time * 60;
    task.timerRunning = false;
    renderTasks();
}

function deleteTask(idx) {
    if (confirm('Are you sure you want to delete this task?')) {
        const task = tasks[idx];
        if (task.timerInterval) {
            clearInterval(task.timerInterval);
        }
        tasks.splice(idx, 1);
        renderTasks();
    }
}

renderTasks(); 