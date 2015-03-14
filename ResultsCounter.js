//--- counter for results
function ResultsCounter() {
    var resultCounter = { resX: 0, res0: 0, resNone: 0, total: 0};
    //--- checks and counts results
    this.countResult = function(result) {
        if(result != null) {
            resultCounter.total++;
            //---
            switch(result) {
                case "X":
                    resultCounter.resX++;
                    break;
                case "0":
                    resultCounter.res0++;
                    break;
                case "-":
                    resultCounter.resNone++;
                    break;
                default:
                    throw "unexpected: " + result;
                    break;
            }
        }
    };
    //--- gets results
    this.getResults = function() {
        return resultCounter;
    }
}