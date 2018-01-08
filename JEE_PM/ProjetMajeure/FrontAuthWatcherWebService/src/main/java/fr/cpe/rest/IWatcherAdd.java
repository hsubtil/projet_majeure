package fr.cpe.rest;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import common.dto.User;

@Path ("/WatcherAddUser")
public interface IWatcherAdd {
	
	@POST
	@Consumes("application/json")
	@Produces("application/json")
	@Path("/")
	boolean addUser ( User user);	
}
