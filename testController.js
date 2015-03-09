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
	//---
	function test(gameType) {
		initCounter();
		//---
        log("--------------")
		log("Test 'user is " + (gameType ? "0" : "X") + "' started");
		//---
		var game0 = new Game(gameType); 
		game0.start();
		//--- save state 0
		var game0Back = game0.clone();
		var emptyPositions0 = game0.getEmptyPositions();
		//---
		for(var i0=0;i0<emptyPositions0.length;i0++) {
			var r0 = game0.runCycle(emptyPositions0[i0]);
			//---
			countResult(r0);
			if(r0 == null) {
				var game1Back = game0.clone();
				var emptyPositions1 = game0.getEmptyPositions();
				for(var i1=0;i1<emptyPositions1.length;i1++) {
				  	var r1 = game0.runCycle(emptyPositions1[i1]);
				  	//---
					countResult(r1);
					if(r1 == null) {
					  	var game2Back = game0.clone();
						var emptyPositions2 = game0.getEmptyPositions();
						for(var i2=0;i2<emptyPositions2.length;i2++) {
							var r2 = game0.runCycle(emptyPositions2[i2]);
							//---
						  	countResult(r2);
						  	if(r2 == null) {
							 	var game3Back = game0.clone();
								var emptyPositions3 = game0.getEmptyPositions();
								for(var i3=0;i3<emptyPositions3.length;i3++) {
									var r3=game0.runCycle(emptyPositions3[i3]);
									//---
								  	countResult(r3);
								  	if(r3 == null) {
									 	var game4Back = game0.clone();
										var emptyPositions4 = game0.getEmptyPositions();
										for(var i4=0;i4<emptyPositions4.length;i4++) {
											var r4=game0.runCycle(emptyPositions4[i4]);
										  	countResult(r4);
										 	//----!!!	
											game0 = game4Back.clone();
										}
									}
								 	//---
									game0 = game3Back.clone();
								}
							}
						  	//---
							game0 = game2Back.clone();
						}
					}
				  	//---
					game0 = game1Back.clone();
				}
			}
			//---
			game0 = game0Back.clone();
		}
		//---
		log("Games tested: " + resultCounter.total + " (cross won: " + resultCounter.resX + ", nought won: " + resultCounter.res0 + ", drawn game: " + resultCounter.resNone + ")");
        //---
        return gameType == Game.gameType.userFirst ? resultCounter.resX : resultCounter.res0;
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
	var userWinsCount = test(Game.gameType.userFirst);
    log(userWinsCount > 0 ? "ERROR: matches found where user started with X and won" : "SUCCESS: test passed, crosses have never won");
    //---
    userWinsCount = test(Game.gameType.computerFirst);
    log(userWinsCount > 0 ? "ERROR: matches found where computer started with X and lost" : "SUCCESS: test passed, noughts have never won");
}