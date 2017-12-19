package ejb;

import javax.ejb.Local;

import common.dto.User;

@Local
public interface MessageSenderLocal {

	public void sendMessage(String message);
	
	public void sendMessage(User user);
}
