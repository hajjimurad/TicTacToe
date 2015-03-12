//--- global constants initialization for 3x3 game
Game.winSums = [7, 56, 448, 73, 146, 292, 273, 84];
Game.anglePositions = [0,2,6,8];
Game.sidePositions = [1,3,5,7];
Game.centralPosition = 4;
Game.gameType = { userFirst: false, computerFirst: true };
//---
function Game(gType, gStep, gFirstUserPosition, gPrevUserPosition, gComputerStrategy, gStates) {
	//--- game data	
	var gameType = (typeof(gType) ==='undefined') ? Game.gameType.userFirst : gType;
	var step = (typeof(gStep) ==='undefined') ? 0 : gStep;
	var firstUserPosition = (typeof(gFirstUserPosition) ==='undefined') ? null : gFirstUserPosition;
	var prevUserPosition = (typeof(gPrevUserPosition) ==='undefined') ? null : gPrevUserPosition;
	var computerStrategy = (typeof(gComputerStrategy) ==='undefined') ? null : gComputerStrategy;
	//---
	var log = [];
	//--- deep copy
	var states = [];
	if(typeof(gStates) !== 'undefined') {
		for(var a=0;a<9;a++) {
			states.push( { state: gStates[a].state });
		}
	}
 	//---
	this.start = function() {
		//--- init states
		for(var i=0; i<9; i++) {
	 		states.push({ state: null });
	 	}
		//--- do first step is computer first
		if(gameType == Game.gameType.computerFirst) {
			this.computerRun(0);
		}
	};
	//---
	this.clone = function() {
		return new Game(gameType,step,firstUserPosition,prevUserPosition,computerStrategy,states);
	};
	//---
	this.getEmptyPositions = function() {
		var temp = [];
		for(var i=0;i<9;i++) {
			if(states[i].state == null) {
				temp.push(i);
			}
		}
		//---
		return temp;
	};
	//---
	this.runCycle = function(index) {
		//--- user enters
		if(!this.userRun(index,gameType)) {
			return null;
		}
		//--- check is result received
		var resAfterUser = this.getGameResult();
		if(resAfterUser != null) {
			return resAfterUser;
		}
		//--- computer turn
		this.computerRun(!gameType);
		//--- check state again
		return this.getGameResult();
	};
 	//---
 	this.getLogs = function() {
 		return log;
 	};
 	//---
 	this.getStates = function() {
 		return states;
 	};
	//---
	this.getGameResult = function() {
		//--- check if won 0
		if(ifWin(0)) {
			return "0";
		}
		//--- check if won X
		if(ifWin(1)) {
			return "X";
		}
		//--- check if game finished
		if(ifNoPlaceToGo()) {
			return "-";
		}
		//---
		return null;
	};
	this.userRun = function(index,isCross) {
		//--- check if cell is available
		if(states[index].state != null) 
			return false;
		//---
		isCross = (isCross + 1) % 2;
		//---
		placeTo(index,isCross);
		//---
		step++;
		//--- 
		prevUserPosition = index;
		if(step == 1) {
			firstUserPosition = index;
		}
		return true;
	};
	this.computerRun = function(isCross) {
		var chosen = false;
		var emptyPositions = [];
		//---
		isCross = (isCross + 1) % 2;
		//--- 'if i can win then win'
		for(var i=0;i<9;i++) {
			if(states[i].state == null) {
				//--- check if computer can win
				if(ifWin(isCross, i)) {	
					placeTo(i,isCross,"computer can win");
					chosen = true;
					break;
				}
				emptyPositions.push(i);
			}
		}
		if(chosen)
			return;
		//--- 'if opponent can win at next step then go there'
		var opponentSymbol = (isCross + 1) % 2;
		for(i=0;i<9;i++) {
			if(states[i].state == null) {
				//--- check if opponent can win
				if(ifWin(opponentSymbol, i)) {
					placeTo(i,isCross,"user can win");
					chosen = true;
					break;
				}
			}
		}
		if(chosen)
			return;
        //---
		if(gameType == Game.gameType.userFirst) {
			//--- choose strategy
			if(!computerStrategy) {
				if(step == 1) {
					if(states[Game.centralPosition].state == 1) {
						computerStrategy = 1;
					}
					else if(isAnglePosition(opponentSymbol, prevUserPosition)) {
						computerStrategy = 2;
					}
					else if(isSidePosition(opponentSymbol, prevUserPosition)) {
						computerStrategy = 3;
					}
				}
			}
			//--- act by selected strategy
			if(computerStrategy == 1) {
				//--- choose any angle cell or random
				var anglePos = getFirstFreeAnglePosition();
				if(anglePos != null) {
					placeTo(anglePos,isCross,"user has already got center first (strategy 1 for noughts)");
				} else {
					placeTo(getFirstFree(),isCross,"user has already got center first and angle positions are not empty (strategy 1.1 for noughts)");
				}
			} else if(computerStrategy == 2) {
				if(step == 1) {
					placeTo(Game.centralPosition,isCross,"user has already got angle (strategy 2 for noughts)")
				} else if (step == 2) {
					//--- find opposite position
					var oppositePositions = getPositionOpposite(firstUserPosition);
					if(states[oppositePositions].state != null) {
						// //--- opposite position is used => find any at side
						placeTo(getFirstFreeAtSide(),isCross,"second step, at side (strategy 2 for noughts)");
					} else {
						placeTo(oppositePositions,isCross,"second step, opposite (strategy 2 for noughts)");
					}
				} else {
					placeTo(getFirstFree(),isCross,"selects any free (strategy 2 for noughts)");
				}
			} else if(computerStrategy == 3) {
				if(step == 1) {
					placeTo(Game.centralPosition,isCross,"first step was at side (strategy 3.0 for noughts)");
				} else if(step == 2) {
					var tempPos;
					//----
					if(isAnglePosition(opponentSymbol, prevUserPosition)) {
						placeTo(getPositionOpposite(prevUserPosition),isCross,"second step was at angle " + prevUserPosition + " (strategy 3.1 for noughts)");
					} else if(getPositionOpposite(prevUserPosition) == firstUserPosition) {
						placeTo(getFirstFreeAnglePosition(),isCross,"second step was at opposite to the first side (strategy 3.2 for noughts)");
					} else if(ifPositionNearAndAtSideToTheFirst(opponentSymbol,prevUserPosition,firstUserPosition, function(pos) { tempPos = pos})) {
						placeTo(tempPos,isCross,"second step was near at side (strategy 3.3 for noughts)");
					} else {
					placeTo(getFirstFree(),isCross,"selects any free (strategy 3 for noughts)");
					}
				} else {
					placeTo(getFirstFree(),isCross,"selects any free (strategy 3 for noughts)");
				}
			}
		}
		else if(gameType == Game.gameType.computerFirst) {
			if(step == 0) {
				//--- get center
				placeTo(Game.centralPosition,isCross,"need to start from center");
			}
			else {
				//--- find the most remote cell for reviousPosition
				var remoteToPrevious = getMostRemoteAngleTo(prevUserPosition);
				if(remoteToPrevious)
					placeTo(remoteToPrevious,isCross,"it's the most remoted angle to " + prevUserPosition + " (strategy for crosses by default)");						
				else {
					placeTo(getFirstFree(),isCross,"selects any free (strategy for crosses, when angle is not available");
				}
			}
		}
	};	
	var placeTo = function(pos, isCross, reason) {
		if(!states) {
			throw "states are not initialized";
		}
		//---
		if(!states[pos]) {
			throw "state position is not initialized for " + pos + ", reason: " + reason;
		}
		//---
		if(states[pos].state == null) {
			states[pos].state = isCross;
			var record = reason 
						 ? ("computer chooses " + pos + ", because " + reason)
						 : "user chooses " + pos;
			 //---
			//console.log(record);
			log.push(record);
		}
		else {
			throw "invalid position to set for reason: " + reason;
		}
	};
	var getMostRemoteAngleTo = function(sourcePosition) {
		var maxDistance = 0;
		var maxRemotePosition;
		//---
		for(var i=0;i<Game.anglePositions.length;i++) {
			if(states[Game.anglePositions[i]].state != null) 
				continue;
			//---
			var x = sourcePosition % 3;
			var y = (sourcePosition - x) / 3;
			//---
			var xAngle = Game.anglePositions[i] % 3;
			var yAngle = (Game.anglePositions[i] - xAngle) / 3;
			//---
			var distance = Math.abs(x - xAngle) + Math.abs(y - yAngle);
			//---
			if(maxDistance < distance) {
				maxDistance = distance;
				maxRemotePosition = Game.anglePositions[i];
			}
		}
		return maxRemotePosition;
	};
	var ifPositionNearAndAtSideToTheFirst = function(isCross, position, firstPosition, callback) {
		if(!callback)
			return null;
		//---
		if(!isSidePosition(isCross,position)) {
			throw "position is not side to check if both are neighbours";
		}
		switch(position) {
			case 1:
				if(firstPosition == 3) { callback(0); return true; }
				if(firstPosition == 5) { callback(2); return true; }
			break; 
			case 3: 
				if(firstPosition == 1) { callback(0); return true; }
				if(firstPosition == 7) { callback(6); return true; }
			break; 
			case 5: 
				if(firstPosition == 1) { callback(2); return true; }
				if(firstPosition == 7) { callback(8); return true; }
			break; 
			case 7: 
				if(firstPosition == 3) { callback(6); return true; }
				if(firstPosition == 5) { callback(8); return true; }
			break;
		}
		//---
		return false;
	};
	var getPositionOpposite = function(sourcePosition) {
		if(sourcePosition == undefined) {
			throw "invalid position specified to get opposite, undefined";
		}
		if(sourcePosition == Game.centralPosition) {
			throw "invalid position specified to get opposite, opposite";
		}
		var x = sourcePosition % 3;
		var y = (sourcePosition - x) / 3;
		var oppositeX = 2 - x;
		var oppositeY = 2 - y;
		return oppositeY * 3 + oppositeX;
	};
	var getFirstFreeAtSide = function() {
		for(var i=0;i<Game.sidePositions.length;i++) {
			if(states[Game.sidePositions[i]].state == null) {
				return Game.sidePositions[i];
			}
		}
		return null;
	};
	var getFirstFreeAnglePosition = function() {
		for(var i=0;i<Game.anglePositions.length;i++) {
			if(states[Game.anglePositions[i]].state == null) {
				return Game.anglePositions[i];
			}
		}
		return null;
	};
	var getFirstFree = function() {
		for(var i=0;i<9;i++) {
			if(states[i].state == null) {
				return i;
			}
		}
		return null;
	};
	var isAnglePosition = function(isCross, position) {
		for(var i=0;i<Game.anglePositions.length;i++) {
			if(position == Game.anglePositions[i] && states[Game.anglePositions[i]].state == isCross) {
				return true;
			}
		}
		return false;
	};
	var isSidePosition = function(isCross, position) {
		for(var i=0;i<Game.sidePositions.length;i++) {
			if(position== Game.sidePositions[i] && states[Game.sidePositions[i]].state == isCross) {
				return true;
			}
		}
		return false;
	};
	//--- checks if current player won
	var ifWin = function(isCross,futurePosition) {
		//--- calculate sum of current elements
		var tempSum = 0; 
		for(var i=0;i<9;i++) {
	 		if(states[i].state == isCross) {
				tempSum |= Math.pow(2,i);
 			}
	 	}
	 	//--- if future position specified then take it into consideration too
	 	if(futurePosition != null) {
	 		tempSum |= Math.pow(2,futurePosition);
	 	}
 		//--- ... and compare it with one of the sums
 		for(var s=0;s<Game.winSums.length;s++) {
 			if((Game.winSums[s] & tempSum) == Game.winSums[s])
 				return true;
 		}
 		//---
 		return false;
	};
	//-- checks whether cells with empty data exists
	var ifNoPlaceToGo = function() {
		for(var i=0;i<9;i++) {
	 		if(states[i].state == null) {
	 			return false;
	 		}
	 	}
	 	return true;
	};
}