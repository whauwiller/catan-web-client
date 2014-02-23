var catan = catan || {};
catan.models = catan.models || {};

catan.models.State  = (function stateNameSpace(){

	var State = (function StateClass(){

		function State(){
			this.currentModel = null;
			this.observers = new Array();
			this.stateInit = false;
		}

		State.prototype.addObserver = function(observer) {
			this.observers.push(observer);
		};

		State.prototype.isNew = function(clientModel) {
			if(this.stateInit){
				return JSON.stringify(clientModel) !== JSON.stringify(this.currentModel);
			} else {
				this.stateInit = true;
				return true;
			}
		};

		State.prototype.updateModel = function(clientModel) {
			console.log("updateModel");
			console.log(this.observers);
		   	this.currentModel = clientModel;
		   	this.notifyObservers();
		};

		State.prototype.notifyObservers = function() {
			this.observers.forEach(function(observer){
				observer.updateFromModel();
			})
		};

		return State;
	}());	
	
	return State;
}());