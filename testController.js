function TestController($scope) {
	var logs = [];
	//--- data to view
	$scope.getLog = function() {
		return logs;
	};
	function log(message) {
		logs.push(message);
		console.log(message);
	}
    //--- test with recursion
    function testEx(gType) {
        log("Test 'user is " + (gType ? "0" : "X") + "' started");
        //---
        var resultsCounter = new ResultsCounter();
        //--- prepare template game
        var initialGame = new Game(gType);
        initialGame.start();
        //--- go through steps
        step(initialGame,resultsCounter);
        //---
        var gamesResult = resultsCounter.getResults();
        log("Games tested: " + gamesResult.total + " (crosses won: " + gamesResult.resX + ", noughts won: " + gamesResult.res0 + ", drawn games: " + gamesResult.resNone + ")");
        //---
        return gType == Game.gameType.userFirst ? gamesResult.resX : gamesResult.res0;
    }
    //--- recursive method to
    function step(game, resCounter) {
        var emptyPoses = game.getEmptyPositions();
        //--- go through empty posisions
        for(var i=0;i<emptyPoses.length;i++) {
            //---
            var gameTemp = game.clone();
            var cycleResult = gameTemp.runCycle(emptyPoses[i]);
            if(cycleResult == null) {
                //--- enter recursion
                step(gameTemp,resCounter);
            } else {
                //--- result exists => count it
                resCounter.countResult(cycleResult);
            }
        }
    }
	//--- run tests
	var userWinsCount = testEx(Game.gameType.userFirst);
    log(userWinsCount > 0 ? "ERROR: matches found where user started with X and won" : "SUCCESS: test passed, crosses have never won");
    log("--------------")
    userWinsCount = testEx(Game.gameType.computerFirst);
    log(userWinsCount > 0 ? "ERROR: matches found where computer started with X and lost" : "SUCCESS: test passed, noughts have never won");
}
