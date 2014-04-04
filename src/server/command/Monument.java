package server.command;

import server.communication.GameModel;
import server.communication.GameModelList;

import java.util.*;

public class Monument implements CommandTemplate {
	private String type = "Monument";
	private int playerIndex =-1;
	private int gameID = -10;
	//args[0] = player id
	public GameModel execute(String[] args){
		playerIndex = Integer.parseInt(args[0]);
		//change the points
		gameID = Integer.parseInt(args[1]);
		GameModelList.get(gameID).getPlayer(playerIndex).updateVictoryPoints(1);
		GameModelList.get(gameID).getPlayer(playerIndex).getOldDevCards().updateMonument(-1);
		GameModelList.get(gameID).getPlayer(playerIndex).updateMonuments(1);
		return null;
	}
	public void undo(){
		GameModelList.get(gameID).getPlayer(playerIndex).updateVictoryPoints(-1);
		GameModelList.get(gameID).getPlayer(playerIndex).getOldDevCards().updateMonument(1);
		GameModelList.get(gameID).getPlayer(playerIndex).updateMonuments(-1);
	}
}