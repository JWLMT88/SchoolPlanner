
const dataStore = new DataStore();
const renderTaskProgress = () => {
    const taskProgress = document.getElementById('taskProgress');
    const completedTasks = dataStore.tasks.filter(task => task.completed).length;
    const totalTasks = dataStore.tasks.length;
    const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    taskProgress.innerHTML = `
        <p>Completed Tasks: ${completedTasks} / ${totalTasks}</p>
        <progress value="${percentage}" max="100"></progress>
    `;
};

const renderUpcomingEvents = () => {
    const upcomingEvents = document.getElementById('upcomingEvents');
    const sortedEvents = dataStore.events
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3);

    upcomingEvents.innerHTML = sortedEvents.map(event => `
        <div class="event-item">
            <span>${event.title}</span>
            <span>${new Date(event.date).toLocaleDateString()}</span>
        </div>
    `).join('');
};

const renderGradeOverview = () => {
    const gradeOverview = document.getElementById('gradeOverview');
    const averageGrade = dataStore.grades.reduce((sum, grade) => sum + grade.grade, 0) / dataStore.grades.length || 0;

    gradeOverview.innerHTML = `
        <p>Average Grade: ${averageGrade.toFixed(2)}</p>
        <canvas id="gradeChart"></canvas>
    `;

    const ctx = document.getElementById('gradeChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dataStore.grades.map(grade => grade.subject),
            datasets: [{
                label: 'Grades',
                data: dataStore.grades.map(grade => grade.grade),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
};

const renderUpcomingReminders = () => {
    const upcomingReminders = document.getElementById('upcomingReminders');
    const sortedReminders = dataStore.reminders
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3);

    upcomingReminders.innerHTML = sortedReminders.map(reminder => `
        <div class="reminder-item">
            <span>${reminder.text}</span>
            <span>${new Date(reminder.date).toLocaleString()}</span>
        </div>
    `).join('');
};

const renderDashboard = () => {
    renderTaskProgress();
    renderUpcomingEvents();
    renderGradeOverview();
    renderUpcomingReminders();
};

document.addEventListener('DOMContentLoaded', renderDashboard);