const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = [];

// Show modal, Focus on Input
function showModal() {
    modal.classList.add('show-modal');
    websiteNameEl.focus(); // cursor will be on the first line
}

//Validate form - if space or odd characters are added or if fields left empty
function validate(nameValue, urlValue) { //resource info from https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g; // note /g; was added to this as per example on site
    const regex = new RegExp(expression);
    if (!nameValue || !urlValue){
        alert('Please enter values for both fields');
        return false;
    }
    // if (urlValue.match(regex)) {    can be removed since we only want to validate and alert if things are not matching.
    //     alert('match');
    // }
    if (!urlValue.match(regex)) {
        alert('Please provide a valid web address');
        return false;
    }
    // Valid
    return true;
}   

// Build bookmarks DOM
function buildBookmarks() {
    // Remove all bookmart elements
    bookmarksContainer.textContent = ''; 
    // Build items
    bookmarks.forEach((bookmark) => {

        const { name, url } = bookmark;
        // Item Div
        const item = document.createElement('div');
        item.classList.add('item');
        //Close icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas', 'fa-trash-alt');
        closeIcon.setAttribute('title', 'Delete Bookmark'); // will allow to hover over the delete icon revealing the title delete bookmark
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`); // will delete the url using the function deleteBookmark()
        //Favicon / link container
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        //Favicon
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://www.google.com/s2/u/0/favicons?domain=${url}`);
        favicon.setAttribute('alt', 'Favicon');
        //Link
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank'); // will open the link on new page
        link.textContent = name;
        // Append to bookmarks container
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item);
    });
}

// Modal Event listener
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', (e) => (e.target === modal) ? modal.classList.remove('show-modal') : false); // clicking outside of modal to close it. 

// Fetch bookmarks from localStorage
function fetchBookmarks() {
    // Get bookmarks from localStorage if available
    if (localStorage.getItem('bookmarks')) { // if there is bookmarksthen
        bookmarks = JSON.parse(localStorage.getItem('bookmarks')); // parse() is used to unstringify the data
    } else {
        // create bookmarks array in localStorage if there is no bookmarks key in localStorage
        bookmarks = [
            {
                name: 'google',
                url: 'https://google.com',
            },
        ];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

// Delete bookmark
function deleteBookmark(url) {
    bookmarks.forEach((bookmark, i) => {
        if (bookmark.url === url) // if url passed into the function matches bookmark url from the bookmarks array then:
            bookmarks.splice(i, 1); // i reference the index of the individual book mark, and the second parameter for splice is 1 denoting deleting just one item 
        });
    //update bookmarks array in localStorage, re-populate the DOM
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
}

// Handle Data from Form
function storeBookmark(e) {
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    if (!urlValue.includes('https://') && !urlValue.includes('http://')) {
        urlValue = `https://${urlValue}`;
    }
    // console.log(nameValue, urlValue);
    if (!validate(nameValue, urlValue)) { // we want to stop the process if after validate returns false, but if validate function returns true, then it can proceed after this function
        return false;
    }
    // bookmark object key and value settings & pushing the bookmarks to the local storage uding JSON.stringify to convert to string for servers.
    const bookmark = {
        name: nameValue,
        url: urlValue,
    };
    bookmarks.push(bookmark); // will add the objects into bookmarks array
//  console.log(JSON.stringify(bookmarks));
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks)); // title of bookmarks with the bookmarks array being set to local storage
    fetchBookmarks();
    bookmarkForm.reset(); // will reset the form
    websiteUrlEl.focus(); // arrow will move to websiteUrlEl
}


// Event Listener
bookmarkForm.addEventListener('submit', storeBookmark);

// on load, fetch bookmarks from localStorage
fetchBookmarks();



