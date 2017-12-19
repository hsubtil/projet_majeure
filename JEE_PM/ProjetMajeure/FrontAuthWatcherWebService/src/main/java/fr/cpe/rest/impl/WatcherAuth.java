package fr.cpe.rest.impl;

import java.util.logging.Logger;

import javax.ejb.EJB;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

import common.dto.User;
import ejb.MessageReceiverSyncLocal;
import ejb.MessageSenderLocal;
import ejb.MessageSenderQueueLocal;
import fr.cpe.rest.IWatcherAuth;

public class WatcherAuth implements IWatcherAuth{
	
	//private static final long serialVersionUID = 1L;
	// private JmsSender sender;
	@EJB
	MessageSenderLocal senderTopic;
	@EJB
	MessageReceiverSyncLocal receiverQueue;
	
	@EJB
	MessageSenderQueueLocal senderQueue;
	
	Logger logger= Logger.getLogger(WatcherAuth.class.getName());
	
	@Override
	public User getUser(User user){ 
		System.out.println("WS user param send to topic: " + user.toString());
			
		//senderQueue.sendMessage(fullUser);
		
		//send to topic
		senderTopic.sendMessage(user);
				
		//receive from queue
		user = receiverQueue.receiveMessage();			
		System.out.println("WS user from queue: " + user.toString());
		
		user.setValidAuth(user.getRole() != null);
		

		if (user == null) {
			throw new WebApplicationException("User null", Response.Status.UNAUTHORIZED);
		}		
		return user;
	}
	

}
