
// UTF-8 encoding rules:
// 0x0000 - 0x007F:	0xxxxxxx
// 0x0080 - 0x07FF:	110xxxxx 10xxxxxx
// 0x0800 - 0xFFFF:	1110xxxx 10xxxxxx 10xxxxxx

function convertUTF8ToUnicode(u)
{
	if(window.netscape == undefined)
		return manualConvertUTF8ToUnicode(u);
	else
		return mozConvertUTF8ToUnicode(u);
}

function manualConvertUTF8ToUnicode(utf)
{
	var uni = utf;
	var src = 0;
	var dst = 0;
	var b1, b2, b3;
	var c;
	while(src < utf.length)
		{
		b1 = utf.charCodeAt(src++);
		if(b1 < 0x80)
			dst++;
		else if(b1 < 0xE0)
			{
			b2 = utf.charCodeAt(src++);
			c = String.fromCharCode(((b1 & 0x1F) << 6) | (b2 & 0x3F));
			uni = uni.substring(0,dst++).concat(c,utf.substr(src));
			}
		else
			{
			b2 = utf.charCodeAt(src++);
			b3 = utf.charCodeAt(src++);
			c = String.fromCharCode(((b1 & 0xF) << 12) | ((b2 & 0x3F) << 6) | (b3 & 0x3F));
			uni = uni.substring(0,dst++).concat(c,utf.substr(src));
			}
	}
	return(uni);
}

function mozConvertUTF8ToUnicode(u)
{
	try
		{
		netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
		var converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
		converter.charset = "UTF-8";
		}
	catch(e)
		{
		return manualConvertUTF8ToUnicode(u);
		} // fallback
	var s = converter.ConvertToUnicode(u);
	var fin = converter.Finish();
	return (fin.length > 0) ? s+fin : s;
}

function convertUnicodeToUTF8(s)
{
	if(window.netscape == undefined)
		return manualConvertUnicodeToUTF8(s);
	else
		return mozConvertUnicodeToUTF8(s);
}

function manualConvertUnicodeToUTF8(s)
{
	var re = /[^\u0000-\u007F]/g ;
	return s.replace(re, function($0) {return("&#" + $0.charCodeAt(0).toString() + ";");})
}

function mozConvertUnicodeToUTF8(s)
{
	try
		{
		netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
		var converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
		converter.charset = "UTF-8";
		}
	catch(e)
		{
		return manualConvertUnicodeToUTF8(u);
		} // fallback
	var u = converter.ConvertFromUnicode(s);
	var fin = converter.Finish();
	if(fin.length > 0)
		return u + fin;
	else
		return u;
}

function saveFile(fileUrl, content)
{
	var r = null;
	if((r == null) || (r == false))
		r = mozillaSaveFile(fileUrl, content);
	if((r == null) || (r == false))
		r = ieSaveFile(fileUrl, content);
	if((r == null) || (r == false))
		r = javaSaveFile(fileUrl, content);
	return(r);
}

function loadFile(fileUrl)
{
	var r = null;
	if((r == null) || (r == false))
		r = mozillaLoadFile(fileUrl);
	if((r == null) || (r == false))
		r = ieLoadFile(fileUrl);
	if((r == null) || (r == false))
		r = javaLoadFile(fileUrl);
	return(r);
}

// Returns null if it can't do it, false if there's an error, true if it saved OK
function ieSaveFile(filePath, content)
{
	try
		{
		var fso = new ActiveXObject("Scripting.FileSystemObject");
		}
	catch(e)
		{
		//alert("Exception while attempting to save\n\n" + e.toString());
		return(null);
		}
	var file = fso.OpenTextFile(filePath,2,-1,0);
	file.Write(content);
	file.Close();
	return(true);
}

// Returns null if it can't do it, false if there's an error, or a string of the content if successful
function ieLoadFile(filePath)
{
	try
		{
		var fso = new ActiveXObject("Scripting.FileSystemObject");
		var file = fso.OpenTextFile(filePath,1);
		var content = file.ReadAll();
		file.Close();
		}
	catch(e)
		{
		//alert("Exception while attempting to load\n\n" + e.toString());
		return(null);
		}
	return(content);
}

// Returns null if it can't do it, false if there's an error, true if it saved OK
function mozillaSaveFile(filePath, content)
{
	if(window.Components)
		try
			{
			netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
			var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
			file.initWithPath(filePath);
			if (!file.exists())
				file.create(0, 0664);
			var out = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
			out.init(file, 0x20 | 0x02, 00004,null);
			out.write(content, content.length);
			out.flush();
			out.close();
			return(true);
			}
		catch(e)
			{
			//alert("Exception while attempting to save\n\n" + e);
			return(false);
			}
	return(null);
}

// Returns null if it can't do it, false if there's an error, or a string of the content if successful
function mozillaLoadFile(filePath)
{
	if(window.Components)
		try
			{
			netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
			var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
			file.initWithPath(filePath);
			if (!file.exists())
				return(null);
			var inputStream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
			inputStream.init(file, 0x01, 00004, null);
			var sInputStream = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance(Components.interfaces.nsIScriptableInputStream);
			sInputStream.init(inputStream);
			return(sInputStream.read(sInputStream.available()));
			}
		catch(e)
			{
			//alert("Exception while attempting to load\n\n" + e);
			return(false);
			}
	return(null);
}

function javaUrlToFilename(url)
{
	var f = "//localhost";
	if(url.indexOf(f) == 0)
		return url.substring(f.length);
	var i = url.indexOf(":");
	if(i > 0)
		return url.substring(i-1);
	return url;
}

function javaSaveFile(filePath, content)
{
	try
		{
		if(document.applets["TiddlySaver"])
			return document.applets["TiddlySaver"].saveFile(javaUrlToFilename(filePath),"UTF-8",content);
		}
	catch(e)
		{
		}
	try
		{
		var s = new java.io.PrintStream(new java.io.FileOutputStream(javaUrlToFilename(filePath)));
		s.print(content);
		s.close();
		}
	catch(e)
		{
		return null;
		}
	return true;
}

function javaLoadFile(filePath)
{
	try
		{
	if(document.applets["TiddlySaver"])
		return String(document.applets["TiddlySaver"].loadFile(javaUrlToFilename(filePath),"UTF-8"));
		}
	catch(e)
		{
		}
	var content = [];
	try
		{
		var r = new java.io.BufferedReader(new java.io.FileReader(javaUrlToFilename(filePath)));
		var line;
		while ((line = r.readLine()) != null)
			content.push(new String(line));
		r.close();
		}
	catch(e)
		{
		return null;
		}
	return content.join("\n");
}


