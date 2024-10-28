const dataStore = new DataStore();
const calendarGrid = document.getElementById('calendarGrid');
const currentMonthElement = document.getElementById('currentMonth');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const addEventBtn = document.getElementById('addEventBtn');
const eventDialog = document.getElementById('eventDialog');
const eventForm = document.getElementById('eventForm');
const eventTitle = document.getElementById('eventTitle');
const eventDate = document.getElementById('eventDate');
const eventTime = document.getElementById('eventTime');
const eventCourse = document.getElementById('eventCourse');
const eventDescription = document.getElementById('eventDescription');
const cancelEventBtn = document.getElementById('cancelEventBtn');

let currentDate = new Date();

const renderCalendar = () => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    currentMonthElement.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`;

    let calendarHTML = '<div class="calendar-day-header">Sun</div><div class="calendar-day-header">Mon</div><div class="calendar-day-header">Tue</div><div class="calendar-day-header">Wed</div><div class="calendar-day-header">Thu</div><div class="calendar-day-header">Fri</div><div class="calendar-day-header">Sat</div>';

    for (let i = 0; i < startingDay; i++) {
        calendarHTML += '<div class="calendar-day empty"></div>';
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const events = dataStore.events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.toDateString() === date.toDateString();
        });

        calendarHTML += `
            <div class="calendar-day${date.toDateString() === new Date().toDateString() ? ' today' : ''}">
                <div class="day-number">${day}</div>
                <div class="events-container">
                    ${events.map(event => `
                        <div class="event micro-interaction" data-id="${event.id}">
                            <div class="event-title">${event.title}</div>
                            <div class="event-time">${new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    calendarGrid.innerHTML = calendarHTML;
};

const showEventDialog = (date = null) => {
    eventDialog.classList.add('open');
    if (date) {
        eventDate.value = date.toISOString().split('T')[0];
    }
    populateEventCourseSelect();
};

const hideEventDialog = () => {
    eventDialog.classList.remove('open');
    eventForm.reset();
};

const populateEventCourseSelect = () => {
    eventCourse.innerHTML = dataStore.getCourses().map(course => `
        <option value="${course}">${course}</option>
    `).join('');
};

const addEvent = (e) => {
    e.preventDefault();
    const title = eventTitle.value.trim();
    const date = new Date(`${eventDate.value}T${eventTime.value}`);
    const course = eventCourse.value;
    const description = eventDescription.value.trim();

    if (title && date) {
        dataStore.addEvent(title, date, course, description);
        hideEventDialog();
        renderCalendar();
    }
};

const deleteEvent = (id) => {
    dataStore.deleteEvent(id);
    renderCalendar();
};

prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

addEventBtn.addEventListener('click', () => showEventDialog());
cancelEventBtn.addEventListener('click', hideEventDialog);
eventForm.addEventListener('submit', addEvent);

calendarGrid.addEventListener('click', (e) => {
    if (e.target.classList.contains('calendar-day') || e.target.closest('.calendar-day')) {
        const clickedDay = e.target.closest('.calendar-day');
        if (!clickedDay.classList.contains('empty')) {
            const dayNumber = clickedDay.querySelector('.day-number').textContent;
            const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
            showEventDialog(selectedDate);
        }
    }

    if (e.target.classList.contains('event') || e.target.closest('.event')) {
        const eventElement = e.target.closest('.event');
        const eventId = eventElement.dataset.id;
        if (confirm('Do you want to delete this event?')) {
            deleteEvent(eventId);
        }
    }
});

renderCalendar();