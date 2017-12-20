package fr.cpe.rest.impl;

import javax.ejb.EJB;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

import common.dto.User;
import ejb.WatcherAuthUserLocal;
import fr.cpe.rest.IWatcherAuth;

public class WatcherAuth implements IWatcherAuth{
	
	//private static final long serialVersionUID = 1L;
	// private JmsSender sender;
	
	@EJB
	WatcherAuthUserLocal auth;
	
	@Override
	public User getUser(User user){ 
		System.out.println("WS user received: " + user.toString());
			
		user = auth.Auth(user);
		
		user.setValidAuth(user.getRole() != null);
		

		if (user == null) {
			throw new WebApplicationException("User null", Response.Status.UNAUTHORIZED);
		}		
		return user;
	}
	

}
