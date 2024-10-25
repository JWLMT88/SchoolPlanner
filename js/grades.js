const dataStore = new DataStore();
const gradeForm = document.getElementById('gradeForm');
const subjectInput = document.getElementById('subjectInput');
const gradeInput = document.getElementById('gradeInput');
const gradeList = document.getElementById('gradeList');
const gradeChart = document.getElementById('gradeChart');

let chart;

const renderGrades = () => {
    gradeList.innerHTML = dataStore.grades.map(grade => `
        <div class="grade-item">
            <span>${grade.subject}: ${grade.grade}</span>
            <button class="delete-btn" data-id="${grade.id}">Delete</button>
        </div>
    `).join('');

    renderChart();
};

const renderChart = () => {
    const ctx = gradeChart.getContext('2d');
    
    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dataStore.grades.map(grade => grade.subject),
            datasets: [{
                label: 'Grades',
                data: dataStore.grades.map(grade => grade.grade),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
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

const addGrade = (e) => {
    e.preventDefault();
    const subject = subjectInput.value.trim();
    const grade = parseFloat(gradeInput.value);
    if (subject && !isNaN(grade)) {
        dataStore.addGrade(subject, grade);
        subjectInput.value = '';
        gradeInput.value = '';
        renderGrades();
    }
};

const deleteGrade = (id) => {
    dataStore.deleteGrade(id);
    renderGrades();
};

gradeForm.addEventListener('submit', addGrade);
gradeList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        deleteGrade(e.target.dataset.id);
    }
});

renderGrades();