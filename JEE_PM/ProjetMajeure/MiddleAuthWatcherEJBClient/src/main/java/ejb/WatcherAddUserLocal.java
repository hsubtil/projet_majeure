package ejb;

import javax.ejb.Local;

import common.dto.User;

@Local
public interface WatcherAddUserLocal {
	
	public User AddUser(User user);

}
