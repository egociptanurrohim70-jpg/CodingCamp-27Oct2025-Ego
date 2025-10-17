// Simple task add script
document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.getElementById('Add-button');
    if (addBtn) addBtn.addEventListener('click', handleAddTask);

    // event delegation for delete buttons in the table
    const table = document.getElementById('Main-table');
    if (table) {
        table.addEventListener('click', (e) => {
            if (e.target && e.target.classList.contains('row-delete')) {
                const tr = e.target.closest('tr');
                if (tr) tr.remove();
            }
        });
    }
});

function handleAddTask(e) {
    const taskInput = document.getElementById('Input-Text');
    const dateInput = document.getElementById('Input-Date');
    if (!taskInput) return;
    const taskText = taskInput.value.trim();
    const dueDate = dateInput ? dateInput.value : '';

    if (!taskText) {
        // nothing to add
        taskInput.focus();
        return;
    }

    const table = document.getElementById('Main-table');
    if (!table) return;
    const tbody = table.tBodies[0] || table.querySelector('tbody');
    if (!tbody) return;

    const noTaskTd = document.getElementById('No-Task');
    if (noTaskTd) {
        // transform the placeholder single cell into a normal 4-cell row
        const tr = noTaskTd.closest('tr');
        if (!tr) return;

        // change the existing td to be the task cell
        noTaskTd.colSpan = 1;
        noTaskTd.textContent = taskText;
        noTaskTd.id = ''; // remove placeholder id

        // create due date cell
        const dueTd = document.createElement('td');
        dueTd.id = 'No-DueDate';
        dueTd.textContent = dueDate || '';

        // create status cell (empty for now)
        const statusTd = document.createElement('td');
        statusTd.textContent = '';

        // create action cell with a delete button
        const actionTd = document.createElement('td');
        actionTd.innerHTML = '<button class="row-delete">Delete</button>';

        tr.appendChild(dueTd);
        tr.appendChild(statusTd);
        tr.appendChild(actionTd);
    } else {
        // append a new row
        const tr = document.createElement('tr');
        const taskTd = document.createElement('td');
        taskTd.textContent = taskText;

        const dueTd = document.createElement('td');
        dueTd.textContent = dueDate || '';

        const statusTd = document.createElement('td');
        statusTd.textContent = '';

        const actionTd = document.createElement('td');
        actionTd.innerHTML = '<button class="row-delete">Delete</button>';

        tr.appendChild(taskTd);
        tr.appendChild(dueTd);
        tr.appendChild(statusTd);
        tr.appendChild(actionTd);

        tbody.appendChild(tr);
    }

    // clear inputs
    taskInput.value = '';
    if (dateInput) dateInput.value = '';
}
