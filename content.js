let currIndex = 0;
let searchActivated = false;
const searchActivator = 'emo:';

document.addEventListener('keydown', event => {
    if (searchActivated) {
        triggerEmojiSearch(event);
        return;
    }

    const key = event.key.toLowerCase();

    if (searchActivator.indexOf(key) === -1) return;

    if (key == searchActivator.charAt(currIndex)) {
        currIndex++;
    } else {
        currIndex = 0;
    }

    if (currIndex == 4) {
        currIndex = 0;
        if (isActiveElementTextInput(document.activeElement)) {
            console.log("search activated");
            searchActivated = true;
        }
    }
});

function isActiveElementTextInput(activeElement) {
    return activeElement instanceof HTMLInputElement &&
        activeElement.type == 'text' ||
        activeElement.type == 'textarea' ||
        activeElement.type == 'search';
}

function emojiSearch(keyword) {
    let api = `https://emoji-api.com/emojis?search=${keyword}&access_key=7c90059a85bb007d521847db55fd3505d86454cd`;
    fetch(api)
        .then(response => response.json())
        .then(data => console.log(data));
}

let searchKeyword = "";

function triggerEmojiSearch(event) {
    let validKeys = "abcdefghijklmnopqrstuvwxyz:";

    const key = event.key.toLowerCase();

    if (event.keyCode == 8 || event.charCode == 8) {
        searchKeyword = searchKeyword.substring(0, searchKeyword.length - 1);
        return;
    } else if (validKeys.indexOf(key) === -1) {
        return;
    } else if (key == ":" || searchKeyword.length == 15) {
        console.log("Searching for " + searchKeyword);
        emojiSearch(searchKeyword);
        searchKeyword = "";
        searchActivated = false;
        return;
    }

    searchKeyword = searchKeyword + key;
}

