function selectCharade(charades, categories) {
    console.log(charades);
    do {
        var numCategories = charades.length;

        if(numCategories === 0) {
            scoreSystem.displayScoreBoard();
            return [null, null];
        }

        var categoryToSelect = (Math.floor(Math.random() * 10) % numCategories);
        var numCharades = charades[categoryToSelect].length;


        if(numCharades === 0){
            charades.splice(categoryToSelect, 1);
            categories.splice(categoryToSelect, 1);
        }

    } while(numCharades === 0);

    var charadeToSelect = (Math.floor(Math.random() * 10) % numCharades);

    var answer = charades[categoryToSelect][charadeToSelect];

    charades[categoryToSelect].splice(charadeToSelect, 1);
    console.log("categories[categoryToSelect]");
    if(numCategories > 0) {
        return [answer, categories[categoryToSelect]];
    }
}

module.exports = {selectCharade: selectCharade}