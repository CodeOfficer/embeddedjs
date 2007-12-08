JMVCTest = {
	APPLICATION_NAME : 'EJS',
	TEST_DESCRIPTION : 'This tests templating',
	perform_test : function() {
	  new Test.Unit.Runner({
	  	
		setup: function() {
		},
		teardown: function() {
		},
	    test_find_and_process: function() { with(this) {
			var templates = new Templates()
			var object_to_process = {animals: ['sloth', 'bear', 'monkey']};
			var result = templates.find('templates/test.ejs').process(object_to_process)
			assertEqual("<ul>\n<li>sloth</li>\n\n<li>bear</li>\n\n<li>monkey</li>\n</ul>", result)
			
	    }},
		test_find_and_eval: function() { with(this) {
			var templates = new Templates()
			var animals = ['sloth', 'bear', 'monkey'];
			var template =  templates.find('templates/test.ejs')
			var compiled = eval(template.out);
			assertEqual("<ul>\n<li>sloth</li>\n\n<li>bear</li>\n\n<li>monkey</li>\n</ul>", compiled)
	    }},
		test_caching: function() { with(this) {
			// create a basic template to insert
			var ejs = "<%% replace_me %>"+
					  "<ul><% animals.each(function(animal){%>" +
			               "<li><%= animal %></li>" + 
				      "<%});%></ul>";
			var first_template = new EjsCompiler(ejs, '<')
			first_template.compile()
			
			var templates = new Templates()
			templates.update('templates/test.ejs', first_template )
			
			var object_to_process = {animals: ['sloth', 'bear', 'monkey']};
			var result = templates.find('templates/test.ejs').process(object_to_process)
			assertEqual("<% replace_me %><ul><li>sloth</li><li>bear</li><li>monkey</li></ul>", result)
	    }},
		test_template_not_found : function() { with(this) {
			var templates = new Templates()
			assertNull( templates.find('templates/test_not_there.ejs') )
	    }}
		
		//error
	    
	  }, "testlog");
  }
}