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
		
		var response = new Ajax.Request(path, {asynchronous: false, method: "get"});

		if ( response.transport.status == 404 || 
			(response.transport.status == 0 && response.transport.responseText == '') ) { // this means the template was not found
	        this.update(path, this.INVALID_PATH);
	        return null;
	    }
	    var template = new EjsCompiler(response.transport.responseText, this.type);
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




