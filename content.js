let globalEmojiState;

//recursive util to find the deepest child
const findDeepestChild = (parent) => {
    if (!parent.lastElementChild) return parent;
    return findDeepestChild(parent.lastElementChild);
}

//delete element util
const deleteElement = (elem) => {
    if(elem) {
        elem.parentNode.removeChild(elem);
    }
}

//add event listener to keydown events
let searchActivated = false;
let emojiSelectionWizard = false;
const searchActivator = ':';
document.addEventListener('keydown', event => {
    if(event.keyCode == 27 || event.charCode == 27) {
        event.preventDefault();
        injectEmoji('');

    }
    if (searchActivated || emojiSelectionWizard) {
        if(searchActivated) triggerEmojiSearch(event);
        else if(emojiSelectionWizard) whichEmoji(event);
        return;
    }
    const key = event.key.toLowerCase();
    if (searchActivator.indexOf(key) === -1) return;
    if (key == searchActivator) searchActivated = true;
});

//begin recording for search keyword
let searchKeyword = "";
const triggerEmojiSearch = (event) => {
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
const emojiSearch = (keyword) => {
    let api = `https://emoji-api.com/emojis?search=${keyword}&access_key=7c90059a85bb007d521847db55fd3505d86454cd`;
    fetch(api)
        .then(response => response.json())
        .then(data => {
            if (data) {
                globalEmojiState = data;
                emojiSelectionWizard = true;
                emojiSelector(globalEmojiState);
            }
            else injectEmoji("");
        })
        .catch(() => {
            injectEmoji("");
        })
}

//inject emoji into dom element using jquery, using javascript doesn't work properly for websites like messenger,
//instagram comments and such
const injectEmoji = (emoji) => {
    emojiSelectionWizard = false;
    //clear selector, since emoji injected
    let emojiSelector = document.getElementById("emojiSelector");
    deleteElement(emojiSelector);
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

const emojiSelector = (emojis) => {
    //Check if exists already, remove if does
    let emojiSelector = document.getElementById("emojiSelector");
    deleteElement(emojiSelector);
    //Create one new each time
    let div = document.createElement("div");
    div.id = "emojiSelector";
    document.body.appendChild(div);
    centerDiv(div);
    for (let i = 0; i < emojis.length && i < 10; i++) {
        let p = paragraphWithSuperset(emojis[i].character, i);
        div.appendChild(p);
    }
    let p = paragraphWithSuperset('', 'esc');
    div.appendChild(p);
}


//emoji selector styles set
const centerDiv = (div) => {
    div.style.zIndex = Number.MAX_SAFE_INTEGER.toString(2);
    div.style.position = 'fixed';
    div.style.padding = '10px';
    div.style.top = 0;
    div.style.right = 0;
    div.style.color = 'white';
    div.style.background = 'rgba(0, 0, 0, 0.7)';
    div.style.fontSize = '30px';
    div.style.display = 'flex';
    div.style.flexDirection = 'row';
    div.style.justifyContent = 'space-between';
}

//for to create emojis with supersetted nums
const paragraphWithSuperset = (paraText, superSetText) => {
    let p = document.createElement('p');
    p.innerText = paraText;
    let sup = document.createElement('sup');
    sup.innerText = superSetText;
    sup.style.margin = '10px';
    sup.style.fontSize = '15px';
    p.appendChild(sup);
    p.style.margin = '10px';
    return p;
}

//which emoji chosen
const whichEmoji = (event) => {
    let validKeys = "0123456789";
    if (validKeys.indexOf(event.key) === -1) return;
    event.preventDefault();
    injectEmoji(globalEmojiState[event.key].character);
}