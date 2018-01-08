package fr.cpe.rest.impl;

import javax.ejb.EJB;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

import common.dto.User;
import ejb.WatcherAddUserLocal;
import fr.cpe.rest.IWatcherAdd;

public class WatcherAdd implements IWatcherAdd {

	@EJB
	WatcherAddUserLocal add;
	
	@Override
	public boolean addUser(User user) {
		System.out.println("WS user received: " + user.toString());
		
		user = add.AddUser(user);			
		if(user.getValidAuth()) {
			System.out.println("WS user added to DB: " + user.toString());
		}
		return user.getValidAuth();
	}

}
