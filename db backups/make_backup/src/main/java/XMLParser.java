

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

public class XMLParser {
	
	private String filename;
	private Document root;

	public XMLParser(String filename) {
		this.filename = filename;
	}
	
	private String TryGetTextContext(Element element, String name){
		Node list = element.getElementsByTagName(name).item(0);
		String result;
		try{
			result = list.getTextContent();
		}catch(Exception e){
			result = "";
		}
		return result;
	}
	
	public HashMap<String, String> parse(){
		HashMap<String, String> items = new HashMap<String, String>();
		try {
			File inputFile = new File(filename);
	        DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
	        DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
	        root = dBuilder.parse(inputFile);
	        root.getDocumentElement().normalize();
	         
	        NodeList nList = root.getElementsByTagName("class");
	        
	        Node nNode = nList.item(0);

	        Element eElement = (Element) nNode;
          
	        items.put("url", TryGetTextContext(eElement, "phpMyAdminUrl"));
	        items.put("user", TryGetTextContext(eElement, "dbUser"));
	        items.put("passwort", TryGetTextContext(eElement, "dbPasswort"));
	        items.put("dbname", TryGetTextContext(eElement, "dbName"));
	        items.put("location", TryGetTextContext(eElement, "saveFileLocation"));
          
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
		return items;
	}
}
