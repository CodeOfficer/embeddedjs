Templates = function(type, cache, folder ){
	cache = cache == null ? true : false;
	
	var templates_directory = {} //nice and private container
	
	this.get = function(path){
		if(cache == false) return null;
		if(templates_directory[path]) return templates_directory[path];
  		return null;
	}
	
	this.update = function(path, template) { templates_directory[path] = template }
	
	this.INVALID_PATH =  -1;
	this.folder = folder
	this.type = type || '<'
}

Templates.prototype = {
	find : function(path){
		var template = this.get(path)
	    
		if (template) return template;
	    if (template == this.INVALID_PATH) return null;
		
		var text = Templates.request(path)
		if(text == null){
			this.update(path, this.INVALID_PATH);
	        return null;
		}

	    var template = new EjsCompiler(text, this.type);
		template.path = path;
	    try {
			template.compile();
		} catch(e) {
			throw 'error processing template'
		}
		
    	this.update(path, template);
		
		return template;
	}
}
if(typeof Prototype != 'undefined') {
	Templates.request = function(path){
		var response = new Ajax.Request(path, {asynchronous: false, method: "get"});
		if ( response.transport.status == 404 || response.transport.status == 2 ||
			(response.transport.status == 0 && response.transport.responseText == '') ) return null;
	    return response.transport.responseText
	}
}else
{
	Templates.request = function(path){
	   var factories = [function() { return new XMLHttpRequest(); },function() { return new ActiveXObject("Msxml2.XMLHTTP"); },function() { return new ActiveXObject("Microsoft.XMLHTTP"); }];
	   var request
	   for(var i = 0; i < factories.length; i++) {
	        try {
	            request = factories[i]();
	            if (request != null)  break;
	        }
	        catch(e) { continue;}
	   }
	   request.open("GET", path, false);
	   
	   try{request.send(null);}
	   catch(e){return null;}
	   
	   if ( request.status == 404 || request.status == 2 ||(request.status == 0 && request.responseText == '') ) return null;
	   
	   return request.responseText
	}
}


