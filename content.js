//recursive util to find the deepest child
function findDeepestChild(parent) {
    if (!parent.lastElementChild) return parent;
    return findDeepestChild(parent.lastElementChild);
}

//add event listener to keydown events
let searchActivated = false;
const searchActivator = ':';
document.addEventListener('keydown', event => {
    if (searchActivated) {
        triggerEmojiSearch(event);
        return;
    }
    const key = event.key.toLowerCase();
    if (searchActivator.indexOf(key) === -1) return;
    if (key == searchActivator) searchActivated = true;
});

//begin recording for search keyword
let searchKeyword = "";
function triggerEmojiSearch(event) {
    let validKeys = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz: ";
    const key = event.key.toLowerCase();
    if (event.keyCode == 8 || event.charCode == 8) {
        searchKeyword = searchKeyword.substring(0, searchKeyword.length - 1);
        return;
    } else if (validKeys.indexOf(key) === -1) {
        return;
    } else if (event.keyCode == 32 || searchKeyword.length == 15) {
        emojiSearch(searchKeyword);
        searchActivated = false;
        return;
    }
    searchKeyword = searchKeyword + key;
}

//call emoji api to map keyword to emoji - may have to use own implementation here
function emojiSearch(keyword) {
    let api = `https://emoji-api.com/emojis?search=${keyword}&access_key=7c90059a85bb007d521847db55fd3505d86454cd`;
    fetch(api)
        .then(response => response.json())
        .then(data => {
            if (data) injectEmoji(data[0].character);
            else injectEmoji("");
        })
        .catch(() => {
            injectEmoji("");
        })
}

//inject emoji into dom element using jquery, using javascript doesn't work properly for websites like messenger,
//instagram comments and such
function injectEmoji(emoji) {
    let deepestChild = findDeepestChild(document.activeElement);
    if (deepestChild.value) {
        $(deepestChild).val(function (index, value) {
            return value.substring(0, value.length - searchActivator.length - searchKeyword.length - 1) + emoji;
        });
    } else if (deepestChild.innerText) {
        navigator.clipboard.writeText(emoji).then(() => {
            document.execCommand('paste');
        });
    }
    searchKeyword = "";
}





