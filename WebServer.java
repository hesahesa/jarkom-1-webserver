import java.io.*;
import java.net.*;
import java.util.*;

/**
 * Tugas 1 Jarkom, Simple Web Server.
 * Prahesa Kusuma Setia (0906510470)
 */
public final class WebServer { 
	public static void main(String argv[]) throws Exception { 
		int port = Integer.parseInt(argv[0]);
		if(port < 1024 || port > 65535) {
			throw new Exception("Invalid port number");
		}
		ServerSocket welcomeSocket = new ServerSocket(port);
		while(true) {
			Socket connectionSocket = welcomeSocket.accept();
			// Construct an object to process the HTTP request message. 
			HttpRequest request = new HttpRequest(connectionSocket);
			// Create a new thread to process the request. 
			Thread thread = new Thread(request);
			// Start the thread. 
			thread.start(); 
		}
	} 
}

final class HttpRequest implements Runnable { 
	final static String CRLF = "\r\n";
	Socket socket;
	
	// Constructor public 
	HttpRequest(Socket socket) throws Exception { 
		this.socket = socket; 
	}
	
	// Implement the run() method of the Runnable interface. 
	public void run() { 
		try {
			processRequest();
		}
		catch (Exception ex) {
			ex.printStackTrace();
		}
	}

	private void processRequest() throws Exception { 
		InputStream is = socket.getInputStream();
		DataOutputStream os = new DataOutputStream(socket.getOutputStream());
		BufferedReader br = new BufferedReader(new InputStreamReader(is));
		// Get the request line of the HTTP request message. 
		String requestLine = br.readLine();
		// Display the request line. System.out.println();
		System.out.println(requestLine);
		
		// Get and display the header lines. 
		String headerLine = null; 
		while ((headerLine = br.readLine()).length() != 0) 
		{ 
			System.out.println(headerLine); 
		}
		
		// Extract the filename from the request line. 
		StringTokenizer tokens = new StringTokenizer(requestLine); 
		tokens.nextToken();  
		// skip over the method, which should be "GET" 
		String fileName = tokens.nextToken();
		// Prepend a "." so that file request is within the current directory. 
		fileName = "." + fileName;
		
		fileName = fileName.replace("%20"," ");
		
		//check if directory
		boolean showlisting = false;
		File tester = new File(fileName);
		System.out.println(fileName+" "+tester.exists());
		if(tester.isDirectory()) {
			File indextester = new File(fileName+"/index.html");
			System.out.println(fileName+"/index.html"+" "+indextester.exists());
			if(indextester.exists()) {
				fileName += "/index.html";
			}
			else {
				showlisting = true;
			}
		}
		
		// Open the requested file. 
		FileInputStream fis = null; 
		boolean fileExists = true; 
		try { 
			fis = new FileInputStream(fileName); 
		} 
		catch (FileNotFoundException e) { 
			fileExists = false; 
		}
		
		// Construct the response message. 
		String statusLine = null; 
		String contentTypeLine = null; 
		String entityBody = null; 
		if (fileExists) { 
			statusLine = "HTTP/1.0 200 OK" + CRLF; 
			contentTypeLine = "Content-type: " + contentType( fileName ) + CRLF; 
		}
		else if(showlisting) {
			statusLine = "HTTP/1.0 200 OK" + CRLF;
			contentTypeLine = "Content-Type: text/html; charset=iso-8859-1" + CRLF;
			entityBody = showDirectory(tester);
		}
		else {
			statusLine = "HTTP/1.0 404 Not Found" + CRLF;  
			contentTypeLine = "Content-Type: text/html; charset=iso-8859-1" + CRLF; 
			entityBody = "" + "" + "Not Found"; 
		}
		
		// Send the status line. 
		os.writeBytes(statusLine);

		// Send the content type line. 
		os.writeBytes(contentTypeLine);

		// Send a blank line to indicate the end of the header lines.
		os.writeBytes(CRLF);
		
		// Send the entity body. 
		if (fileExists)	{ 
			sendBytes(fis, os); 
			fis.close(); 
		 }
		else { 
			os.writeBytes(entityBody); 
		}
		
		// Close streams and socket. 
		os.close(); 
		br.close(); 
		socket.close();
	}
	
	private static String showDirectory(File dir) {
		StringBuilder stbuild = new StringBuilder();
		File parent = dir.getParentFile();
		File[] lists = dir.listFiles();
		stbuild.append("<html>");
		stbuild.append("<head><title>index of"+ dir.toString().replace("\\", "/").replace("%20"," ") +"</title><style type=\"text/css\">body,html {background:#fff;font-family:\"Bitstream Vera Sans\",\"Lucida Grande\",\"Lucida Sans Unicode\",Lucidux,Verdana,Lucida,sans-serif;}tr.e {background:#f4f4f4;}th,td {padding:0.1em 0.5em;}th {text-align:left;font-weight:bold;background:#eee;border-bottom:1px solid #aaa;}#list {border:1px solid #aaa;width:100%;}a {color:#a33;}a:hover {color:#e33;} td.r {text-align:right}</style></head>");
		stbuild.append("<body> <h1>Index of "+ dir.toString().replace("\\", "/").replace("%20"," ")+"</h1><table id=\"list\" cellpadding=\"0.1em\" cellspacing=\"0\"><colgroup><col width=\"55%\"/><col width=\"20%\"/><col width=\"25%\"/></colgroup><thead><tr><th>File Name</th><th>File Size</th><th>Date</th></tr></thead><tbody><tr class=\"o\"><td><a href=\"/"+parent.getPath().replace("\\", "/").replace("%20"," ")+"\">Parent directory/</a></td><td class=\"r\">-</td><td class=\"r\">-</td></tr>");
		
		boolean bool = true;
		for(File fl : lists) {
			Date d = new Date(fl.lastModified());
			if(fl.isFile()) {
				stbuild.append("<tr class=\""+(bool? "e":"o")+"\"><td><a href=\"/"+fl.getPath().replace("\\", "/").replace("%20"," ")+"\">"+fl.getName()+"</a></td><td class=\"r\">"+fl.length()+" kB</td><td class=\"r\">"+d.toString()+"</td></tr>");
			} else {
				stbuild.append("<tr class=\""+(bool? "e":"o")+"\"><td><a href=\"/"+fl.getPath().replace("\\", "/").replace("%20"," ")+"\">"+fl.getName()+"/</a></td><td class=\"r\"></td><td class=\"r\">"+d.toString()+"</td></tr>");
			}
			bool = !bool;
		}
		stbuild.append("</tbody></table></body>");
		stbuild.append("</html>");
		return stbuild.toString();
	}
	
	private static void sendBytes(FileInputStream fis, OutputStream os) throws Exception { 
		// Construct a 1K buffer to hold bytes on their way to the socket.
		byte[] buffer = new byte[1024]; 
		int bytes = 0;
		// Copy requested file into the socket's output stream. 
		while((bytes =fis.read(buffer)) != -1 ) 
		{ 
			os.write(buffer, 0, bytes); 
		} 
	}
	
	private static String contentType(String fileName) {
		fileName = fileName.toLowerCase();
		if(fileName.endsWith(".htm") || fileName.endsWith(".html")) { 
			return "text/html"; 
		}
		if(fileName.endsWith(".css")) { 
			return "text/css"; 
		}
		if(fileName.endsWith(".js")) { 
			return "text/javascript"; 
		}
		if(fileName.endsWith(".gif")) { 
			return "image/gif"; 
		}
		if(fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) { 
			return "image/jpeg"; 
		}
		return "application/octet-stream"; 
	}
} 
