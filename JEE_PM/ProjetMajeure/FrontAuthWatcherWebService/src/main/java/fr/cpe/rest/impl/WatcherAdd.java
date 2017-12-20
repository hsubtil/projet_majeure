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
		
		add.AddUser(user);
		System.out.println("WS user addes to DB: " + user.toString());		
		
		return user.getValidAuth();
	}

}
