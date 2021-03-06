package server.command;

import server.api.bank.ResourceCardList;
import server.api.player.Player;
import server.api.utils.MessageLine;
import server.communication.GameModel;
import server.communication.GameModelList;
import server.persist.*;

public class SendTradeResponse implements CommandTemplate{
		private int playerIndex;
		private String willAccept;
		private int sender;
		private int receiver;
		private ResourceCardList rcl;
		private int gameID;
		private String type = "";
		

		
	@Override
	public GameModel execute(String[] args) {
		playerIndex = Integer.parseInt(args[0]);
		willAccept = args[1];
		gameID = Integer.parseInt(args[2]); 
		type = args[3];
		sender = GameModelList.get(gameID).getTradeOffer().getSender();
		receiver = GameModelList.get(gameID).getTradeOffer().getReceiver();
		rcl = GameModelList.get(gameID).getTradeOffer().getTheResourceList();
		
		if(willAccept.equalsIgnoreCase("false")){
			//you suck, just trade
		}
		else{
			update();
		}
		clearList();
		
		GameModelList.get(gameID).incrementRevision();
		return null;
	}
	
	private void update(){
		Player theSender = GameModelList.get(gameID).getPlayer(sender);
		Player theReceiver = GameModelList.get(gameID).getPlayer(receiver);
		//update Brick
		if(rcl.getBrick()!=0){
			theSender.getResourceCardList().updateBrick(rcl.getBrick()*(-1));
			theReceiver.getResourceCardList().updateBrick(rcl.getBrick());
		}
		//update Ore
		if(rcl.getOre()!=0){
			theSender.getResourceCardList().updateOre(rcl.getOre()*(-1));
			theReceiver.getResourceCardList().updateOre(rcl.getOre());
		}
		//update Sheep
		if(rcl.getSheep()!=0){
			theSender.getResourceCardList().updateSheep(rcl.getSheep()*(-1));
			theReceiver.getResourceCardList().updateSheep(rcl.getSheep());
		}
		//update Wheat
		if(rcl.getWheat()!=0){
			theSender.getResourceCardList().updateWheat(rcl.getWheat()*(-1));
			theReceiver.getResourceCardList().updateWheat(rcl.getWheat());
		}
		//update Wood
		if(rcl.getWood()!=0){
			theSender.getResourceCardList().updateWood(rcl.getWood()*(-1));
			theReceiver.getResourceCardList().updateWood(rcl.getWood());
		}
		
		// update log
		MessageLine logMsg = new MessageLine();
		logMsg.setSource(GameModelList.get(gameID).getPlayer(sender).getName());
		logMsg.setMessage(GameModelList.get(gameID).getPlayer(sender).getName() + " traded with " + GameModelList.get(gameID).getPlayer(receiver).getName() + ".");
		GameModelList.get(gameID).getLog().addLine(logMsg);
	}
	
	private void clearList(){
		GameModelList.get(gameID).getTradeOffer().setReceiver(-1);
		GameModelList.get(gameID).getTradeOffer().setSender(-1); 
	}
	
	@Override
	public void persist(){
		StorageFacade.addCommand(gameID, this, type);
	}
	@Override
	public void redo(){
		sender = GameModelList.get(gameID).getTradeOffer().getSender();
		receiver = GameModelList.get(gameID).getTradeOffer().getReceiver();
		rcl = GameModelList.get(gameID).getTradeOffer().getTheResourceList();
		
		if(willAccept.equalsIgnoreCase("false")){
			//you suck, just trade
		}
		else{
			update();
		}
		clearList();
		GameModelList.get(gameID).incrementRevision();	
	}

	@Override
	public void undo() {
		
	}

}
