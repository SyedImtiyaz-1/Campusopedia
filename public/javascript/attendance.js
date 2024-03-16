// Retrieve the username from the cookie
const username = getCookie('username');

// Display the username in the HTML
const usernameElement = document.getElementById('username');
if (usernameElement && username) {
    usernameElement.textContent = username;
}

// 

function markAttendance(status) {
    document.getElementById('statusInput').value = status;
    document.getElementById('dateTimeInput').value = new Date().toISOString();
    document.getElementById('attendanceForm').submit();
}


function markAttendance(status) {
    // Show an alert based on the status
    if (status === 'Present') {
        alert('Attendance marked as Present');
        // Disable both buttons for 5 minutes
        disableButtons();
        // Enable buttons after 5 minutes
        setTimeout(enableButtons, 5 * 60 * 1000); // 5 minutes in milliseconds
    } else if (status === 'Absent') {
        alert('Attendance marked as Absent');
    }
}

function disableButtons() {
    const buttons = document.querySelectorAll('.message, .connect');
    buttons.forEach(button => {
        button.disabled = true;
    });
}

function enableButtons() {
    const buttons = document.querySelectorAll('.message, .connect');
    buttons.forEach(button => {
        button.disabled = false;
    });
}

