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
	    }}
	    
	  }, "testlog");
  }
}