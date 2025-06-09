const bookmarkImgURL = chrome.runtime.getURL("assets/bookmark.png");
const Problem_Key = "PROBLEM_KEY";

// triggered only on load of webpage
window.addEventListener("load", addBookMarkButton);

const observer = new MutationObserver(() => {
    addBookMarkButton();
})

observer.observe(document.body, {childList: true, subtree: true});

function onProblemsPage() {
    return (window.location.pathname.startsWith('/problemset/') || window.location.pathname.startsWith('/contest/'));
} 

async function addBookMarkButton(){
    console.log("Triggering");
    if (!onProblemsPage() || document.getElementById("add-bookmark-button")) return;
    const bookmarkButton = document.createElement('img');
    bookmarkButton.id = "add-bookmark-button";
    bookmarkButton.src = bookmarkImgURL;
    bookmarkButton.style.height = "20px";
    bookmarkButton.style.width = "20px";
    bookmarkButton.style.marginLeft = "8px"; // adds 8px space


    const header = document.getElementsByClassName("header")[0];
    const firstDiv = header.querySelector("div"); // or header.children[0]
    firstDiv.appendChild(bookmarkButton);

    bookmarkButton.addEventListener("click" , addNewBokkmarkHandler);
    const bookmarks = await getcurrentbookmarks();
}

async function addNewBokkmarkHandler () {
    const currentbookmarks = await getcurrentbookmarks();

    const cf_problem_url = window.location.href;
    const uniq_id = getCodeforcesProblemID(cf_problem_url);
    const problem_name = getProblemName();

    if (currentbookmarks.some((bookmark) => bookmark.id == uniq_id)) return;

    const bookmarkObj = {
        id : uniq_id,
        name : problem_name,
        url : cf_problem_url
    }

    const updatedbookamarks = [...currentbookmarks,bookmarkObj];

    chrome.storage.sync.set({[Problem_Key]: updatedbookamarks}, () =>{
        console.log("Update bookmarks correctlt to ",updatedbookamarks);
    })
}

function getCodeforcesProblemID(url) {
    const parts = url.split('/');
    const contestId = parts[parts.length - 2];
    const index = parts[parts.length - 1];
    return contestId + index;
}

function getProblemName() {
    const titleDiv = document.querySelector('.title');
    if (!titleDiv) {
        console.log("No .title element found.");
        return "";
    }

    // Clone the element to avoid modifying the real DOM
    const clone = titleDiv.cloneNode(true);

    // Remove all child elements (like <img>)
    for (const child of [...clone.children]) {
        clone.removeChild(child);
    }

    // Extract and return trimmed text
    const problemName = clone.textContent.trim();
    console.log("Problem Name:", problemName); // ✅ Print to console
    return problemName;
}

function getcurrentbookmarks() {
    return new Promise((resolve,reject) => {

        chrome.storage.sync.get([Problem_Key], (results) => {
            resolve(results[Problem_Key] || []);
        });
    });
}