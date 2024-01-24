const emojis = ["🌍", "🪐", "🌕", "🍭", "💎", "🎁", "🧿", "🔮", "🎨", "🎲", "🚀", "🛸", "🦋", "🐞", "❤️", "🌀", "🪺", "🍄", "🐚", "🪹", "🌹", "🌺", "🌼", "🌻", "🪴", "🍁"];

const pickRandom = (array, items) =>
{
    const clonedArray = [...array];
    const randomPicks = [];

    for (let index = 0; index < items; index++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length);
        randomPicks.push(clonedArray[randomIndex]);
        clonedArray.splice(randomIndex, 1);
    }

    return randomPicks;
};

const shuffle = array => {
    const clonedArray = [...array];

    for (let index = clonedArray.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        const original = clonedArray[index];
        clonedArray[index] = clonedArray[randomIndex];
        clonedArray[randomIndex] = original;
    }
    return clonedArray;
}

const reshuffle = (dimensions) =>
{
    const picks = pickRandom(emojis, (dimensions * dimensions) / 2);
    const items = shuffle([...picks, ...picks]);
    return items;
};

export { reshuffle };