package ejb;

import javax.ejb.Local;

import common.dto.User;
import common.model.UserModel;

@Local
public interface MessageSenderQueueLocal {
	
	public void sendMessage(String message);
	
	public void sendMessage(User user);

}
