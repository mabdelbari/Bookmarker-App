var siteNameInput = document.getElementById('siteName');
var siteUrlInput = document.getElementById('siteUrl');

var tableBody = document.getElementById('tableBody');

var rulesModal = new bootstrap.Modal(document.getElementById('exampleModal'));
var modalBody = document.getElementById('modalBody');

var bookmarks = [];

var siteNameRegex = /^\w{3}(\w*\-*\s*\w+)*$/;
var siteUrlRegex = /^http[s]?:\/\/[\w\-]{1,}(\.[a-z]{2,}){1,2}(\/[\w\-%=\.&?]*)*$/i;


// Check if Localstorage has already data to display 
if (localStorage.getItem("bookmarks") != null) {
    bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
    displayBookmarks();
}

siteNameInput.addEventListener("input", function () {
    validateInput(siteNameInput, siteNameRegex);
});

siteUrlInput.addEventListener("input", function () {
    validateInput(siteUrlInput, siteUrlRegex);
});


function submitBookmark() {
    if (validateInput(siteNameInput, siteNameRegex) && validateInput(siteUrlInput, siteUrlRegex)) {

        if (checkIfFound()) {
            modalBody.innerHTML = `
            <h5 class="fw-bold my-2">You have already added your site name as a bookmark.</h5>
            `;
            rulesModal.show();
        } else {
            addBookmark();
        }

    } else {
        modalBody.innerHTML = `
        <h5 class="fw-bold">Site Name or Url is not valid, Please follow the rules below :</h5>
        <div class="rules">
            <ol class="list-unstyled my-3">
                <li>
                    <i class="fa-regular fa-circle-right p-2"></i>
                    Site name must contain at least 3 characters
                </li>
                <li>
                    <i class="fa-regular fa-circle-right p-2"></i>
                    Site URL must be a valid one
                </li>
            </ol>
        </div>
        `
        rulesModal.show();
    }
}

function addBookmark() {
    var bookmark = {
        siteName: siteNameInput.value,
        siteUrl: siteUrlInput.value
    }

    bookmarks.push(bookmark);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

    displayBookmarks();
    clearInputs();
}

function displayBookmarks() {
    var tableBodyContent = ``;

    for (var i = 0; i < bookmarks.length; i++) {
        tableBodyContent += `
        <tr>
            <td>${i + 1}</td>
            <td>${bookmarks[i].siteName}</td>
            <td><button onclick="visitBookmark(${i});" class="btn btn-visit"><i class="fa-solid fa-eye pe-2"></i>Visit</button></td>
            <td><button onclick="deleteBookmark(${i});" class="btn btn-danger"><i class="fa-solid fa-trash-can pe-2"></i>Delete</button></td>
        </tr>
        `
    }

    tableBody.innerHTML = tableBodyContent;
}

function visitBookmark(index) {
    window.open(bookmarks[index].siteUrl);
}

function deleteBookmark(index) {
    bookmarks.splice(index, 1);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    displayBookmarks();
}

function clearInputs() {
    siteNameInput.value = "";
    siteUrlInput.value = "";
}

function validateInput(input, regex) {
    if (regex.test(input.value)) {
        input.classList.add('is-valid');
        input.classList.remove('is-invalid');
        return true;
    } else {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
        return false;
    }
}

function checkIfFound() {
    var isIncluded = false;
    for (var i = 0; i < bookmarks.length; i++) {
        if (bookmarks[i].siteName.toLowerCase().includes(siteNameInput.value.toLowerCase())) {
            isIncluded = true;
        }
    }

    return isIncluded;
}