/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package server.persist.db;

import java.sql.Connection;
import java.util.ArrayList;

import server.command.CommandTemplate;
import server.persist.CommandListAO;

/**
 *
 * @author Wesley
 */
public class CommandListDAO implements CommandListAO{
	private Connection conn;

	CommandListDAO(DatabaseConnection dbconn) {
		this.conn = dbconn.getConnection();
	}

	@Override
	public void add(int gameID, CommandTemplate cmd) {
		throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
	}

	/**
	 * gets the list of commands from the position (pos) to the end of the list
	 */
	@Override
	public ArrayList<CommandTemplate> getFromIndex(int gameID, int pos) {
		throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
	}


	
}
