document.addEventListener("DOMContentLoaded", function () {
  let complaints = [];
  const tableBody = document.getElementById("complaintsTableBody");
  //--------------------- Save complaints to localStorage---------------------
  function saveComplaints() {
    localStorage.setItem("complaints", JSON.stringify(complaints));
  }
  //  --------------------- delete Complaint function---------------------
  function deleteComplaint(index) {
    complaints.splice(index, 1);
    saveComplaints();
    renderTable();
    updateCounts();
  }
  //   ---------------------add new row function---------------------
  function addRow(complaint, index) {
    const newRow = tableBody.insertRow();
    newRow.insertCell(0).textContent = complaint.email;
    newRow.insertCell(1).textContent = complaint.name;
    newRow.insertCell(2).textContent = complaint.priority;
    newRow.insertCell(3).textContent = complaint.type;
    // ---------------------status Select---------------------
    const statusCell = newRow.insertCell(4);
    const statusSelect = document.createElement("select");
    statusCell.style.fontSize = 20;

    statusSelect.classList.add("form-control");
    ["Open", "Closed", "Pending"].forEach((status) => {
      const option = document.createElement("option");
      option.value = status;
      option.textContent = status;
      if (status === complaint.status) {
        option.selected = true;
      }
      statusSelect.appendChild(option);
    });
    statusSelect.addEventListener("change", function () {
      complaint.status = this.value;
      saveComplaints();
      updateCounts();
    });
    statusCell.appendChild(statusSelect);
    statusSelect.style.width = "110px";
    // ---------------------date---------------------
    newRow.insertCell(5).textContent = complaint.date;

    // ---------------------feedback-content---------------------
    const contentCell = newRow.insertCell(6);
    const contentWrapper = document.createElement("div");
    contentWrapper.style.maxHeight = "100px";
    contentWrapper.style.maxWidth = "120px";
    contentWrapper.style.overflowY = "hidden";
    contentWrapper.classList.add("feedback-content");
    contentWrapper.textContent = complaint.content;
    contentWrapper.setAttribute("data-full-content", complaint.content);

    // ---------------------show More Button---------------------
    const showMoreButton = document.createElement("button");
    showMoreButton.textContent = "Show more";
    showMoreButton.addEventListener("click", function () {
      handleShowMoreClick(this);
    });

    contentCell.appendChild(contentWrapper);
    contentCell.appendChild(showMoreButton);
    // ---------------------task completed---------------------
    const completedCell = newRow.insertCell(7);
    const completedCheckbox = document.createElement("input");
    completedCheckbox.type = "checkbox";
    completedCheckbox.checked = complaint.completed;
    completedCheckbox.addEventListener("change", function () {
      complaint.completed = this.checked;
      saveComplaints();
    });
    completedCell.appendChild(completedCheckbox);
    // --------------------- send Email---------------------
    const sendEmailCell = newRow.insertCell(8);
    const sendEmailLink = document.createElement("a");
    sendEmailLink.href = `mailto:${complaint.email}`;
    sendEmailLink.textContent = "Email";
    sendEmailLink.style.background = "rgb(36, 36, 84)";
    sendEmailLink.classList.add("btn", "btn-sm", "btn-primary");
    sendEmailCell.appendChild(sendEmailLink);
    // --------------------- Delete---------------------

    const deleteCell = newRow.insertCell(9);
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("btn", "btn-sm", "btn-danger");
    deleteButton.addEventListener("click", function () {
      if (confirm("Are you sure you want to delete this item?")) {
        deleteComplaint(index);
      }
    });
    deleteCell.appendChild(deleteButton);
  }
  // --------------------- add the complaints ---------------------
  function loadComplaints() {
    const storedComplaints = localStorage.getItem("complaints");
    if (storedComplaints) {
      complaints = JSON.parse(storedComplaints);
    }
  }
  // --------------------- update Counts ---------------------
  function updateCounts() {
    let closedCount = 0;
    let openCount = 0;
    let pendingCount = 0;

    complaints.forEach((complaint) => {
      if (complaint.status === "Closed") {
        closedCount++;
      } else if (complaint.status === "Open") {
        openCount++;
      } else if (complaint.status === "Pending") {
        pendingCount++;
      }
    });

    document.getElementById("closedCounter").textContent = closedCount;
    document.getElementById("openCounter").textContent = openCount;
    document.getElementById("pendingCounter").textContent = pendingCount;
  }
  //  --------------------- ShowMore---------------------
  function handleShowMoreClick(showMoreButton) {
    const parentDiv = showMoreButton.previousElementSibling;
    if (parentDiv.style.maxHeight === "100px") {
      parentDiv.style.maxHeight = "unset";
      showMoreButton.textContent = "Show less";
    } else {
      parentDiv.style.maxHeight = "100px";
      showMoreButton.textContent = "Show more";
    }
  }

  function renderTable() {
    tableBody.innerHTML = "";
    complaints.forEach((complaint, index) => {
      addRow(complaint, index);
    });
  }

  function initializeTable() {
    loadComplaints();
    renderTable();
    updateCounts();
  }

  initializeTable();

  const filterColumn = document.getElementById("filterColumn");
  const filterInput = document.getElementById("filterInput");
  const filterValues = document.getElementById("filterValues");

  filterColumn.addEventListener("change", function () {
    const selectedColumn = filterColumn.value;
    const values = complaints.map((complaint) => {
      switch (selectedColumn) {
        case "0":
          return complaint.email;
        case "1":
          return complaint.name;
        case "2":
          return complaint.priority;
        case "3":
          return complaint.type;
        case "4":
          return complaint.status;
        case "5":
          return complaint.date;
      }
    });
    const uniqueValues = [...new Set(values)];
    filterValues.innerHTML = "";
    uniqueValues.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      filterValues.appendChild(option);
    });
  });
  //   filter
  filterInput.addEventListener("input", function () {
    const filterValue = filterInput.value.toLowerCase();
    const selectedColumn = filterColumn.value;
    tableBody.innerHTML = "";
    complaints.forEach((complaint, index) => {
      const columnValue = (() => {
        switch (selectedColumn) {
          case "0":
            return complaint.email.toLowerCase();
          case "1":
            return complaint.name.toLowerCase();
          case "2":
            return complaint.priority.toLowerCase();
          case "3":
            return complaint.type.toLowerCase();
          case "4":
            return complaint.status.toLowerCase();
          case "5":
            return complaint.date.toLowerCase();
        }
      })();
      if (columnValue.includes(filterValue)) {
        addRow(complaint, index);
      }
    });
  });

  //   Clear Filter
  const clearFilterButton = document.getElementById("clearFilterButton");
  clearFilterButton.addEventListener("click", function () {
    filterInput.value = "";
    renderTable();
    updateCounts();
  });

  tableBody.style.maxHeight = "400px";
});

// download as CVS
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("download-btn")
    .addEventListener("click", function () {
      var table = document.getElementById("complaintsTable");
      var rows = table.rows;
      var csv = [];

      for (var i = 0; i < rows.length; i++) {
        var row = [],
          cols = rows[i].cells;
        for (var j = 0; j < cols.length; j++) {
          var cellText = cols[j].innerText;

          if (cellText.includes(",") || cellText.includes("\n")) {
            cellText = '"' + cellText.replace(/"/g, '""') + '"';
          }

          row.push(cellText);
        }
        csv.push(row.join(","));
      }

      var csvFile = new Blob([csv.join("\n")], { type: "text/csv" });
      var downloadLink = document.createElement("a");
      downloadLink.download = "complaints.csv";
      downloadLink.href = window.URL.createObjectURL(csvFile);
      downloadLink.style.display = "none";

      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    });
});
