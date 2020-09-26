let currIndex = 0;
const searchActivator = 'emo:';

document.addEventListener('keydown', event => {
    const key = event.key.toLowerCase();

    if (searchActivator.indexOf(key) === -1) return;

    if(key == searchActivator.charAt(currIndex)) {
        currIndex++;
    } else {
        currIndex = 0;
    }

    if(currIndex == 4) {
        currIndex = 0;
        console.log("Search activated");
    }
});
