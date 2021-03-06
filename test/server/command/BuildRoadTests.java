/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package server.command;

import org.junit.After;
import static org.junit.Assert.*;
import org.junit.Before;
import org.junit.Test;
import server.ServerException;
import server.communication.*;
import server.api.player.Player;
import server.api.utils.*;
import server.command.*;
import server.api.player.Player.PlayerColor;
import java.util.ArrayList;

/**
 *
 * @author Jonathan
 */
public class BuildRoadTests {
	@Before
	public void setup(){
		//GameList.getGameList().clear();
		GameModelList.add(new GameModel());
		GameModelList.get(0).addPlayer(new Player(0, new PlayerInfo(PlayerColor.orange, 0, "Sam")));
	}
    
	@After
	public void teardown(){}

	@Test
	public void buildRoadTest(){

		BuildRoad buildRoadObj = new BuildRoad();

		/* args[0]-> type
		 * args[1]-> playerIndex
		 * args[2]-> roadLocation:x
		 * args[3]-> roadLocation:y
		 * args[4]-> roadLocation:direction
		 * args[5]-> free
		 */

		int numOfRoads = GameModelList.get(0).getPlayer(0).getRoads();

		String[] args = new String[]{"buildRoad","0", "1", "1", "N", "false", "0"};
		System.out.println("Num before: " + numOfRoads);
		buildRoadObj.execute(args);

		numOfRoads = GameModelList.get(0).getPlayer(0).getRoads();

		System.out.println("numOfRoads: " + numOfRoads);
		
		//System.out.println(lastLine.getMessage());

		assertEquals(14, numOfRoads);

		//String name = "Sam";
		//assertTrue(name == "Sam");
	}
	
}
