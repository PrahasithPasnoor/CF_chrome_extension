const Problem_Key = "PROBLEM_KEY";


const assetURLMap = {
    "play" : chrome.runtime.getURL("assets/play.png"),
    "delete" : chrome.runtime.getURL("assets/delete.png")
}

const bookmarkSection = document.getElementById("bookmarks")

document.addEventListener("DOMContentLoaded",() => {
    chrome.storage.sync.get([Problem_Key], (data) =>{
        const currentbookmarks = data[Problem_Key] || [];
        viewBookmarks(currentbookmarks);
    });
})

function viewBookmarks (bookmarks) {
    bookmarkSection.innerHTML = "";
    if (bookmarks.length ==0) {
        bookmarkSection.innerHTML = "<i>No Bookmarks to Show</i>";
        return;
    }
    bookmarks.forEach(bookmark => addNewBookMark(bookmark));
}

function addNewBookMark(bookmark) {
    const newBookMark = document.createElement('div');
    const bookmarkTitle = document.createElement('div');
    const bookmarkControls = document.createElement('div');

    bookmarkTitle.textContent = bookmark.name;
    bookmarkTitle.classList.add("bookmar-title");
    bookmarkControls.classList.add("bookmark-controls");

    setcontrolattribute(assetURLMap["play"],onPlay,bookmarkControls);
    setcontrolattribute(assetURLMap["delete"],onDelete,bookmarkControls);

    newBookMark.classList.add("bookmark");
    newBookMark.append(bookmarkTitle);
    newBookMark.append(bookmarkControls);
    newBookMark.setAttribute("url",bookmark.url);
    newBookMark.setAttribute("bookmark-id",bookmark.id);
    bookmarkSection.appendChild(newBookMark);
}
function setcontrolattribute(src,handler,parentdiv) {
    const controlElement = document.createElement("img");
    controlElement.src = src;
    controlElement.addEventListener("click",handler);
    parentdiv.appendChild(controlElement);
}
function onPlay(event) {
    const problemurl = event.target.parentNode.parentNode.getAttribute("url");
    window.open(problemurl,"_blank");
}
function onDelete(event) {
    const bookmarkitem = event.target.parentNode.parentNode;
    const idtoremove = bookmarkitem.getAttribute("bookmark-id")
    bookmarkitem.remove();
    deleteItemFromStorage(idtoremove);

}
function deleteItemFromStorage(idtoremove) {
    chrome.storage.sync.get([Problem_Key], (data) => {
        const currentBookmarks = data[Problem_Key] || [];
        console.log("Before delete:", currentBookmarks);
        const updatedbookamarks = currentBookmarks.filter((bookmark) => bookmark.id != idtoremove);
        console.log("After delete:", updatedbookamarks);
        chrome.storage.sync.set({ [Problem_Key]: updatedbookamarks }, () => {
            console.log("Updated storage");
        });
    });
}