import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Date;
import java.util.HashMap;

import org.apache.commons.io.FileUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.Platform;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class start {
	
	static WebDriver driver;
	
	static void setup(boolean headless){
		DesiredCapabilities capabilities;
		capabilities = new DesiredCapabilities();
        capabilities.setPlatform(Platform.WINDOWS);
        
        capabilities.setBrowserName("chrome");
        ChromeOptions options = new ChromeOptions();
        options.addArguments("-incognito");
        if (headless) { 
            options.addArguments("--headless");
            options.addArguments("window-size=1680,1050");
        } else {
            options.addArguments("--start-maximized");
        }
        options.merge(capabilities);
        try {
			driver = new RemoteWebDriver(new URL("http://localhost:4444/wd/hub"), options );
		} catch (MalformedURLException e) {
			e.printStackTrace();
		}
	}
	
	
	
	public static void main(String[] args) {
		setup(false);
		HashMap<String, String> map = new XMLParser("config.xml").parse();
		
		driver.navigate().to(map.get("url")+"/phpmyadmin/sql.php?server=1&db="+map.get("dbname"));
		
		//login(map.get("user"), map.get("passwort"));
		
		driver.navigate().to(map.get("url") + "/phpmyadmin/db_structure.php?server=1&db="+map.get("dbname"));
		
		new WebDriverWait(driver, 10).until(ExpectedConditions.elementToBeClickable(
			By.xpath("//*[@href=\"db_export.php?db="+map.get("dbname")+"\"]"))).click();
		
		new WebDriverWait(driver, 10).until(ExpectedConditions.elementToBeClickable(
			By.id("buttonGo"))).click();
		
		try{
			Thread.sleep(3000);
		}catch(Exception e){
			e.printStackTrace();
		}
		
		File downloaded = new File("C:\\Users\\mistueh\\Downloads\\"+map.get("dbname")+".sql");
		String destFileNameMove = map.get("location") + getDateToday();
		File destFileMove = new File(destFileNameMove);
		
		if (downloaded.renameTo(destFileMove)) {
			System.out.println("lokales backup erfolgreich erstellt");
		}else{
			System.out.println("datei: \"" + destFileNameMove + "\" ist schon vorhanden");
		}

		driver.quit();
	}
	
	static String format(int i){
		String s = String.valueOf(i);
		if (s.length() == 1) {
			s = "0" + s;
		}
		return s;
	}
	
	static String getDateToday(){
		Date now = new Date();
		return format(now.getDate()) + "." + 
			   format(now.getMonth()+1) + "." + 
			   format(now.getYear()+1900) + " " + 
			   format(now.getHours()) + " UHR.sql";
	}
	
	static void login(String user, String passwort){
		By userNameField = By.id("input_username");
		By passwortField = By.id("input_password");
		By okButton = By.id("input_go");
		
		new WebDriverWait(driver, 10).until(ExpectedConditions.elementToBeClickable(userNameField));
		driver.findElement(userNameField).sendKeys(user);
		driver.findElement(passwortField).sendKeys(passwort);
		
		driver.findElement(okButton).click();
	}
	
	
	
	
	
	
	

}
