/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package server.api.map;

import java.util.ArrayList;

/**
 *
 * @author Wesley
 */
public class Hex {
	private ArrayList<Edge> edges;
	private boolean isLand;
	private String landType;
	private Location location;
	private ArrayList<Vertex> vertexes;
	
	String[] edLookup = {"NW","N","NE","SE","S","SW"};
	String[] vdLookup = {"W","NW","NE","E","SE","SW"};
	
	public Hex(){
		edges = new ArrayList<>();
		isLand = true;
		landType = "ore";
		location = new Location(false);
		vertexes = new ArrayList<>();
		
		for(int i = 0; i < 6; i++){
			edges.add(new Edge());
			vertexes.add(new Vertex());
		}
	}
	
	public void updateEdgeOwner(String direction, int ownerID){
		edges.get(indexEdgeOf(direction)).setOwner(ownerID);
		//edges.get(direction).setOwner(ownerID);
	}
	
	public void updateVertexOwner(String direction, int ownerID){
		vertexes.get(indexVertexOf(direction)).setOwner(ownerID);
		//vertexes.get(direction).setOwner(ownerID);
	}
	
	private int indexEdgeOf(String element){
		int index = -1;
		for(int i = 0; i < edges.size(); i++){
			if(element.equals(edLookup[i])){
				index = i;
			}
		}
		return index;
	}
	
	private int indexVertexOf(String element){
		int index = -1;
		for(int i = 0; i < edges.size(); i++){
			if(element.equals(vdLookup[i])){
				index = i;
			}
		}
		return index;
	}
}

