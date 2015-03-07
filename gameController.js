//--- entry point for game
var GameController = function($scope) {	
	//---
	var initForm = function() {
		$scope.selectedGameType = null;
		$scope.game = null;
	};
	//---
	initForm();
	//---
	var startGame = function(gameType) {
		return new Game(gameType);
	}
	//--- data to view
	$scope.showState = function(item) {
		if(item.state  == 0) return "0"; // ⭕
		if(item.state == 1) return "X"; // ❌
	};
	//--- shows game result
	$scope.showResult = function(gameResult) {
		switch(gameResult) {
			case 0:
				return 'Nobody won!';
			break;
			case 1:
				return 'Winner is user \'X\'';
			break;
			case 2:
				return 'Winner is user \'O\'';
			break;
			default:
				return null;
			break;
		}
	};
	//--- data to view
	$scope.onSelectGame = function(gameType) {
		$scope.selectedGameType = gameType;
		//--- start new game
		$scope.game = startGame(gameType);
	};
    //---   				     
	$scope.onUserClick = function(index) {
		//--- game is finished
		if($scope.resetRequired) {
			$scope.resetRequired = false;
			initForm();
			return;
		}
		//---
		if(!$scope.game.userRun(index,$scope.selectedGameType))
			return;
		//--- check is result received
		if($scope.game.isGameFinished()) {
			$scope.resetRequired = true;
			return;
		}
		//--- computer turn
		$scope.game.computerRun(!$scope.selectedGameType);
		//--- check state again
		if($scope.game.isGameFinished()) {
			$scope.resetRequired = true;
			return;
		}		
	};
}