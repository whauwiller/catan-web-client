/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package server;

import server.api.utils.UserLogin;
import server.api.utils.iUserLogin;

import com.google.inject.*;

/**
 *
 * @author Wesley
 */
public class ProductionModule extends AbstractModule {

	@Override
	protected void configure() {
		bind(iUserLogin.class).to(UserLogin.class);
	}
	
}
