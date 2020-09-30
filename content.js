let globalEmojiState;

//search emoji util
const getMatchingEmojis = (searchKeyword, obj) => {
    return Object.keys(obj).filter((objKey) => {
        searchKeyword = searchKeyword.toLowerCase();
        if (objKey.includes(searchKeyword)) return true;
        let keyWords = obj[objKey]["keywords"];
        for (let i = 0; i < keyWords.length; i++) {
            if (keyWords[i].includes(searchKeyword)) return true;
        }
    });
}

//recursive util to find the deepest child
const findDeepestChild = (parent) => {
    if (!parent.lastElementChild) return parent;
    return findDeepestChild(parent.lastElementChild);
}

//delete element util
const deleteElement = (elem) => {
    if (elem) {
        elem.parentNode.removeChild(elem);
    }
}

//add event listener to keydown events
let searchActivated = false;
const searchActivator = ':';
document.addEventListener('keydown', event => {
    if (event.keyCode == 27 || event.charCode == 27) {
        event.preventDefault();
        injectEmoji("");
    }
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
const triggerEmojiSearch = (event) => {
    let validKeys = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz: ";
    const key = event.key.toLowerCase();
    if (event.keyCode == 8 || event.charCode == 8) {
        searchKeyword = searchKeyword.substring(0, searchKeyword.length - 1);
        return;
    } else if (validKeys.indexOf(key) === -1) {
        return;
    } else if (event.keyCode == 32 || searchKeyword.length == 15) {
        searchActivated = false;
        return;
    }
    searchKeyword = searchKeyword + key;
    emojiSearch(searchKeyword);
}

//call emoji api to map keyword to emoji - may have to use own implementation here
const emojiSearch = (keyword) => {
    let emoArr = getMatchingEmojis(keyword, emojisList);
    if (!emoArr) injectEmoji("");
    if (emoArr.length > 10) {
        emoArr.length = 10;
    }
    globalEmojiState = emoArr;
    console.log(globalEmojiState);
    emojiSelector(globalEmojiState);
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
        let p = paragraphWithSuperset(emojisList[emojis[i]]["char"], i);
        div.appendChild(p);
    }
    let p = paragraphWithSuperset('', 'esc');
    div.appendChild(p);
}

//inject emoji into dom element using jquery, using javascript doesn't work properly for websites like messenger,
//instagram comments and such
const injectEmoji = (emoji) => {
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
    injectEmoji(emojisList[globalEmojiState[event.key]]["char"]);
}