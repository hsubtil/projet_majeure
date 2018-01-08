package ejb;

import javax.ejb.EJB;
import javax.ejb.LocalBean;
import javax.ejb.Stateless;


import common.dto.User;

/**
 * Session Bean implementation class AddUser
 */
@Stateless
@LocalBean
public class WatcherAddUser implements WatcherAddUserLocal {

    /**
     * Default constructor. 
     */

	@EJB UserDao userDao;
	
	@Override
	public User AddUser(User user) {
		System.out.println("User Details: ");
		System.out.println("login:"+user.getLogin());
		System.out.println("pwd:"+user.getPassword());
		System.out.println("role:"+user.getRole());
		
		user.setValidAuth(userDao.AddUser(user));
		
		return user;
	}

}
