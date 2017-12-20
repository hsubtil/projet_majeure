package common.dto;


import java.io.Serializable;

import javax.jms.Message;
import javax.validation.constraints.NotNull;

import common.model.Role;



public class User implements Serializable {
		
	@NotNull
	private String email;
	
	@NotNull
	private String password;
	
	
	private boolean validAuth;
	
	private String role;

	public String getLogin() {
		return this.email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return this.password;
	}
	
	public void setPassword(String password) {
		this.password = password;
	}
	
	public boolean getValidAuth() {
		return this.validAuth;
	}
	
	public void setValidAuth(boolean validAuth) {
		this.validAuth = validAuth;
	}
	
	public String getRole() {
		return this.role;
	}
	
	public void setRole(String role2) {
		this.role = role2;
	}
	
	public void setRole(Role role) {
		this.role = role.name();
	}

	@Override
	public String toString() {
		return "User [login=" + email + ", password=" + password + ", validAuth=" + validAuth + ", role=" + role +  "]";
	}

}