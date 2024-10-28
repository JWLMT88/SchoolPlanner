const safeJSONParse = (key, fallback) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch (error) {
        console.error(`Error parsing ${key} from localStorage:`, error);
        return fallback;
    }
};

const safeLocalStorageSet = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error setting ${key} in localStorage:`, error);
    }
};

class DataStore {
    constructor() {
        this.tasks = safeJSONParse('tasks', []);
        this.grades = safeJSONParse('grades', []);
        this.reminders = safeJSONParse('reminders', []);
        this.userName = '';
        this.courses = [];
        this.loadUserProfile();
        this.loadEvents();
    }

    setUserName(name) {
        this.userName = name;
        this.saveUserProfile();
    }

    getUserName() {
        return this.userName;
    }

    setCourses(courses) {
        this.courses = courses;
        this.saveUserProfile();
    }

    getCourses() {
        return this.courses;
    }

    saveUserProfile() {
        localStorage.setItem('userProfile', JSON.stringify({
            userName: this.userName,
            courses: this.courses
        }));
    }

    loadUserProfile() {
        const userProfile = JSON.parse(localStorage.getItem('userProfile'));
        if (userProfile) {
            this.userName = userProfile.userName;
            this.courses = userProfile.courses;
        }
    }
    addEvent(title, date, course, description) {
        const event = {
            id: Date.now().toString(),
            title,
            date,
            course,
            description
        };
        this.events.push(event);
        this.saveEvents();
    }

    deleteEvent(id) {
        this.events = this.events.filter(event => event.id !== id);
        this.saveEvents();
    }

    saveEvents() {
        localStorage.setItem('events', JSON.stringify(this.events));
    }

    loadEvents() {
        const events = JSON.parse(localStorage.getItem('events'));
        if (events) {
            this.events = events;
        }
    }

    addTask(text, course, description, materials) {
        const task = {
            id: Date.now().toString(),
            text,
            course,
            description,
            materials,
            completed: false
        };
        this.tasks.push(task);
        this.saveTasks();
    }

    toggleTask(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        if (tasks) {
            this.tasks = tasks;
        }
    }

    addEvent(title, date) {
        const newEvent = { id: Date.now().toString(), title, date };
        this.events.push(newEvent);
        safeLocalStorageSet('events', this.events);
        return newEvent;
    }

    deleteEvent(id) {
        this.events = this.events.filter(e => e.id !== id);
        safeLocalStorageSet('events', this.events);
    }

    addGrade(subject, grade) {
        const newGrade = { id: Date.now().toString(), subject, grade: Number(grade) };
        this.grades.push(newGrade);
        safeLocalStorageSet('grades', this.grades);
        return newGrade;
    }

    deleteGrade(id) {
        this.grades = this.grades.filter(g => g.id !== id);
        safeLocalStorageSet('grades', this.grades);
    }

    addReminder(text, date) {
        const newReminder = { id: Date.now().toString(), text, date };
        this.reminders.push(newReminder);
        safeLocalStorageSet('reminders', this.reminders);
        return newReminder;
    }

    deleteReminder(id) {
        this.reminders = this.reminders.filter(r => r.id !== id);
        safeLocalStorageSet('reminders', this.reminders);
    }
}

