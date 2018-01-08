package model;

import common.model.UserModel;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.ejb.Singleton;
import javax.ejb.Startup;


@Singleton
@Startup
public class DataContainer {

	
	private List <UserModel> listUser;
	

	@PostConstruct
	public void init(){
		
		UserModel user1 = new UserModel ();
		UserModel user2 = new UserModel ();
		UserModel user3 = new UserModel ();
		
		user1.setLogin("toto");
		user1.setPassword("blague");
		user1.setRole("NONE");
		//user1.setRole(Role.NONE);
		
		user2.setLogin("nabil");
		user2.setPassword("striker18");
		user2.setRole("ADMIN");
		//user2.setRole(Role.ADMIN);
		
		user3.setLogin("bastien");
		user3.setPassword("kikou");
		user3.setRole("USER");
		//user3.setRole(Role.USER);
		
		
		this.listUser = new ArrayList<UserModel>();
		this.listUser.add(user1);
		this.listUser.add(user2);
		this.listUser.add(user3);
	}
	
	public String checkUser(UserModel user) {
		
		String role = "NONE";
		
		for(UserModel currentUser : this.listUser ){
			
			if(user.getLogin().equals( currentUser.getLogin() ) 
				&& user.getPassword().equals( currentUser.getPassword() ) ){
				
				role = currentUser.getRole();
			}
		}	
		return role;
	}

}
