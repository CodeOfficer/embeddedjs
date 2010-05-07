;(function($) {
	$(function() {
		
		var json = {
			title: "Things",
			things: ['Computer', 'Motorcycle', 'Coffee']
		};
		
		$('#via_url').click(function() {
			var html = new EJS({url: 'template.ejs'}).render(json);
			$(this).closest('.example').find('.output').html(html);			
			return false;
		});
		
		$('#via_text').click(function() {
			var template = "<h3><%= title %></h3><ul><% for(var i in things) { %><li><%= things[i] %></li><% } %></ul>";
			var html = new EJS({text: template}).render(json);
			$(this).closest('.example').find('.output').html(html);			
			return false;
		});
		
		$('#via_element').click(function() {
			var html = new EJS({element: 'element'}).render(json);
			$(this).closest('.example').find('.output').html(html);			
			return false;
		});
		
	});
})(jQuery);