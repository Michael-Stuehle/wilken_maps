import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.*;

public class Mail {
	
	private static final String HOST = "mail1.rechenzentrum.wilken";
	
	public static void main(String[] args){
		sendMail(
			args[0],
			"wilken maps passwort zurücksetzen",
			args[1]
		);
	}
	
	/**
	 * prueft, ob die adresse das format "(belibig viele chars)@(2-6 chars).(2-3 chars)" hat
	 * @param address
	 * @return
	 */
	public static boolean adresseGueltig(String address){
		return address.matches(".*@.{2,6}\\..{2,3}");
	}
	
	/**
	 * versendet eine email, alle empfaenger bekommen eine extra mail --> die anderen empfaenger sind nicht sichtbar
	 * @param empfaenger
	 * @param subject
	 * @param text
	 * @return
	 */
	public static boolean sendMail(String empfaenger, String subject, String text) {    
		// Get system properties
	    Properties properties = System.getProperties();
	
	    // Setup mail server
	    properties.setProperty("mail.smtp.host", HOST);
	      
	    // Get the default Session object.
	    Session session = Session.getDefaultInstance(properties);
	
	    try {
    		if (!adresseGueltig(empfaenger)) {
				System.out.println("die E-mail adresse: \""+empfaenger+"\" ist nicht gueltig.");
				return false;
			}
    		
	        // Create a default MimeMessage object.
	        MimeMessage message = new MimeMessage(session);
	        message.setFrom(new InternetAddress("wilken-maps@wilken.de"));
	                 
	        message.addRecipient(Message.RecipientType.TO, new InternetAddress(empfaenger));
	        
	        // Set Subject: header field
	        message.setSubject(subject);

	        // Now set the actual message
	       
	        message.setContent(
        		"<font size =\"2\" face=\"arial\" >"+
        				"neues passwort (nur für 1 Stunde gültig): " + text + 
				"<font/>", "text/html; charset=utf-8");

	        // Send message
	        Transport.send(message);
	    	 
	         return true;
	    } catch (MessagingException mex) {
	    	System.out.println(mex + " ");
	    	return false;
	    }
    }
}
  
  
 
