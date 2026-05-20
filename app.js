// ==============================
//  DATA
// ==============================
const SUBJECTS = ['Math', 'Science', 'English', 'History', 'CS'];
const BAR_COLORS = ['#2563eb', '#0d9488', '#db2777', '#d97706', '#7c3aed'];

let students = [
  { name: 'Aarav Sharma',    marks: [88, 92, 76, 81, 95] },
  { name: 'Priya Patel',     marks: [72, 68, 85, 79, 88] },
  { name: 'Rohan Mehta',     marks: [91, 87, 83, 90, 78] },
  { name: 'Sneha Iyer',      marks: [65, 70, 60, 55, 72] },
  { name: 'Arjun Nair',      marks: [45, 52, 48, 40, 38] },
  { name: 'Kavya Reddy',     marks: [80, 77, 90, 85, 82] },
  { name: 'Vikram Singh',    marks: [58, 63, 55, 60, 50] },
  { name: 'Ananya Das',      marks: [95, 98, 88, 92, 97] },
  { name: 'Karan Joshi',     marks: [74, 71, 68, 75, 80] },
  { name: 'Divya Kumar',     marks: [83, 79, 87, 88, 76] },
  { name: 'Siddharth Rao',   marks: [55, 60, 50, 48, 62] },
  { name: 'Meera Gupta',     marks: [90, 85, 92, 89, 94] },
];

// ==============================
//  HELPERS
// ==============================
function getTotal(s)  { return s.marks.reduce((a, b) => a + b, 0); }
function getAvg(s)    { return Math.round(getTotal(s) / SUBJECTS.length); }

function getGrade(avg) {
  if (avg >= 90) return 'A';
  if (avg >= 75) return 'B';
  if (avg >= 60) return 'C';
  if (avg >= 45) return 'D';
  return 'F';
}

function gradeBadgeClass(g) {
  return { A: 'badge-pass', B: 'badge-pass', C: 'badge-avg', D: 'badge-avg', F: 'badge-fail' }[g];
}

// ==============================
//  METRICS CARDS
// ==============================
function renderMetrics() {
  const avgs     = students.map(getAvg);
  const classAvg = Math.round(avgs.reduce((a, b) => a + b, 0) / avgs.length);
  const passed   = students.filter(s => getAvg(s) >= 45).length;
  const highest  = Math.max(...avgs);
  const lowest   = Math.min(...avgs);

  document.getElementById('metrics').innerHTML = `
    <div class="metric">
      <div class="metric-label">Total students</div>
      <div class="metric-value purple">${students.length}</div>
    </div>
    <div class="metric">
      <div class="metric-label">Class average</div>
      <div class="metric-value blue">${classAvg}%</div>
    </div>
    <div class="metric">
      <div class="metric-label">Pass rate</div>
      <div class="metric-value green">${Math.round(passed / students.length * 100)}%</div>
    </div>
    <div class="metric">
      <div class="metric-label">Highest avg</div>
      <div class="metric-value green">${highest}%</div>
    </div>
    <div class="metric">
      <div class="metric-label">Lowest avg</div>
      <div class="metric-value red">${lowest}%</div>
    </div>
  `;
}

// ==============================
//  CHARTS
// ==============================
let barChart, doughnut, lineChart;

function initCharts() {
  const subjectAvgs = SUBJECTS.map((_, i) =>
    Math.round(students.reduce((a, s) => a + s.marks[i], 0) / students.length)
  );

  // Bar chart — subject averages
  const ctx1 = document.getElementById('barChart').getContext('2d');
  if (barChart) barChart.destroy();
  barChart = new Chart(ctx1, {
    type: 'bar',
    data: {
      labels: SUBJECTS,
      datasets: [{
        data: subjectAvgs,
        backgroundColor: BAR_COLORS,
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { min: 0, max: 100, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 11 } } },
        x: { grid: { display: false }, ticks: { font: { size: 11 } } }
      }
    }
  });

  // Doughnut — grade distribution
  const grades = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  students.forEach(s => { grades[getGrade(getAvg(s))]++; });

  const ctx2 = document.getElementById('doughnut').getContext('2d');
  if (doughnut) doughnut.destroy();
  doughnut = new Chart(ctx2, {
    type: 'doughnut',
    data: {
      labels: Object.keys(grades),
      datasets: [{
        data: Object.values(grades),
        backgroundColor: ['#16a34a', '#2563eb', '#d97706', '#db2777', '#dc2626'],
        borderWidth: 0,
        hoverOffset: 4,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right', labels: { font: { size: 11 }, padding: 12 } }
      },
      cutout: '62%'
    }
  });

  // Line chart — top 5 students
  const top5 = [...students].sort((a, b) => getAvg(b) - getAvg(a)).slice(0, 5);
  const ctx3 = document.getElementById('lineChart').getContext('2d');
  if (lineChart) lineChart.destroy();
  lineChart = new Chart(ctx3, {
    type: 'line',
    data: {
      labels: SUBJECTS,
      datasets: top5.map((s, i) => ({
        label: s.name.split(' ')[0],
        data: s.marks,
        borderColor: BAR_COLORS[i],
        backgroundColor: 'transparent',
        tension: 0.35,
        pointRadius: 4,
        borderWidth: 2,
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { font: { size: 11 }, padding: 12 } } },
      scales: {
        y: { min: 0, max: 100, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 11 } } },
        x: { grid: { display: false }, ticks: { font: { size: 11 } } }
      }
    }
  });

  // Horizontal bar rows
  document.getElementById('subjectBars').innerHTML = SUBJECTS.map((sub, i) => `
    <div class="bar-row">
      <div class="bar-label">${sub}</div>
      <div class="bar-track">
        <div class="bar-fill" style="width:${subjectAvgs[i]}%; background:${BAR_COLORS[i]}"></div>
      </div>
      <div class="bar-val">${subjectAvgs[i]}%</div>
    </div>
  `).join('');
}

// ==============================
//  STUDENT TABLE
// ==============================
function renderTable() {
  const search  = document.getElementById('search').value.toLowerCase();
  const filterG = document.getElementById('filterGrade').value;
  const sortK   = document.getElementById('sortBy').value;

  let list = [...students];
  if (search)  list = list.filter(s => s.name.toLowerCase().includes(search));
  if (filterG) list = list.filter(s => getGrade(getAvg(s)) === filterG);
  if (sortK === 'total') list.sort((a, b) => getTotal(b) - getTotal(a));
  else if (sortK === 'avg') list.sort((a, b) => getAvg(b) - getAvg(a));
  else list.sort((a, b) => a.name.localeCompare(b.name));

  document.getElementById('studentTable').innerHTML = list.map((s, i) => {
    const a = getAvg(s), g = getGrade(a), pass = a >= 45;
    const realIdx = students.indexOf(s);
    return `<tr>
      <td style="color:#6b7280">${i + 1}</td>
      <td style="font-weight:600">${s.name}</td>
      ${s.marks.map(m => `<td>${m}</td>`).join('')}
      <td style="font-weight:600">${getTotal(s)}</td>
      <td>${a}%</td>
      <td><span class="badge ${gradeBadgeClass(g)}">${g}</span></td>
      <td><span class="badge ${pass ? 'badge-pass' : 'badge-fail'}">${pass ? 'Pass' : 'Fail'}</span></td>
      <td><button class="btn btn-danger" onclick="deleteStudent(${realIdx})"><i class="ti ti-trash"></i></button></td>
    </tr>`;
  }).join('');

  // Top 3 performers
  const top3 = [...students].sort((a, b) => getAvg(b) - getAvg(a)).slice(0, 3);
  document.getElementById('topStudents').innerHTML = top3.map((s, i) => `
    <div class="top-student-row">
      <span class="rank-badge ${['r1','r2','r3'][i]}">${i + 1}</span>
      <span style="flex:1;font-weight:500">${s.name}</span>
      <span style="color:#6b7280;font-size:13px">${getAvg(s)}% avg</span>
      <span class="badge ${gradeBadgeClass(getGrade(getAvg(s)))}">${getGrade(getAvg(s))}</span>
    </div>
  `).join('');
}

// ==============================
//  ADD / DELETE STUDENT
// ==============================
function addStudent() {
  const name  = document.getElementById('newName').value.trim();
  const marks = [
    +document.getElementById('nMath').value,
    +document.getElementById('nSci').value,
    +document.getElementById('nEng').value,
    +document.getElementById('nHist').value,
    +document.getElementById('nCS').value,
  ];
  const msg = document.getElementById('addMsg');

  if (!name) {
    msg.textContent = 'Please enter a student name.';
    msg.style.color = '#dc2626';
    return;
  }
  if (marks.some(m => isNaN(m) || m < 0 || m > 100)) {
    msg.textContent = 'Enter valid marks between 0 and 100 for all subjects.';
    msg.style.color = '#dc2626';
    return;
  }

  students.push({ name, marks });
  ['newName', 'nMath', 'nSci', 'nEng', 'nHist', 'nCS'].forEach(id => {
    document.getElementById(id).value = '';
  });

  msg.textContent = `✓ ${name} added successfully!`;
  msg.style.color = '#16a34a';
  setTimeout(() => { msg.textContent = ''; }, 3000);

  renderAll();
}

function deleteStudent(index) {
  if (!confirm(`Remove ${students[index].name}?`)) return;
  students.splice(index, 1);
  renderAll();
}

// ==============================
//  EXPORT CSV
// ==============================
function exportCSV() {
  const header = ['Name', ...SUBJECTS, 'Total', 'Average', 'Grade', 'Status'];
  const rows = students.map(s => {
    const a = getAvg(s);
    return [s.name, ...s.marks, getTotal(s), a, getGrade(a), a >= 45 ? 'Pass' : 'Fail'];
  });

  const csv = [header, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'student_performance.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// ==============================
//  TAB SWITCHING
// ==============================
function switchTab(tab) {
  document.querySelectorAll('.nav-btn').forEach((btn, i) => {
    btn.classList.toggle('active', ['overview', 'students', 'add'][i] === tab);
  });
  document.querySelectorAll('.pane').forEach(p => p.classList.remove('active'));
  document.getElementById('pane-' + tab).classList.add('active');
}

// ==============================
//  INIT
// ==============================
function renderAll() {
  renderMetrics();
  initCharts();
  renderTable();
}

renderAll();
