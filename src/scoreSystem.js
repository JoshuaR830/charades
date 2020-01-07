function displayScoreBoard(scores, sortedScores) {
    // Creates an array of scores in order
    var max = 0;
    var arrScores = Object.values(scores);
    arrScores.sort().reverse();

    // Create a list of scores in the order that they placed
    for(i = 0; i < arrScores.length; i++) {
        for(j = 0; j < names.length; j++) {
            if(arrScores[i] === scores[names[j]]) {
                sortedScores[names[j]] = arrScores[i];
            }
        }
    }

    // Find out who won
    for (i = 0; i < names.length; i++) {
        if (scores[names[i]] > scores[names[max]]) {
            max = i;
        }
    }
}

module.exports = {displayScoreBoard : displayScoreBoard}