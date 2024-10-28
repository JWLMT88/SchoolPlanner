const dataStore = new DataStore();
const renderTaskProgress = () => {
    const taskProgress = document.getElementById('taskProgress');
    const completedTasks = dataStore.tasks.filter(task => task.completed).length;
    const totalTasks = dataStore.tasks.length;
    const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    taskProgress.innerHTML = `
        <p>Completed Tasks: ${completedTasks} / ${totalTasks}</p>
        <div class="progress-container" style="background-color: #e0e0e0; border-radius: 5px; height: 10px; overflow: hidden;">
            <div class="progress-bar" style="width: ${percentage}%;"></div>
        </div>
    `;
};

const renderUpcomingEvents = () => {
    const upcomingEvents = document.getElementById('upcomingEvents');
    const sortedEvents = dataStore.events
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3);

    upcomingEvents.innerHTML = sortedEvents.map(event => `
        <div class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div class="flex-1">
                        <h4 class="font-medium text-gray-800">${event.title}</h4>
                        <p class="text-sm text-gray-500">${new Date(event.date).toLocaleDateString()}</p>
                    </div>
                    <span class="text-xs font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
                        ${event.course}
                    </span>
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
                backgroundColor: 'rgba(76, 201, 240, 0.6)',
                borderColor: 'rgba(76, 201, 240, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeInOutQuart'
            }
        }
    });
};

const renderUpcomingReminders = () => {
    const upcomingReminders = document.getElementById('upcomingReminders');
    const upcomingNotifications = document.getElementById('notification-counter');
    const sortedReminders = dataStore.reminders
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3);
        const priorityColors = {
            High: 'bg-red-100 text-red-600',
            Medium: 'bg-yellow-100 text-yellow-600',
            Low: 'bg-green-100 text-green-600'
        };

    upcomingNotifications.innerText = sortedReminders.length ;

    upcomingReminders.innerHTML = sortedReminders.map(reminder => `
        <div class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div class="flex-1">
                        <h4 class="font-medium text-gray-800">${reminder.text}</h4>
                        <p class="text-sm text-gray-500">Due: ${new Date(reminder.date).toLocaleString()}</p>
                    </div>
                    <span class="text-xs font-medium ${priorityColors[reminder.priority]} px-2 py-1 rounded-full">
                        ${reminder.priority}
                    </span>
                </div>
    `).join('');
};

const renderDashboard = () => {
    renderTaskProgress();
    renderUpcomingEvents();
    renderGradeOverview();
    renderUpcomingReminders();
    
    document.getElementById("welcome-text").innerText = "Welcome back, " + dataStore.getUserName() + "!";
};

document.addEventListener('DOMContentLoaded', renderDashboard);