package ejb;

import java.util.Date;

import javax.annotation.Resource;
import javax.ejb.LocalBean;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.jms.JMSConsumer;
import javax.jms.JMSContext;
import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.ObjectMessage;
import javax.jms.Queue;
import javax.jms.TextMessage;

import common.dto.User;
import common.model.UserModel;

/**
 * Session Bean implementation class MessageReceiverSync
 */
@Stateless
@LocalBean
public class MessageReceiverSync implements MessageReceiverSyncLocal {

    @Inject JMSContext context;
    
	@Resource(mappedName = "java:/jms/queue/watcherqueue") Queue queue;
	
	public User receiveMessage() {
		
		JMSConsumer consumer = context.createConsumer(queue);
		Message message = consumer.receive(3000);
		User user = new User();
		try{
			
			if (message instanceof TextMessage)
			{
				System.out.println("Queue: I received a TextMessage at " + new Date());			
				TextMessage textMessage = (TextMessage)message;
				String textMsg = textMessage.getText();
				System.out.println(">>> receiveMessage() - " + textMsg);
			}
			else if(message instanceof ObjectMessage)
			{
				System.out.println("Queue: I received an ObjectMessage at " + new Date());
				ObjectMessage objectMessage = (ObjectMessage) message;
				user = (User) objectMessage.getObject();
				
				System.out.println("User Details: ");
				System.out.println("login:"+user.getLogin());
				System.out.println("pwd:"+user.getPassword());
			}	
			//context.acknowledge();
		} catch (JMSException e) {
	        e.printStackTrace();
	    }
		
		return user;
	}

}
