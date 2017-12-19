package ejb;

import javax.ejb.Local;

import common.dto.User;
import common.model.UserModel;

@Local
public interface MessageReceiverSyncLocal {
	
	public User receiveMessage();

}
