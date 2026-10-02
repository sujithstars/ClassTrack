const studentForm = document.getElementById("studentForm");
let editingRow = null;
studentForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const studentName = document.getElementById("studentName").value;
    const parentName = document.getElementById("parentName").value;
    const mobile = document.getElementById("mobile").value;
    const studentClass = document.getElementById("studentClass").value;
    const board = document.getElementById("board").value;
    if (editingRow !== null) {

        editingRow.cells[0].textContent = studentName;
        editingRow.cells[1].textContent = parentName;
        editingRow.cells[2].textContent = mobile;
        editingRow.cells[3].textContent = studentClass;
        editingRow.cells[4].textContent = board;
    
        editingRow = null;
    
        studentForm.reset();
    
        alert("Student Updated Successfully!");
    
        return;
    }
    const tableBody = document.getElementById("studentTableBody");

    const newRow = tableBody.insertRow();

    newRow.insertCell(0).textContent = studentName;
    newRow.insertCell(1).textContent = parentName;
    newRow.insertCell(2).textContent = mobile;
    newRow.insertCell(3).textContent = studentClass;
    newRow.insertCell(4).textContent = board;
    const actionCell = newRow.insertCell(5);

const editButton = document.createElement("button");

editButton.textContent = "Edit";

editButton.onclick = function () {
    editingRow = newRow;

    document.getElementById("studentName").value =
        newRow.cells[0].textContent;
    
    document.getElementById("parentName").value =
        newRow.cells[1].textContent;

    document.getElementById("mobile").value =
        newRow.cells[2].textContent;

    document.getElementById("studentClass").value =
        newRow.cells[3].textContent;

    document.getElementById("board").value =
        newRow.cells[4].textContent;
};

const deleteButton = document.createElement("button");

deleteButton.textContent = "Delete";

deleteButton.onclick = function () {
    newRow.remove();
};

actionCell.appendChild(editButton);
actionCell.appendChild(deleteButton);
    alert("Student Added Successfully!");

    studentForm.reset();
    const searchStudent = document.getElementById("searchStudent");

searchStudent.addEventListener("keyup", function () {

    const searchText = searchStudent.value.toLowerCase();

    const rows = document.querySelectorAll("#studentTableBody tr");

    rows.forEach(function (row) {

        const studentName = row.cells[0].textContent.toLowerCase();

        if (studentName.includes(searchText)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }

    });

});
});