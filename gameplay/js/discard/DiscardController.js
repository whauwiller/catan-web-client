//STUDENT-EDITABLE-BEGIN
/**
    This is the namespace for discarding cards
    @module catan.discard
    @namespace discard
*/

var catan = catan || {};
catan.discard = catan.discard || {};

catan.discard.Controller = (function discard_namespace(){

	var Controller = catan.core.BaseController;
    
	var Definitions = catan.definitions;
	var ResourceTypes = catan.definitions.ResourceTypes;
	
    /**
     * @class DiscardController
     * @constructor
     * @extends misc.BaseController
     * @param{discard.DiscardView} view
     * @param{misc.WaitOverlay} waitingView
     * @param{models.ClientModel} clientModel
     */
	var DiscardController = (function DiscardController_Class(){
			
		function DiscardController(view, waitingView, clientModel){
        
            Controller.call(this,view,clientModel);
			
            view.setController(this);
            waitingView.setController(this);
            this.setWaitingView(waitingView);

            this.isDiscarding = false;
            this.isWaiting = false;
		}

		core.forceClassInherit(DiscardController,Controller);

		core.defineProperty(DiscardController.prototype,"waitingView");

		/**
		Called by when the Client model updates.
		@method updateFromModel
		@return void
		*/
		DiscardController.prototype.updateFromModel = function() {
			this.clientModel = this.getClientModel();
			this.currentPlayerResources = this.clientModel.currentPlayerResources();
			this.playerResTotal = 0;

			for(var myKey in this.currentPlayerResources){
				this.playerResTotal += this.currentPlayerResources[myKey];
			}

			if(this.clientModel.turnTracker.theStatus === "Discarding" &&
			   this.playerResTotal > 7 && !this.isDiscarding){
				console.log("Update Discard");

				this.isDiscarding = true;
				this.discardingResources = {"wood":0,"brick":0,"sheep":0,"wheat":0,"ore":0};
				this.maxDiscardValues = {"wood":0,"brick":0,"sheep":0,"wheat":0,"ore":0};
				
				this.currentDiscardAmount = 0;
				this.totalResources = 0;

				this.getView().showModal();
				this.getView().setDiscardButtonEnabled(false);
				
				for(var myKey in this.currentPlayerResources){
					this.manageResource(myKey);
				}

				this.getView().setStateMessage("0 / "+Math.floor(this.totalResources/2));
				
			} else if (this.clientModel.turnTracker.theStatus === "Discarding" && !this.isWaiting){
				this.isWaiting = true;
				this.getWaitingView().showModal();
			} else if (this.clientModel.turnTracker.theStatus !== "Discarding" && this.isWaiting){
				this.isWaiting = false;
				this.getWaitingView().closeModal();
			}
		};


		/**
		Called by UpdateFromModel to enable or disable resources.
		@param mykey {element name} name of an element in a resource list.
		@method magageResource
		@return void

		*/
		DiscardController.prototype.manageResource = function(myKey){
			this.totalResources += this.currentPlayerResources[myKey];
			this.getView().setResourceMaxAmount(myKey, this.currentPlayerResources[myKey]);
			this.maxDiscardValues[myKey] = this.currentPlayerResources[myKey];
			if(this.currentPlayerResources[myKey]>0){
				this.getView().setResourceAmountChangeEnabled(myKey, true, false);
			}
			else{
				this.getView().setResourceAmountChangeEnabled(myKey, false, false);
			}
			this.getView().setResourceAmount(myKey, "0");
		}


		/**
		 Called by the view when the player clicks the discard button.
         It should send the discard command and allow the game to continue.
		 @method discard
		 @return void
		 */	
		DiscardController.prototype.discard = function(){
			this.getClientModel().discardCards(this.discardingResources);
			this.getView().closeModal();
			this.isDiscarding = false;
			this.isWaiting = true;
			this.getWaitingView().closeModal();
			this.getWaitingView().showModal();
		}
        
		/**
		 Called by the view when the player increases the amount to discard for a single resource.
		 @method increaseAmount
		 @param {String} resource the resource to discard
		 @return void
		 */
		DiscardController.prototype.increaseAmount = function(resource){
			
			this.discardingResources[resource]++;
			

			if(this.discardingResources[resource]===this.maxDiscardValues[resource]){
				this.getView().setResourceAmountChangeEnabled(resource, false, true);
			}
			else{
				this.getView().setResourceAmountChangeEnabled(resource, true, true);
			}
			
			this.getView().setResourceAmount(resource, this.discardingResources[resource]);

			this.currentDiscardAmount++;
			this.getView().setStateMessage(this.currentDiscardAmount+" / "+Math.floor(this.totalResources/2));
			
			if(this.currentDiscardAmount === Math.floor(this.totalResources/2)){
				this.getView().setDiscardButtonEnabled(true);
				for(var myKey in this.currentPlayerResources){
					if(this.discardingResources[myKey]>0){
						this.getView().setResourceAmountChangeEnabled(myKey, false, true);
					} else {
						this.getView().setResourceAmountChangeEnabled(myKey, false, false);
					}
					this.getView().setResourceAmount(myKey, this.discardingResources[myKey]);
				}
			}
		}
        
		/**
		 Called by the view when the player decreases the amount to discard for a single resource.
		 @method decreaseAmount
		 @param {String} resource the resource to discard
		 @return void
		 */
		DiscardController.prototype.decreaseAmount = function(resource){

			this.getView().setDiscardButtonEnabled(false);

			this.discardingResources[resource]--;

			for(var myKey in this.discardingResources){
				if(this.discardingResources[myKey] === this.maxDiscardValues[myKey] && this.discardingResources[myKey] > 0){
					this.getView().setResourceAmountChangeEnabled(myKey, false, true);
				} else if(this.discardingResources[myKey]>0){
					this.getView().setResourceAmountChangeEnabled(myKey, true, true);
				} else if (this.currentPlayerResources[myKey]>0) {
					this.getView().setResourceAmountChangeEnabled(myKey, true, false);
				} else {
					this.getView().setResourceAmountChangeEnabled(myKey, false, false);
				}
				this.getView().setResourceAmount(myKey, this.discardingResources[myKey]);
			}
			
			this.currentDiscardAmount--;
			this.getView().setStateMessage(this.currentDiscardAmount+" / "+Math.floor(this.totalResources/2));
		}
		
		return DiscardController;
	}());
	
    return DiscardController;
}());

