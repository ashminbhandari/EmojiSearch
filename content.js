let currIndex = 0;
let searchActivated = false;
const searchActivator = 'emo:';

function isActiveElementTextInput(activeElement) {
    return activeElement instanceof HTMLInputElement &&
        activeElement.type == 'text' ||
        activeElement.type == 'textarea' ||
        activeElement.type == 'search' ||
        activeElement.type == 'input';
}

document.addEventListener('keydown', event => {
    if (searchActivated) {
        triggerEmojiSearch(event);
        return;
    }
    const key = event.key.toLowerCase();
    if (searchActivator.indexOf(key) === -1) return;
    if (key == searchActivator.charAt(currIndex)) currIndex++;
    else currIndex = 0;
    if (currIndex == 4) {
        currIndex = 0;
        searchActivated = true;
        searchKeyword = "";
    }
});

function injectEmoji(emoji) {
    console.log("here");
    console.log(document.activeElement.value);
    console.log(searchActivator + searchKeyword + ":", emoji);
    document.activeElement.value = document.activeElement.value.replaceAll(searchActivator + searchKeyword + ":", emoji);
}

function emojiSearch(keyword) {
    let api = `https://emoji-api.com/emojis?search=${keyword}&access_key=7c90059a85bb007d521847db55fd3505d86454cd`;
    fetch(api)
        .then(response => response.json())
        .then(data => {
            if (data) injectEmoji(data[0].character);
            else injectEmoji(" ");
        })
}

let searchKeyword = "";

function triggerEmojiSearch(event) {
    let validKeys = "abcdefghijklmnopqrstuvwxyz: ";
    const key = event.key.toLowerCase();
    if (event.keyCode == 8 || event.charCode == 8) {
        searchKeyword = searchKeyword.substring(0, searchKeyword.length - 1);
        return;
    } else if (validKeys.indexOf(key) === -1) {
        return;
    } else if (key == ":" || searchKeyword.length == 15) {
        console.log("Searching for " + searchKeyword);
        emojiSearch(searchKeyword);
        searchActivated = false;
        return;
    }
    searchKeyword = searchKeyword + key;
}

