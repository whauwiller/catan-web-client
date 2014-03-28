/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package server.command;

import server.api.utils.MessageLine;
import server.communication.GameModel;

/**
 *
 * @author Wesley
 */
public class FinishTurn implements CommandTemplate {
	
	private String type;
	private int playerIndex;
	private String lastStatus;

	@Override
	public GameModel execute(String[] args) {
		type = args[0];
		playerIndex = Integer.parseInt(args[1]);
		lastStatus = GameModel.getTurnTracker().getStatus();
		
		int currentTurn = GameModel.getTurnTracker().getCurrentTurn();
		GameModel.getTurnTracker().setCurrentTurn((currentTurn + 1) % 4);
		GameModel.getTurnTracker().setStatus("Rolling");
		
		GameModel.incrementRevision();
		
		//take all New dev cards and make them old dev cards
		if(GameModel.getPlayer(playerIndex).getNewDevCards().getTotal() !=0){
			GameModel.getPlayer(PlayerIndex).getOldDevCards().updateYearOfPlenty(GameModel.getPlayer(PlayerIndex).getNewDevCards().getYearOfPlenty());
			GameModel.getPlayer(PlayerIndex).getOldDevCards().updateMonopoly(GameModel.getPlayer(PlayerIndex).getNewDevCards().getMonopoly());
			GameModel.getPlayer(PlayerIndex).getOldDevCards().updateRoadBuilding(GameModel.getPlayer(PlayerIndex).getNewDevCards().getRoadBuilding());
			GameModel.getPlayer(PlayerIndex).getOldDevCards().updateSoldier(GameModel.getPlayer(PlayerIndex).getNewDevCards().getSoldier());
		}
		
		MessageLine logMsg = new MessageLine();
		logMsg.setSource(GameModel.getPlayer(playerIndex).getName());
		logMsg.setMessage(GameModel.getPlayer(playerIndex).getName() + "'s turn has ended.");
		GameModel.getLog().addLine(logMsg);
		
		return null;
	}

	@Override
	public void undo() {
		int currentTurn = GameModel.getTurnTracker().getCurrentTurn();
		GameModel.getTurnTracker().setCurrentTurn((currentTurn - 1) % 4);
		GameModel.getTurnTracker().setStatus(lastStatus);
	}
	
}
