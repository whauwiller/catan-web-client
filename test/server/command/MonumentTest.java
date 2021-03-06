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
import server.command.*;
import server.api.player.Player.PlayerColor;

public class MonumentTest{
	public Monument monObject = new Monument();
	@Before
	public void setup(){
		GameModelList.add(new GameModel());
		GameModelList.get(0).addPlayer(new Player(0, new PlayerInfo(PlayerColor.orange, 0, "Sam")));
		GameModelList.get(0).getPlayer(0).getOldDevCards().setMonument(1);
		GameModelList.get(0).getPlayer(0).setVictoryPoints(2);
		GameModelList.get(0).getPlayer(0).setMonuments(0);
	}

	@After
    public void teardown(){}

	@Test
	public void executeTest(){
		
		//assertEquals(GameModelList.get(0).getPlayer(1).getOldDevCards(),0);
		
		String[] args = new String[]{"0", "0", "Monument"};
		monObject.execute(args);
		assertEquals(GameModelList.get(0).getPlayer(0).getOldDevCards().getMonument(), 0);
		assertEquals(GameModelList.get(0).getPlayer(0).getVictoryPoints(), 3);
		assertEquals(GameModelList.get(0).getPlayer(0).getMonuments(),1);
	}

	@Test
	public void undoTest(){
		String[] args = new String[]{"0", "0", "Monument"};
		monObject.execute(args);
		monObject.undo();
		assertEquals(GameModelList.get(0).getPlayer(0).getOldDevCards().getMonument(), 1);
		assertEquals(GameModelList.get(0).getPlayer(0).getVictoryPoints(), 2);
		assertEquals(GameModelList.get(0).getPlayer(0).getMonuments(),0);	
	}
	
	
	


}