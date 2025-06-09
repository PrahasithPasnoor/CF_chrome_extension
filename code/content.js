const bookmarkImgURL = chrome.runtime.getURL("assets/bookmark.png");

window.addEventListener("load", addBookMarkButton);
function addBookMarkButton(){
    const bookmarkButton = document.createElement('img');
    bookmarkButton.id = "add-bookmark-button";
    bookmarkButton.src = bookmarkImgURL;
    bookmarkButton.style.height = "20px";
    bookmarkButton.style.width = "20px";
    bookmarkButton.style.marginLeft = "8px"; // adds 8px space


    const header = document.getElementsByClassName("header")[0];
    const firstDiv = header.querySelector("div"); // or header.children[0]
    firstDiv.appendChild(bookmarkButton);
    // header.insertAdjacentElement("beforeend",bookmarkButton);
}