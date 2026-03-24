/*
Program name: HW2.js
Name: Mikhail Maredia
Date Created: March 23, 2026
Version: 2.4
Description: js file for HW2
*/

document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. Top Header Date ---
    const d = new Date();
    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    document.getElementById("date-display").innerHTML = 
        "Today is: " + days[d.getDay()] + ", " + months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();

    // --- 2. Dynamic Date Min/Max for DOB (cannot be future, max 120 years ago) ---
    const dobInput = document.getElementById('dob');
    let todayDate = new Date();
    
    // Set Max Date (Today)
    let maxDateStr = todayDate.toISOString().split('T')[0];
    dobInput.max = maxDateStr;

    // Set Min Date (120 Years Ago)
    let minDateObj = new Date();
    minDateObj.setFullYear(todayDate.getFullYear() - 120);
    let minDateStr = minDateObj.toISOString().split('T')[0];
    dobInput.min = minDateStr;


    // --- 3. Dynamic Slide Bar Value ---
    const painSlider = document.getElementById('pain');
    const painValDisplay = document.getElementById('pain-val');
    
    painSlider.addEventListener('input', function() {
        painValDisplay.innerText = this.value;
    });

    // --- 4. Review Button Logic & Advanced JS Validation ---
    const reviewBtn = document.getElementById('reviewBtn');
    // Reusable validation function used by review and submit
    function validateForm() {
        // Clear all previous error messages
        document.querySelectorAll('.error-msg').forEach(el => el.innerText = "");

        let formIsValid = true;

        // --- VALIDATION: User ID lowercase conversion ---
        let uidInput = document.getElementById('uid');
        uidInput.value = uidInput.value.toLowerCase(); // Convert and re-display instantly

        // --- VALIDATION: Password Match and Username Check ---
        let pwd1 = document.getElementById('pwd1').value;
        let pwd2 = document.getElementById('pwd2').value;
        let uid = uidInput.value;

        if (pwd1 !== pwd2) {
            document.getElementById('err-pwd2').innerText = "ERROR: Passwords do not match.";
            formIsValid = false;
        }

        if (pwd1 !== "" && (pwd1 === uid || (uid !== "" && pwd1.includes(uid)))) {
            document.getElementById('err-pwd1').innerText = "ERROR: Password cannot contain your User ID.";
            formIsValid = false;
        }

        // --- VALIDATION: Textarea double-quote check ---
        let sympInput = document.getElementById('symptoms');
        if (sympInput.value.includes('"')) {
            document.getElementById('err-symptoms').innerText = "ERROR: Double quotes (\") are not allowed.";
            formIsValid = false;
        }

        // --- DATA MANIPULATION: Zip Code Truncation ---
        let zipInput = document.getElementById('zip');
        if (zipInput.value.length > 5) {
            // Truncate to 5 characters and re-display
            zipInput.value = zipInput.value.substring(0, 5);
        }

        // Validate Native HTML 5 Form Requirements
        const formEl = document.getElementById('single-line-form');
        if (!formEl.checkValidity()) {
            // Trigger native HTML5 popup warnings
            formEl.reportValidity();
            formIsValid = false;
        }

        return formIsValid;
    }

    reviewBtn.addEventListener('click', function() {
        if (validateForm()) {
            buildReviewTable();
        }
    });

    // Handle actual form submit: show confirmation at top and clear the form
    const formEl = document.getElementById('single-line-form');
    formEl.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
            const fname = document.getElementById('fname').value.trim();
            const displayName = fname ? fname : 'User';

            const conf = document.getElementById('submit-confirmation');
            conf.innerHTML = `<div class="submit-confirm-box">Thank you, ${displayName}! Your registration has been submitted.</div>`;
            conf.style.display = 'block';

            // Clear form fields and review area
            formEl.reset();
            const reviewArea = document.getElementById('review-area');
            if (reviewArea) reviewArea.style.display = 'none';
            const reviewTable = document.getElementById('review-table');
            if (reviewTable) reviewTable.innerHTML = '';

            // Scroll confirmation into view
            conf.scrollIntoView({ behavior: 'smooth' });
        }
    });

    // --- Subroutine: Generate the Table dynamically ---
    function buildReviewTable() {
        const reviewArea = document.getElementById('review-area');
        const reviewTable = document.getElementById('review-table');
        
        // Un-hide the review area
        reviewArea.style.display = "block";
        
        // Grab data from form
        const fname = document.getElementById('fname').value;
        const mi = document.getElementById('mi').value;
        const lname = document.getElementById('lname').value;
        const dob = document.getElementById('dob').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const addr1 = document.getElementById('addr1').value;
        const addr2 = document.getElementById('addr2').value;
        const city = document.getElementById('city').value;
        const state = document.getElementById('state').value;
        const zip = document.getElementById('zip').value;
        const uid = document.getElementById('uid').value;
        const painLvl = document.getElementById('pain').value;
        
        // Get checked history items
        let historyChecks = document.querySelectorAll('input[name="history"]:checked');
        let historyVals = [];
        historyChecks.forEach((chk) => historyVals.push(chk.value));
        let historyStr = historyVals.length > 0 ? historyVals.join(', ') : "None";

        // Get Vax Radio
        let vaxRadio = document.querySelector('input[name="vax"]:checked');
        let vaxVal = vaxRadio ? vaxRadio.value : "Not selected";

        // Build HTML for the table
        let tableHTML = `
            <tr>
                <th>Name</th>
                <td>${fname} ${mi} ${lname}</td>
                <td class="status-pass">PASS</td>
            </tr>
            <tr>
                <th>Date of Birth</th>
                <td>${dob}</td>
                <td class="status-pass">PASS</td>
            </tr>
            <tr>
                <th>Email</th>
                <td>${email}</td>
                <td class="status-pass">PASS</td>
            </tr>
            <tr>
                <th>Phone</th>
                <td>${phone}</td>
                <td class="status-pass">PASS</td>
            </tr>
            <tr>
                <th>Address</th>
                <td>
                    ${addr1}<br>
                    ${addr2 ? addr2 + '<br>' : ''}
                    ${city}, ${state} ${zip}
                </td>
                <td class="status-pass">PASS</td>
            </tr>
            <tr>
                <th>Requested Info</th>
                <td>
                    <b>Vaccinated:</b> ${vaxVal}<br>
                    <b>Level of Pain:</b> ${painLvl}<br>
                    <b>History:</b> ${historyStr}
                </td>
                <td class="status-pass">PASS</td>
            </tr>
            <tr>
                <th>Account Info</th>
                <td>
                    <b>User ID:</b> ${uid}<br>
                    <b>Password:</b> ********
                </td>
                <td class="status-pass">PASS</td>
            </tr>
        `;

        // Inject the HTML
        reviewTable.innerHTML = tableHTML;
        
        // Scroll smoothly to the review table
        reviewArea.scrollIntoView({ behavior: "smooth" });
    }
});