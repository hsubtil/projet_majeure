package ejb;

import javax.ejb.Local;

import common.dto.User;

@Local
public interface WatcherAuthUserLocal {
	
	public User Auth(User user);

}
