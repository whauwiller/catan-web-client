package server.command;

import server.JSONObject;
import server.communication.GameModel;
import server.communication.GameModelList;
import server.persist.*;
import java.util.*;

import server.api.map.*;

public class BuildSettlement implements CommandTemplate{
	private String type = "";
	private int playerIndex = -1;
	private int vertexX = -1;
	private int vertexY = -1;
	private String vertexDirection = "";
	private boolean free = false;
	private int gameID = -10;
	


	/* args[0]-> type
	 * args[1]-> playerIndex
	 * args[2]-> vertexLocation:x
	 * args[3]-> vertexLocation:y
	 * args[4]-> vertexLocation:direction
	 * args[5]-> free
	 */

	@Override
	public GameModel execute(String[] args){
		type = args[0];
		playerIndex = Integer.parseInt(args[1]);
		vertexX = Integer.parseInt(args[2]);
		vertexY = Integer.parseInt(args[3]);
		vertexDirection = args[4];
		free = Boolean.parseBoolean(args[5]);
		gameID = Integer.parseInt(args[6]);
		//GameModel gmod = GameModel.getInstance();

		// update bank - add resources - building a road requires one brick, one lumber, one wool, and one grain
		GameModelList.get(gameID).getBank().updateBrick(1);
		GameModelList.get(gameID).getBank().updateWood(1);
		GameModelList.get(gameID).getBank().updateSheep(1);
		GameModelList.get(gameID).getBank().updateWheat(1);

		// update player - subtract resources
		GameModelList.get(gameID).getPlayer(playerIndex).getResourceCardList().updateBrick(-1);
		GameModelList.get(gameID).getPlayer(playerIndex).getResourceCardList().updateWood(-1);
		GameModelList.get(gameID).getPlayer(playerIndex).getResourceCardList().updateSheep(-1);
		GameModelList.get(gameID).getPlayer(playerIndex).getResourceCardList().updateWheat(-1);
		GameModelList.get(gameID).getPlayer(playerIndex).updateSettlements(-1);

		// update map - change ownerID of a given edge
		Location hexLoc = new Location(vertexX, vertexY, true);
		hexLoc.setDirection(vertexDirection);
		GameModelList.get(gameID).getMap().updateVertexOwner(hexLoc, playerIndex);
		return null;
	}
	@Override
	public void persist(){
		StorageFacade.addCommand(gameID, this, type);
	}
	@Override
	public void redo(){
		// update bank - add resources - building a road requires one brick, one lumber, one wool, and one grain
		GameModelList.get(gameID).getBank().updateBrick(1);
		GameModelList.get(gameID).getBank().updateWood(1);
		GameModelList.get(gameID).getBank().updateSheep(1);
		GameModelList.get(gameID).getBank().updateWheat(1);

		// update player - subtract resources
		GameModelList.get(gameID).getPlayer(playerIndex).getResourceCardList().updateBrick(-1);
		GameModelList.get(gameID).getPlayer(playerIndex).getResourceCardList().updateWood(-1);
		GameModelList.get(gameID).getPlayer(playerIndex).getResourceCardList().updateSheep(-1);
		GameModelList.get(gameID).getPlayer(playerIndex).getResourceCardList().updateWheat(-1);
		GameModelList.get(gameID).getPlayer(playerIndex).updateSettlements(-1);

		// update map - change ownerID of a given edge
		Location hexLoc = new Location(vertexX, vertexY, true);
		hexLoc.setDirection(vertexDirection);

	}

	@Override
	public void undo(){ // should probably save previous location
		Location hexLoc = new Location(vertexX, vertexY, true);
		hexLoc.setDirection(vertexDirection);
		GameModelList.get(gameID).getMap().updateVertexOwner(hexLoc, -1);

		GameModelList.get(gameID).getPlayer(playerIndex).getResourceCardList().updateBrick(1);
		GameModelList.get(gameID).getPlayer(playerIndex).getResourceCardList().updateWood(1);
		GameModelList.get(gameID).getPlayer(playerIndex).getResourceCardList().updateSheep(1);
		GameModelList.get(gameID).getPlayer(playerIndex).getResourceCardList().updateWheat(1);
		GameModelList.get(gameID).getPlayer(playerIndex).updateSettlements(1);

		GameModelList.get(gameID).getBank().updateBrick(-1);
		GameModelList.get(gameID).getBank().updateWood(-1);
		GameModelList.get(gameID).getBank().updateSheep(-1);
		GameModelList.get(gameID).getBank().updateWheat(-1);
	}
}
