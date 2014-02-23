/**
    This is the namespace for the communication classes (log and chat)
    @module catan.comm
    @namespace comm
**/

var catan = catan || {};
catan.controllers = catan.controllers || {};

catan.comm.Controller = (function () {
	
	var Controller = catan.core.BaseController;
	
    /**
        The basic controller class to extend from
        @class BaseCommController 
        @extends misc.BaseController
        @param {comm.BaseCommView} logView The view for this object to control.
        @param {models.ClientModel} model The view for this object to control.
        @constructor
    **/
	var BaseCommController = (function BaseCommController_Class(){
		
		BaseCommController.prototype = core.inherit(Controller.prototype);
		BaseCommController.prototype.contructor = BaseCommController;
		
		function BaseCommController(logView, model){
			Controller.call(this,logView,model);
		}
		
		return BaseCommController;
	}());
	
    
	var LogController = (function LogController_Class(){

        LogController.prototype = core.inherit(BaseCommController.prototype);
		LogController.prototype.constructor = LogController;

		/**
		The controller class for the Log
		@class LogController 
		@constructor
		@extends comm.BaseCommController
		@param {comm.LogView} logView The view for this object to control.
		@param {models.ClientModel} model The view for this object to control.
		**/
		function LogController(logView,model){
			BaseCommController.call(this,logView,model);
		}

		LogController.prototype.updateFromModel = function() {
			console.log("Update Log");

			var logRecord = this.getClientModel().log;

			console.log(logRecord);

			this.getView().resetLines(logRecord.lines)
		};
        
		return LogController;
	}());
	
    
	var ChatController = (function ChatController_Class(){

        ChatController.prototype = core.inherit(BaseCommController.prototype);
		ChatController.prototype.constructor = ChatController;

		/**
		The controller class for the Chat
		@class ChatController 
		@constructor
		@extends comm.BaseCommController
		@param {comm.ChatView} logView The view for this object to control.
		@param {comm.ClientModel} model The view for this object to control.
		**/
		function ChatController(chatView,model){
			BaseCommController.call(this,chatView,model);
		}

		ChatController.prototype.updateFromModel = function() {
			console.log("Update Chat");

			var chatRecord = this.getClientModel().chat;

			

			this.getView().resetLines(chatRecord.lines)
		};
        
		/**
		Called by the view whenever input is submitted
		@method addLine
		@param {String} lineContents The contents of the submitted string
		**/
		ChatController.prototype.addLine = function(lineContents){

			console.log("Add line to Chat");

			if( lineContents !== "") {
				console.log(" Has line to add to Chat");

				// var playerID = this.getClientModel().playerID;

				// var player = this.getClientModel().players[playerID];

				// var line = {
				// 	source: player.name,
 			// 		message: lineContents,
 			// 		className: player.color
 			// 	};

 			// 	console.log(line);

 			// 	var chat = this.getClientModel().chat;

 			// 	chat.lines.push(line);

 			// 	console.log(chat.lines);

 				this.getClientModel().sendChat(lineContents);
			}
		};
		
		return ChatController;
	}());
	
	return {
		LogController:LogController,
		ChatController:ChatController
	};
	
} ());

