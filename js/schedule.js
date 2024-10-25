const dataStore = new DataStore();
const eventForm = document.getElementById('eventForm');
const eventTitle = document.getElementById('eventTitle');
const eventDate = document.getElementById('eventDate');
const calendar = document.getElementById('calendar');

const renderCalendar = () => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    
    let calendarHTML = '<table class="calendar"><tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr><tr>';
    
    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startOfWeek);
        currentDate.setDate(startOfWeek.getDate() + i);
        
        const eventsOnThisDay = dataStore.events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.toDateString() === currentDate.toDateString();
        });
        
        calendarHTML += `
            <td>
                <div class="date">${currentDate.getDate()}</div>
                <div class="events">
                    ${eventsOnThisDay.map(event => `
                        <div class="event-item">
                            <span>${event.title}</span>
                            <span>${new Date(event.date).toLocaleTimeString()}</span>
                            <button class="delete-btn" data-id="${event.id}">Delete</button>
                        </div>
                    `).join('')}
                </div>
            </td>
        `;
    }
    
    calendarHTML += '</tr></table>';
    calendar.innerHTML = calendarHTML;
};

const addEvent = (e) => {
    e.preventDefault();
    const title = eventTitle.value.trim();
    const date = eventDate.value;
    if (title && date) {
        dataStore.addEvent(title, date);
        eventTitle.value = '';
        eventDate.value = '';
        renderCalendar();
    }
};

const deleteEvent = (id) => {
    dataStore.deleteEvent(id);
    renderCalendar();
};

eventForm.addEventListener('submit', addEvent);
calendar.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        deleteEvent(e.target.dataset.id);
    }
});

renderCalendar();