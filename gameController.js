//--- entry point for game
var GameController = function($scope) {	
	var resetRequired;
	//---
	var initForm = function() {
		$scope.selectedGameType = null;
		$scope.game = null;
		resetRequired = false;
	};
	//---
	initForm();
	//--- data to view
	$scope.showState = function(item) {
		if(item.state  == 0) return "0"; // ⭕
		if(item.state == 1) return "X"; // ❌
	};
	//--- shows game result
	$scope.showResult = function() {
		var gameResult = $scope.game != null && $scope.game.getGameResult();
		//---
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
		$scope.game = new Game(gameType);
		$scope.game.start();
	};
    //---   				     
	$scope.onUserClick = function(index) {
		//--- game is finished
		if(resetRequired) {
			resetRequired = false;
			initForm();
			return;
		}
		//--- user enters
		if(!$scope.game.userRun(index,$scope.selectedGameType))
			return;
		//--- check is result received
		if($scope.game.isGameFinished()) {
			resetRequired = true;
			return;
		}
		//--- computer turn
		$scope.game.computerRun(!$scope.selectedGameType);
		//--- check state again
		if($scope.game.isGameFinished()) {
			resetRequired = true;
			return;
		}		
	};
}