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
        this.events = safeJSONParse('events', []);
        this.grades = safeJSONParse('grades', []);
        this.reminders = safeJSONParse('reminders', []);
    }

    addTask(text) {
        const newTask = { id: Date.now().toString(), text, completed: false };
        this.tasks.push(newTask);
        safeLocalStorageSet('tasks', this.tasks);
        return newTask;
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            safeLocalStorageSet('tasks', this.tasks);
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        safeLocalStorageSet('tasks', this.tasks);
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

