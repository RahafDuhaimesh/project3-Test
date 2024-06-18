
document.addEventListener('DOMContentLoaded', function() {
    let complaints = [];

    const tableBody = document.getElementById('complaintsTableBody'); 

    function saveComplaints() {
        localStorage.setItem('complaints', JSON.stringify(complaints));
    }

    function addRow(complaint) {
        const newRow = tableBody.insertRow();
        newRow.insertCell(0).textContent = complaint.email;
        newRow.insertCell(1).textContent = complaint.name;
        newRow.insertCell(2).textContent = complaint.priority;
        newRow.insertCell(3).textContent = complaint.type;

        const statusCell = newRow.insertCell(4);
        const statusSelect = document.createElement('select');
        statusSelect.classList.add('form-control');
        ['Open', 'Closed', 'Pending'].forEach(status => {
            const option = document.createElement('option');
            option.value = status;
            option.textContent = status;
            if (status === complaint.status) {
                option.selected = true;
            }
            statusSelect.appendChild(option);
        });
        statusSelect.addEventListener('change', function() {
            complaint.status = this.value;
            saveComplaints();
            updateCounts();
        });
        statusCell.appendChild(statusSelect);
        statusSelect.style.width = '110px';

        newRow.insertCell(5).textContent = complaint.date;

        const contentCell = newRow.insertCell(6);

        const contentWrapper = document.createElement('div');
        contentWrapper.style.maxHeight = "100px";
        contentWrapper.style.overflowY = "hidden";
        contentWrapper.classList.add('feedback-content');
        contentWrapper.textContent = complaint.content;
        contentWrapper.setAttribute('data-full-content', complaint.content);

        // showMore button
        const showMoreButton = document.createElement('button');
        showMoreButton.textContent = 'Show more';
        showMoreButton.setAttribute('onclick', 'handleShowMoreClick(this)');
        ///// 
        // add the div then the button
        contentCell.appendChild(contentWrapper);
        contentCell.appendChild(showMoreButton);

        const completedCell = newRow.insertCell(7);
        const completedCheckbox = document.createElement('input');
        completedCheckbox.type = 'checkbox';
        completedCheckbox.checked = complaint.completed;
        completedCheckbox.addEventListener('change', function() {
            complaint.completed = this.checked;
            saveComplaints();
        });
        completedCell.appendChild(completedCheckbox);

        const sendEmailCell = newRow.insertCell(8);
        const sendEmailLink = document.createElement('a');
        sendEmailLink.href = `mailto:${complaint.email}`;
        sendEmailLink.textContent = 'Email';
        sendEmailLink.style.background = 'rgb(36, 36, 84)';
        sendEmailLink.classList.add('btn', 'btn-sm', 'btn-primary');
        sendEmailCell.appendChild(sendEmailLink);
    }

    function loadComplaints() {
        const storedComplaints = localStorage.getItem('complaints');
        if (storedComplaints) {
            complaints = JSON.parse(storedComplaints);
        }
    }

    function updateCounts() {
        let closedCount = 0;
        let openCount = 0;
        let pendingCount = 0;

        complaints.forEach(complaint => {
            if (complaint.status === 'Closed') {
                closedCount++;
            } else if (complaint.status === 'Open') {
                openCount++;
            } else if (complaint.status === 'Pending') {
                pendingCount++;
            }
        });

        document.getElementById('closedCounter').textContent = closedCount;
        document.getElementById('openCounter').textContent = openCount;
        document.getElementById('pendingCounter').textContent = pendingCount;
    }

    function handleShowMoreClick(showMoreButton) {
        const parentDiv = showMoreButton.previousElementSibling;
        if (parentDiv.style.maxHeight == "100px") { // Adjusted to match your CSS
            parentDiv.style.maxHeight = 'unset';
            showMoreButton.textContent = 'Show less'; // Optionally change button text
        } else {
            parentDiv.style.maxHeight = '100px'; // Adjusted to match your CSS
            showMoreButton.textContent = 'Show more'; // Optionally change button text
        }
    }

    function initializeTable() {
        loadComplaints();
        complaints.forEach((complaint, index) => {
            addRow(complaint);
        });
        updateCounts();
    }

    initializeTable();

    const filterColumn = document.getElementById('filterColumn');
    const filterInput = document.getElementById('filterInput');
    const filterValues = document.getElementById('filterValues');

    filterColumn.addEventListener('change', function() {
        const selectedColumn = filterColumn.value;
        const values = complaints.map(complaint => {
            switch (selectedColumn) {
                case '0':
                    return complaint.email;
                case '1':
                    return complaint.name;
                case '2':
                    return complaint.priority;
                case '3':
                    return complaint.type;
                case '4':
                    return complaint.status;
                case '5':
                    return complaint.date;
            }
        });
        const uniqueValues = [...new Set(values)];
        filterValues.innerHTML = '';
        uniqueValues.forEach(value => {
            const option = document.createElement('option');
            option.value = value;
            filterValues.appendChild(option);
        });
    });

    filterInput.addEventListener('input', function() {
        const filterValue = filterInput.value.toLowerCase();
        const selectedColumn = filterColumn.value;
        tableBody.innerHTML = '';
        complaints.forEach((complaint, index) => {
            const columnValue = (() => {
                switch (selectedColumn) {
                    case '0':
                        return complaint.email.toLowerCase();
                    case '1':
                        return complaint.name.toLowerCase();
                    case '2':
                        return complaint.priority.toLowerCase();
                    case '3':
                        return complaint.type.toLowerCase();
                    case '4':
                        return complaint.status.toLowerCase();
                    case '5':
                        return complaint.date.toLowerCase();
                }
            })();
            if (columnValue.includes(filterValue)) {
                addRow(complaint);
            }
        });
    });

    const clearFilterButton = document.getElementById('clearFilterButton');

    clearFilterButton.addEventListener('click', function() {
        filterInput.value = '';
        tableBody.innerHTML = '';
        complaints.forEach(addRow);
        updateCounts();
    });

    tableBody.style.maxHeight = '400px';
});
