package ejb;

import javax.ejb.EJB;
import javax.ejb.LocalBean;
import javax.ejb.Stateless;

import common.dto.User;
import common.model.Role;

/**
 * Session Bean implementation class Auth
 */
@Stateless
@LocalBean
public class WatcherAuthUser implements WatcherAuthUserLocal {

    /**
     * Default constructor. 
     */
	@EJB UserDao userDao;
	
	@Override
	public User Auth(User user) {
		
		System.out.println("User Details: ");
		System.out.println("login:"+user.getLogin());
		System.out.println("pwd:"+user.getPassword());
		
		Role currentTestRole = userDao.CheckUser(user);
		
		System.out.println("Role:"+ currentTestRole);
		if (currentTestRole == null) {
			System.out.println("Auth Failed");
		}   
		else
		{
			user.setRole(currentTestRole);
		}
		return user;
	}

}
