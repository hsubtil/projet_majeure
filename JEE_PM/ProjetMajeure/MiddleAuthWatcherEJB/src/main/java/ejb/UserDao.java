package ejb;

import java.util.List;

import javax.annotation.PostConstruct;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;

import common.dto.User;
import common.model.Role;
import common.model.UserModel;

@Stateless
public class UserDao {

	
	@PersistenceContext EntityManager em;
	public UserDao() {
		// TODO Auto-generated constructor stub
	}
		
	public Role CheckUser(User user) {
		
		UserModel userQuery = null;

		
	try{userQuery = (UserModel) em.createQuery("from UserModel u where u.login = :login "
				+ " AND u.password = :password")
				.setParameter("login",  user.getLogin())
				.setParameter("password", user.getPassword())
				.getSingleResult();
				
	}catch(NoResultException e){
		System.out.println("NoResultException: User does not exist: ");
		System.out.println("login:"+user.getLogin());
		System.out.println("pwd:"+user.getPassword());
		return null;
	}
			
		return userQuery.role();
	}
	
	public boolean AddUser(User user) {
		
	System.out.println("AddUser");
	UserModel userToAdd = new UserModel();
	userToAdd.setLogin(user.getLogin());
	userToAdd.setPassword(user.getPassword());
	
	userToAdd.setRole(user.getRole());
	
	try{
		em.persist(userToAdd);
		em.getTransaction().commit();
		em.getTransaction().begin();		
	}
	catch(Exception e){
		return false;
	}
	
		
	
	return true;
	}
}
