JMVCTest = {
	APPLICATION_NAME : 'EJS',
	TEST_DESCRIPTION : 'This tests ejs',
	perform_test : function() {
	  new Test.Unit.Runner({
	  	
		setup: function() {
		},
		teardown: function() {
		},
	    test_render_with_left_bracket: function() { with(this) {
			var animals = ['sloth', 'bear', 'monkey'];
			var ejs = "<ul>[% animals.each(function(animal){%]" +
			               "<li>[%= animal %]</li>" + 
				      "[%});%]</ul>";
			var compiler = new EjsCompiler(ejs);		
			compiler.compile();	
			//assertEqual('___ejsO = "";; ___ejsO += "<ul>";  animals.each(function(animal){; ___ejsO += "<li>"; ___ejsO += (( animal ).toString()); ___ejsO += "</li>"; });; ___ejsO += "</ul>";', compiler.out)
			var compiled = eval(compiler.out);
			assertEqual("<ul><li>sloth</li><li>bear</li><li>monkey</li></ul>", compiled)
	    }},
	    test_render_with_carrot: function() { with(this) {
			var animals = ['sloth', 'bear', 'monkey'];
			var ejs = "<ul><% animals.each(function(animal){%>" +
			               "<li><%= animal %></li>" + 
				      "<%});%></ul>";
			var compiler = new EjsCompiler(ejs, '<');		
			compiler.compile();	
			//assertEqual('___ejsO = "";; ___ejsO += "<ul>";  animals.each(function(animal){; ___ejsO += "<li>"; ___ejsO += (( animal ).toString()); ___ejsO += "</li>"; });; ___ejsO += "</ul>";', compiler.out)
			var compiled = eval(compiler.out);
			assertEqual("<ul><li>sloth</li><li>bear</li><li>monkey</li></ul>", compiled)
	    }},
		test_render_and_process: function() { with(this) {
			var object_to_process = {animals: ['sloth', 'bear', 'monkey']};
			var ejs = "<ul><% animals.each(function(animal){%>" +
			               "<li><%= animal %></li>" + 
				      "<%});%></ul>";
			var compiler = new EjsCompiler(ejs, '<');		
			compiler.compile();	
			
			assertEqual("<ul><li>sloth</li><li>bear</li><li>monkey</li></ul>", compiler.process(object_to_process) )
	    }},
		test_render_with_double: function() { with(this) {
			var animals = ['sloth', 'bear', 'monkey'];
			var ejs = "<%% replace_me %>"+
					  "<ul><% animals.each(function(animal){%>" +
			               "<li><%= animal %></li>" + 
				      "<%});%></ul>";
			var compiler = new EjsCompiler(ejs, '<');		
			compiler.compile();	
			//assertEqual('___ejsO = "";; ___ejsO += "<ul>";  animals.each(function(animal){; ___ejsO += "<li>"; ___ejsO += (( animal ).toString()); ___ejsO += "</li>"; });; ___ejsO += "</ul>";', compiler.out)
			var compiled = eval(compiler.out);
			assertEqual("<% replace_me %><ul><li>sloth</li><li>bear</li><li>monkey</li></ul>", compiled)
	    }},
		test_render_with_comment: function() { with(this) {
			var animals = ['sloth', 'bear', 'monkey'];
			var ejs = "<%# replace_me %>"+
					  "<ul><% animals.each(function(animal){%>" +
			               "<li><%= animal %></li>" + 
				      "<%});%></ul>";
			var compiler = new EjsCompiler(ejs, '<');		
			compiler.compile();	
			//assertEqual('___ejsO = "";; ___ejsO += "<ul>";  animals.each(function(animal){; ___ejsO += "<li>"; ___ejsO += (( animal ).toString()); ___ejsO += "</li>"; });; ___ejsO += "</ul>";', compiler.out)
			var compiled = eval(compiler.out);
			assertEqual("<ul><li>sloth</li><li>bear</li><li>monkey</li></ul>", compiled)
	    }},
		test_render_with_double_equal: function() { with(this) {
			var animals = ['sloth', 'bear', 'monkey'];
			var ejs = "<%%= replace_me %>"+
					  "<ul><% animals.each(function(animal){%>" +
			               "<li><%= animal %></li>" + 
				      "<%});%></ul>";
			var compiler = new EjsCompiler(ejs, '<');		
			compiler.compile();	
			//assertEqual('___ejsO = "";; ___ejsO += "<ul>";  animals.each(function(animal){; ___ejsO += "<li>"; ___ejsO += (( animal ).toString()); ___ejsO += "</li>"; });; ___ejsO += "</ul>";', compiler.out)
			var compiled = eval(compiler.out);
			assertEqual("<%= replace_me %><ul><li>sloth</li><li>bear</li><li>monkey</li></ul>", compiled)
	    }},
		test_error_forgot_opening_carrot: function() { with(this) {
			var animals = ['sloth', 'bear', 'monkey'];
			var ejs = "<ul><% animals.each(function(animal){%>" +
			               "<li> animal %></li>" + 
				      "<%});%></ul>";
			var compiler = new EjsCompiler(ejs, '<');		
			compiler.compile();	
			var compiled = eval(compiler.out);
			assertEqual("<ul><li> animal %></li><li> animal %></li><li> animal %></li></ul>", compiled)
	    }}
	    
	  }, "testlog");
  }
}