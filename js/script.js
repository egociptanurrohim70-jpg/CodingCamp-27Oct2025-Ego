
let tasksDb = [];
let currentFilterStatus = 'All';
let currentFilterText = '';

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, function(m) { return map[m]; });
}

function validateInput(task, date) {
  if (!task || !task.trim() || !date || !date.trim()) {
    alert('Please enter both Task and due Date.');
    return false;
  }
  return true;
}

function addTask() {
  const taskInput = document.getElementById('Input-Text');
  const taskDate = document.getElementById('Input-Date');

  if (!validateInput(taskInput.value, taskDate.value)) return;

  const newTask = {
    task: taskInput.value.trim(),
    date: taskDate.value,
    status: 'Pending' 
  };

  tasksDb.push(newTask);

  taskInput.value = '';
  taskDate.value = '';

  renderTasks();
}

function renderTasks() {
  const tbody = document.querySelector('#Main-table tbody');
  if (!tbody) return;

  
  const filtered = tasksDb.filter(taskObj => {
   
    if (currentFilterStatus && currentFilterStatus !== 'All') {
      if (taskObj.status !== currentFilterStatus) return false;
    }
   
    if (currentFilterText) {
      if (!taskObj.task.toLowerCase().includes(currentFilterText.toLowerCase())) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td id="No-Task" colspan="4">No Task found</td>
      </tr>
    `;
    return;
  }

  
  let html = '';
  filtered.forEach((taskObj, index) => {
    
    const status = taskObj.status;
    let bgColor = '#ffc107';
    let textColor = '#000';
    if (status === 'Done') {
      bgColor = '#28a745'; 
      textColor = '#fff';
    }
    const statusStyle = `style="background-color:${bgColor}; color:${textColor}; padding:4px 8px; border-radius:4px; display:inline-block;"`;

    html += `
      <tr data-index="${index}">
        <td>${escapeHtml(taskObj.task)}</td>
        <td>${escapeHtml(taskObj.date)}</td>
        <td>
          <span class="status-text" ${statusStyle}>${escapeHtml(status)}</span>
          <div class="status-actions" style="margin-top:6px;">
            <button class="set-status" data-index="${index}" data-status="Done" style="background-color:#00FF00;color:#fff;border:none;padding:4px 8px;border-radius:4px;">Done</button>
            <button class="set-status" data-index="${index}" data-status="Pending" style="background-color:#F0DB4F;color:#fff;border:none;padding:4px 8px;border-radius:4px;margin-left:6px;">Pending</button>
          </div>
        </td>
        <td><button class="delete-task" data-index="${index}" style="background-color:#ff0000;color:#fff;border:none;padding:4px 8px;border-radius:4px">Delete</button></td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

function Deletebutton() {
  tasksDb = [];
  renderTasks();
}

function deleteTaskAt(index) {
  if (index >= 0 && index < tasksDb.length) {
    tasksDb.splice(index, 1);
    renderTasks();
  }
}

function setStatusAt(index, status) {
  if (index >= 0 && index < tasksDb.length) {
    tasksDb[index].status = status;
    renderTasks();
  }
}


function applyFilterFromUI() {
  const statusEl = document.getElementById('Filter-Status'); 
  const textEl = document.getElementById('Filter-Text'); 

  currentFilterStatus = statusEl ? statusEl.value : 'All';
  currentFilterText = textEl ? textEl.value.trim() : '';

  renderTasks();
}

function clearFilters() {
  const statusEl = document.getElementById('Filter-Status');
  const textEl = document.getElementById('Filter-Text');

  if (statusEl) statusEl.value = 'All';
  if (textEl) textEl.value = '';

  currentFilterStatus = 'All';
  currentFilterText = '';

  renderTasks();
}

document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.getElementById('Add-button');
  const deleteAllBtn = document.getElementById('Delete-button');
  const tbody = document.querySelector('#Main-table tbody');

  // filter UI elements (if present)
  const filterBtn = document.getElementById('Filter-button');
  const clearFilterBtn = document.getElementById('Clear-Filter');
  const statusSelect = document.getElementById('Filter-Status');
  const textInput = document.getElementById('Filter-Text');

  if (addBtn) addBtn.addEventListener('click', addTask);
  if (deleteAllBtn) deleteAllBtn.addEventListener('click', () => {
    
    if (confirm('Delete all tasks?')) Deletebutton();
  });

  if (filterBtn) filterBtn.addEventListener('click', applyFilterFromUI);

  if (clearFilterBtn) clearFilterBtn.addEventListener('click', clearFilters);

  
  if (statusSelect) statusSelect.addEventListener('change', applyFilterFromUI);
  if (textInput) textInput.addEventListener('input', applyFilterFromUI);

  if (tbody) {
    tbody.addEventListener('click', (e) => {
      // delete button
      const del = e.target.closest('.delete-task');
      if (del) {
        const idx = Number(del.getAttribute('data-index'));
        deleteTaskAt(idx);
        return;
      }

   
      const statusBtn = e.target.closest('.set-status');
      if (statusBtn) {
        const idx = Number(statusBtn.getAttribute('data-index'));
        const status = statusBtn.getAttribute('data-status');
        setStatusAt(idx, status);
      }
    });
  }


  applyFilterFromUI();
});
