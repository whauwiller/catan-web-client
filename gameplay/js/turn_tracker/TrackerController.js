//STUDENT-EDITABLE-BEGIN
/**
The namespace for the turn tracker

@module catan.turntracker
@namespace turntracker
**/

var catan = catan || {};
catan.turntracker = catan.turntracker || {};

catan.turntracker.Controller = (function turntracker_namespace() {	

	var Controller = catan.core.BaseController;
    
	/**
		The controller class for the Turn Tracker
		@class TurnTrackerController 
		@extends misc.BaseController
		@param {turntracker.View} view The view for this object to control.
		@param {models.ClientModel} clientModel The clientModel for this object to control.
		@constructor
	**/
	var TurnTrackerController = (function TurnTrackerController_Class(){
	
		function TurnTrackerController(view, clientModel){
			Controller.call(this,view,clientModel);
            this.currentView = this.getView();

			this.clientModel = this.getClientModel();

            for (var player in this.clientModel.players) {

	            view.initializePlayer(this.clientModel.players[player].playerID, this.clientModel.players[player].name, this.clientModel.players[player].color);

			}

            view.setClientColor(this.clientModel.players[this.clientModel.playerID].color);
            
		};

		core.forceClassInherit(TurnTrackerController,Controller);

		TurnTrackerController.prototype.updateFromModel = function() {
			
			this.clientModel = this.getClientModel();
			this.myNumber = this.clientModel.players[this.clientModel.playerID].orderNumber;
			this.currentTurnNumber = this.clientModel.turnTracker.currentTurn;
			console.log("myOrderNumber is: " + this.myNumber);
			console.log("currentTurnNumber is: " + this.currentTurnNumber);

			if(this.myNumber === this.currentTurnNumber){
				this.getView().updateStateView(true, "End Turn");}
			else{
				this.getView().updateStateView(false, "Waiting on other Players...");
			}
			for (var player in this.clientModel.players) {
				var updateItem = {

					playerIndex : this.clientModel.players[player].playerID,
					score : this.clientModel.players[player].victoryPts,
					highlight : (this.clientModel.players[player].orderNumber === this.currentTurnNumber),
					army : (this.clientModel.biggestArmy === this.clientModel.players[player].playerID),
					road : (this.clientModel.longestRoad === this.clientModel.players[player].playerID)
				};
				console.log(updateItem);
				this.getView().updatePlayer(updateItem);	
			}
			console.log("Update Turn Tracker");
		};

		/**
		 * Called by the view when the local player ends their turn.
		 * @method endTurn
		 * @return void
		 */
		TurnTrackerController.prototype.endTurn = function(){
			
			this.currentView.updateStateView(false, "Waiting on other Players...");
			this.getClientModel().finishTurn();
		};
		
		return TurnTrackerController;
	} ());

	return TurnTrackerController;
} ());

