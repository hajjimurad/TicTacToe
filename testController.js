function TestController($scope) {
	var log = [];
	var resultCounter;
	//--- data to view
	$scope.getLog = function() {
		return log;
	};
	function print(message) {
		log.push(message);
	}
	//--- counter of game results
	function initCounter() {
		resultCounter = { resX: 0, res0: 0, resNone: 0, total: 0};
	} 
	//---
	function test(gameType) {
		initCounter();
		//---
		print("Test 'user is " + (gameType ? "0" : "X") + "' started");
		//---
		var game0 = new Game(gameType); 
		game0.start();
		//--- save state 0
		var game0Back = game0.clone();
		var ep0 = game0.getEmptyPositions();
		//---
		for(var i0=0;i0<ep0.length;i0++) {
			var r0 = game0.runCycle(ep0[i0]);
			//---
			countResult(gameType,r0);
			if(r0 == null) {
				var game1Back = game0.clone();
				var ep1 = game0.getEmptyPositions();
				for(var i1=0;i1<ep1.length;i1++) {
				  	var r1 = game0.runCycle(ep1[i1]);
				  	//---
					countResult(gameType,r1);
					if(r1 == null) {
					  	var game2Back = game0.clone();
						var ep2 = game0.getEmptyPositions();
						for(var i2=0;i2<ep2.length;i2++) {
							var r2 = game0.runCycle(ep2[i2]);
							//---
						  	countResult(gameType,r2);
						  	if(r2 == null) {
							 	var game3Back = game0.clone();
								var ep3 = game0.getEmptyPositions();
								for(var i3=0;i3<ep3.length;i3++) {
									var r3=game0.runCycle(ep3[i3]);
									//---
								  	countResult(gameType,r3);
								  	if(r3 == null) {
									 	var game4Back = game0.clone();
										var ep4 = game0.getEmptyPositions();
										for(var i4=0;i4<ep4.length;i4++) {
											var r4=game0.runCycle(ep4[i4]);
										  	countResult(gameType,r4);
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
		printResult();
		print("--------------------------------------");
		processResult(gameType);
	};
	//---
	function countResult(gameType,result) {
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
	function processResult(gameType) {
		if(!gameType && (resultCounter.resX > 0))
			throw "User started and won";
			//---
		if(gameType && (resultCounter.resY > 0))
			throw "User started and won";
	}
	//---
	function printResult() {
		print("Test finished. Games tested: " + resultCounter.total + ". X won: " + resultCounter.resX + ", Y won: " + resultCounter.res0 + ", Nobody won: " + resultCounter.resNone);
	}
	//--- run tests
	test(false)
	test(true);
}