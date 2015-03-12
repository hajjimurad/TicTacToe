function TestController($scope) {
	var logs = [];
	var resultCounter;
	//--- data to view
	$scope.getLog = function() {
		return logs;
	};
	function log(message) {
		logs.push(message);
		console.log(message);
	}
	//--- counter of game results
	function initCounter() {
		resultCounter = { resX: 0, res0: 0, resNone: 0, total: 0};
	}
    //--- test with recursion
    function testEx(gType) {
        log("--------------")
        log("Test 'user is " + (gType ? "0" : "X") + "' started");
        //---
        initCounter();
        //---
        var initialGame = new Game(gType);
        initialGame.start();
        step(initialGame);
        //---
        log("Games tested: " + resultCounter.total + " (crosses won: " + resultCounter.resX + ", noughts won: " + resultCounter.res0 + ", drawn games: " + resultCounter.resNone + ")");
        //---
        return gType == Game.gameType.userFirst ? resultCounter.resX : resultCounter.res0;
    }
    //--- recursive method to
    function step(game) {
        var emptyPoses = game.getEmptyPositions();
        //--- go through empty posisions
        for(var i=0;i<emptyPoses.length;i++) {
            //---
            var gameTemp = game.clone();
            var cycleResult = gameTemp.runCycle(emptyPoses[i]);
            if(cycleResult == null) {
                //--- enter recursion
                step(gameTemp);
            } else {
                //--- result exists => count it
                countResult(cycleResult);
            }
        }
    }
	//---
	function countResult(result) {
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
	}
	//--- run tests
	var userWinsCount = testEx(Game.gameType.userFirst);
    log(userWinsCount > 0 ? "ERROR: matches found where user started with X and won" : "SUCCESS: test passed, crosses have never won");
    //---
    userWinsCount = testEx(Game.gameType.computerFirst);
    log(userWinsCount > 0 ? "ERROR: matches found where computer started with X and lost" : "SUCCESS: test passed, noughts have never won");
}