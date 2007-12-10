/**
 * @fileoverview
 * The View.js file contains an Javascript implementation of the 
 * active view design pattern and supporting functionality.
 * <p class='credits'>JavaScript MVC based off <a href='http://trimpath.com/'>TrimJunction framework</a>.
 * @author Jupiter Information Technology Solutions - Brian Moschel, Justin Meyer.<br/>
 * @version 0.1
 */

/**
 * <script language="javascript" src="/junction_setup.js" type="text/javascript"></script>
 * 
 * This is a static class and should never be instantiated.
 * @constructor
 * 
 * @class
 * <script language="javascript" type="text/javascript">
 *    get = function() {
 *          alert('get() called, this would normally direct you to a local action.')
 *    }
 * </script>
 * View provides a set of methods for easily creating links and html elements.  This class
 * is added to window as view.  So instead of calling:
 * <pre class='example'>
 * View.link_to( {action: <span>'list'</span>} )</pre>
 * you can call:
 * <pre class='example'>
 * view.link_to({action: <span>'list'</span>})</pre>
 *
 * In your templates, these methods are added to the data object you are rendering with.  So you can call them like:
 * <pre class='example'>
 * &lt;p&gt;I am going to show a link&lt;/p&gt;
 * &lt;%=  link_to('Click Me', {action: 'list'} ) %></pre>
 * @see Controller
 * @see ActiveRecord
 */

View = function() {
    this.klass = 'View'
}


/**
 * creates a date select tag.
 * <p>Example:</p>
 * <pre class='example'>
 *  view.date_tag('Installation[date]')</pre>
 * <p>produces:</p>
 * <pre class='example'>
 * <script language="javascript" type="text/javascript">
 *   document.write( view.date_tag('Installation[date]') ) ;
 * </script></pre>
 * @param {Object} name  The name of the form element.
 * @param {Object} value  optional default date value.
 * @param {Object} html_options  optional html attributes.
 */
View.date_tag = function(name, value , html_options) {
    if(! (value instanceof Date))
		value = new Date()
	
	var month_names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var years = [], months = [], days =[];
	var year = value.getFullYear();
	var month = value.getMonth();
	var day = value.getDate();
	for(var y = year - 15; y < year+15 ; y++)
	{
		years.push({value: y, text: y})
	}
	for(var m = 0; m < 12; m++)
	{
		months.push({value: (m), text: month_names[m]})
	}
	for(var d = 0; d < 31; d++)
	{
		days.push({value: (d+1), text: (d+1)})
	}
	var year_select = this.select_tag(name+'[year]', year, years, {id: name+'[year]'} )
	var month_select = this.select_tag(name+'[month]', month, months, {id: name+'[month]'})
	var day_select = this.select_tag(name+'[day]', day, days, {id: name+'[day]'})
	
    return year_select+month_select+day_select;
}

/**
 * Outputs a starting form tag that points to a action configured with url_for_options.  The method for the form defaults
 * to POST.
 * <p>Example:</p>
 * <pre class='example'>
 *  form_tag( {controller: 'expenses', action: 'create' } ) 
 * </pre>
 * Produces:
 * <pre class='example'>
 * <script language="javascript" type="text/javascript">
 *   document.write( view.form_tag( {controller: 'expenses', action: 'create' }).escapeHTML() ) ;
 * </script></pre>
 * 
 * @param {Object} url_for_options Object used to direct to an action.
 * @param {Object} html_options Options used to create html attributes.
 * @param {Boolean} post False if you want the form to submit as a get request, true if you want the form to submit as post.  Defaults to true.
 * @return {String} A begining form tag.
 */
View.form_tag = function(action, html_options, post) {
                 
    
    html_options     = html_options                     || {};
	html_options.action = action
    if(html_options.multipart == true) {
        html_options.method = 'post';
        html_options.enctype = 'multipart/form-data';
    }
    
    //html_options.onsubmit = html_options.onsubmit+"return View.post_form(this, "+$H(url_for_options).toJSON()+");";
    
    return this.start_tag_for('form', html_options)
}


/**
 * Outputs "&lt;/form&gt;".
 * @return {String} "&lt;/form&gt;" .
 */
View.form_tag_end = function() { return this.tag_end('form'); }


/**
 * Creates a hidden field.
 * <p>Example:</p>
 * <pre class='example'>
 *  view.hidden_field_tag('hidden_value')</pre>
 * <p>produces:</p>
 * <pre class='example'>
 * <script language="javascript" type="text/javascript">
 *   document.write( view.hidden_field_tag('hidden_value').escapeHTML() ) ;
 * </script></pre>
 * @param {String} name Form element's name
 * @param {String} value Default value
 * @param {Object} html_options Options used to create html attributes.
 *
 * @return {String} Text for an hidden field element.
 *
 */
View.hidden_field_tag   = function(name, value, html_options) { 
    return this.input_field_tag(name, value, 'hidden', html_options); 
}


/**
 * Creates html input elements.
 * <p>input field also creates elements in the correct way so their values can be automatically put into 
 * post data and sent on form submital.</p>
 * <p>Example:</p>
 * <pre class='example'>
 *  view.input_field_tag('task', 'description','text') </pre>
 * <p>Produces:</p>
 * <pre class='example'>
 * <script language="javascript" type="text/javascript">
 *   document.write( view.input_field_tag('task', 'description','text').escapeHTML() ) ;
 * </script>
 * Which looks like =>
 * <script language="javascript" type="text/javascript">
 *   document.write( view.input_field_tag('task', 'description','text') ) ;
 * </script></pre>
 * @param {String} name Form element's name
 * @param {String} value The default value of the form element.
 * @param {String} inputType The type of input object ('text', 'hidden', 'password')
 * @param {Object} html_options Options used to create html attributes.
 *
 * @return {String} input field text.
 *
 */
View.input_field_tag = function(name, value , inputType, html_options) {
    
    html_options = html_options || {};
    html_options.id  = html_options.id  || name;
    html_options.value = value || '';
    html_options.type = inputType || 'text';
    html_options.name = name;
    
    return this.single_tag_for('input', html_options)
}
/**
 * Returns true if parameters in options match the parameters of the current page.
 * @param {Object} options
 */
View.is_current_page = function(url) {
	if(window.location.href == url || window.location.pathname == url) return true;
	return false;
}

/**
 * Creates a link tag of the given name using a URL created by the set of options. 
 * 
 * <p>Example:</p>
 * <pre class='example'>
 * view.link_to('Link to Local Action', {controller: 'tasks', action: 'list'} ) </pre>
 * <p>Produces:</p>
 * <pre class='example'>
 * <script language="javascript" type="text/javascript">
 *    document.write(  view.link_to('Link to Local Action', {controller: 'tasks', action: 'list'} ).escapeHTML() );
 * </script>
 * Looks like =>
 * <script language="javascript" type="text/javascript">
 *    document.write(  view.link_to('Link to Local Action', {controller: 'tasks', action: 'list'} ) );
 * </script></pre>
 * @param {String} name link's text.
 * @param {String} options URL parameters.
 * @param {String} html_options Hash of html attributes.
 *  <p>NOTE: to add a "class" attribute use "Class" (capitalized) because "class" is a reserved word in IE</p>
 * <pre class='example'>
 * view.link_to('Some Link', {action: 'list'}, {Class: 'highlighted'})</pre>
 * @param {Boolean} post true if link submits a post request, false if link submits a get request.  Default is false. 
 *
 * @return {String} hyperlink text.
 *
 */
View.link_to = function(name, url, html_options) {
    if(!name) var name = 'null';
    if(!html_options) var html_options = {}
	
	if(html_options.confirm){
		html_options.onclick = 
		" var ret_confirm = confirm(\""+html_options.confirm+"\"); if(!ret_confirm){ return false;} "
		html_options.confirm = null;
	}
    html_options.href=url
    return this.start_tag_for('a', html_options)+name+ this.tag_end('a');
}
/**
 * 
 * @param {Object} name
 * @param {Object} options
 * @param {Object} html_options
 */
View.submit_link_to = function(name, url, html_options){
	if(!name) var name = 'null';
    if(!html_options) var html_options = {}
    html_options.onclick = html_options.onclick  || '' ;
	
	if(html_options.confirm){
		html_options.onclick = 
		" var ret_confirm = confirm(\""+html_options.confirm+"\"); if(!ret_confirm){ return false;} "
		html_options.confirm = null;
	}
	
    html_options.value = name;
	html_options.type = 'submit'
    html_options.onclick=html_options.onclick+
		(url ? this.url_for(url) : '')+'return false;';
    //html_options.href='#'+(options ? Routes.url_for(options) : '')
	return this.start_tag_for('input', html_options)
}
/**
 * Creates a link tag of the given name using a URL 
 * created by the set of options if the condition is true.  If the condition is false, 
 *  only the name is returned. 
 * To specialize the default behavior, you can pass a function that accepts 
 * the name or the full argument list for link_to_unless (see the example).
 * @param {Object} condition
 * @param {Object} name
 * @param {Object} options
 * @param {Object} html_options
 * @param {Object} post
 * @param {Object} block
 * @see #link_to_unless
 */
View.link_to_if = function(condition, name, url, html_options, post, block) {
	return this.link_to_unless((condition == false), name, url, html_options, post, block);
}

/**
 * Creates a link tag of the given name using a URL 
 * created by the set of options unless the condition is true.  If the condition is true,
 * only the name is returned. 
 * To specialize the default behavior, you can pass a function that accepts 
 * the name or the full argument list for link_to_unless (see the example).
 * 
 * <p>False condition example:</p>
 * <pre class='example'>
 * view.link_to_unless(false, 'Reply', {action: 'reply'} ) </pre>
 * <p>Produces:</p>
 * <pre class='example'>
 * <script language="javascript" type="text/javascript">
 *    document.write(  view.link_to_unless(false, 'Reply', {action: 'reply'} ).escapeHTML()  );
 * </script>
 * Looks like => 
 * <script language="javascript" type="text/javascript">
 *    document.write(  view.link_to_unless(false, 'Reply', {action: 'reply'} )  );
 * </script></pre>
 * <br/><br/>
 * <p>True condition example:</p>
 * <pre class='example'>
 * view.link_to_unless(true, 'Reply', {action: 'reply'} ) </pre>
 * <p>Produces:</p>
 * <pre class='example'>
 * <script language="javascript" type="text/javascript">
 *    document.write(  view.link_to_unless(true, 'Reply', {action: 'reply'} ).escapeHTML()  );
 * </script></pre>
 * <br/><br/>
 * <p>Block function example:</p>
 * <pre class='example'>
 * view.link_to_unless(true, 'Reply', {action: 'reply'}, null, null, function(){view.link_to('Log in', {action: 'Log in'}) } ) </pre>
 * <p>Produces:</p>
 * <pre class='example'>
 * <script language="javascript" type="text/javascript">
 *    document.write(  
 *    view.link_to_unless(true, 'Reply', 
 *    	{action: 'reply'}, null, null, 
 *      function(){ return view.link_to('Log in', {action: 'login'} ) } ).escapeHTML()  );
 * </script>
 * Looks like =>
 * <script language="javascript" type="text/javascript">
 *    document.write(  
 *    view.link_to_unless(true, 'Reply', 
 *    	{action: 'reply'}, null, null, 
 *      function(){ return view.link_to('Log in', {action: 'login'} ) } )  );
 * </script></pre>
 * 
 * @param {Boolean} condition  If true, returns the name or calls the block function, if false, creates a link.
 * @param {String} name  The display text of the link
 * @param {Object} options  options that are used to create a url
 * @param {Object} html_options  Html attribute hash
 * @param {Boolean} post  True if clicking link is a post request, false if otherwise.  Defaults to false.
 * @param {Object} block optional function that is called if the condition evaluates to true.  The block is called with 
 * 					name, options, html_options, and block.
 */
View.link_to_unless = function(condition, name, url, html_options, block) {
	html_options = html_options || {};
	if(condition) {
		if(block && typeof block == 'function') {
			return block(name, url, html_options, block);
		} else {
			return name;
		}
	} else
		return this.link_to(name, url, html_options);
}

/**
 * Creates a link tag of the given name using a URL created by the 
 * set of options unless the current request uri is the same as the 
 * links, in which case only the name is returned (or the given 
 * block is yielded, if one exists). 
 * Refer to the documentation for link_to_unless for block usage.
 * @param {Object} name
 * @param {Object} options
 * @param {Object} html_options
 * @param {Object} post
 * @param {Object} block
 * @see #link_to_unless
 */
View.link_to_unless_current = function(name, url, html_options, block) {
	html_options = html_options || {};
	return this.link_to_unless(this.is_current_page(url), name, url, html_options, block)
}



/**
 * Creates a password field.
 * <p>Example:</p>
 * <pre class='example'>
 *  view.password_field_tag('password', 'mypassword')</pre>
 * <p>produces:</p>
 * <pre class='example'>
 * <script language="javascript" type="text/javascript">
 *   document.write( view.password_field_tag('password', 'mypassword').escapeHTML() ) ;
 * </script>
 * Looks like => 
 * <script language="javascript" type="text/javascript">
 *   document.write( view.password_field_tag('password', 'mypassword') ) ;
 * </script></pre>
 * @param {String} name Form element's name
 * @param {String} value Default value
 * @param {Object} html_options Options used to create html attributes.
 *
 * @return {String} password field text.
 *
 */
View.password_field_tag = function(name, value, html_options) { return this.input_field_tag(name, value, 'password', html_options); }




/**
 * Creates a select field.
 * <p>Example:</p>
 * <pre class='example'>
 * var choices = [ {value: 1,      text: 'First Choice' }, 
 *                 {value: 2,      text: 'Second Choice'},
 *                 {value: '3',    text: 'Third Choice'}  ]
 * view.select_tag('mySelectElement', 2,  choices)</pre>
 * <p>Produces:</p>
 * <pre class='example'>
 * <script language="javascript" type="text/javascript">
 *    var choices = [ {value: 1,      text: 'First Choice' }, 
 *                   {value: 2,      text: 'Second Choice'},
 *                   {value: '3',    text: 'Third Choice'}   ]
 *   document.write( view.select_tag('mySelectElement', 2,  choices));
 * </script>
 * </pre>
 *
 * @param {String} name Form element's name.
 * @param {String} value Optional default value.
 * @param {Object} choices An array of choices.  Each choice is an object with a name and value attribute.
 * @param {Object} html_options Options used to create html attributes.
 *
 * @return {String} select tag text.
 */
View.select_tag = function(name, value, choices, html_options) {     
    html_options = html_options || {};
    html_options.id  = html_options.id  || name;
    html_options.value = value;
	html_options.name = name;
    
    var txt = ''
    txt += this.start_tag_for('select', html_options)
    
    for(var i = 0; i < choices.length; i++)
    {
        var choice = choices[i];
        var optionOptions = {value: choice.value}
        if(choice.value == value)
            optionOptions.selected ='selected'
        txt += this.start_tag_for('option', optionOptions )+choice.text+this.tag_end('option')
    }
    txt += this.tag_end('select');
    return txt;
}


/**
 * Creates tag that ends with '/>'.  Use this to create html elements that have no ending tag.
 * <p>Example:
 * <pre class='example'>
 * view.single_tag_for('br')  ==>  returns <script language="javascript" type="text/javascript">
 *   document.write( view.single_tag_for('br').escapeHTML() ) ;
 * </script></pre>
 * @param {String} tag Html tag type {'br', 'input', ...}
 * @param {Object} html_options Options used to create html attributes.
 *
 * @return {String} html markup for a tag
 */
View.single_tag_for = function(tag, html_options) { return this.tag(tag, html_options, '/>');}

/**
 * Creates tag that ends with '>'.  Use this to create html elements that have other markup or 
 * inner text.
 * <p>Example:
 * <pre class='example'>
 * view.start_tag_for('p', {class: 'background-color: Red'})  ==>  returns '&lt;p class="background-color: Red" &gt;'</pre>
 * @param {String} tag Html tag type {'span', 'div', 'p', ...}
 * @param {Object} html_options Options used to create html attributes.
 *  <p>NOTE: to add a "class" attribute use "Class" (capitalized) because "class" is a reserved word in IE</p>
 * <pre class='example'>
 * view.start_tag_for('p', {Class: 'highlighted'})  ==>  returns '&lt;p class="highlighted" &gt;'</pre>
 *
 * @return {String} html markup for a tag
 */
View.start_tag_for = function(tag, html_options)  { return this.tag(tag, html_options); }

View.submit_tag = function(name, html_options) {  
    html_options = html_options || {};
    html_options.name  = html_options.id  || 'commit';
    html_options.type = html_options.type  || 'submit';
    html_options.value = name || 'Submit';
    return this.single_tag_for('input', html_options);
}

/**
 * Creates a html tag.
 * <p>Example:
 * <pre class='example'>
 * view.tag('p', {style: 'background-color: Red'})  ==>  returns '&lt;p style="background-color: Red" &gt;'</pre>
 * @param {String} tag Html tag type {'br', 'input', 'span', 'div', ...}
 * @param {Object} html_options Options used to create html attributes.
 *  <p>NOTE: to add a "class" attribute use "Class" (capitalized) because "class" is a reserved word in IE</p>
 * <pre class='example'>
 * view.tag('p', {Class: 'highlighted'})  ==>  returns '&lt;p class="highlighted" &gt;'</pre>
 * @param {String} end End of the html tag.  Defaults to '>'.
 *
 * @return {String} html markup for a tag
 */
View.tag = function(tag, html_options, end) {
    if(!end) var end = '>'
    var txt = ' '
    for(var attr in html_options) { 
       if(html_options[attr] != null)
        var value = html_options[attr].toString();
       else
        var value=''
       if(attr == "Class") // special case because "class" is a reserved word in IE
        attr = "class";
       if( value.indexOf("'") != -1 )
            txt += attr+'=\"'+value+'\" ' 
       else
            txt += attr+"='"+value+"' " 
    }
    return '<'+tag+txt+end;
}
/**
 * Creates an ending html tag.
 * @param {String} tag Html tag type {'span', 'div', 'p', ...}
 * @return {String} '&lt;/'+tag+'&gt;'
 */
View.tag_end = function(tag)             { return '</'+tag+'>'; }

/**
 * Creates a textarea.
 * <p>Example:</p>
 * <pre class='example'>
 *  view.text_area_tag('myTextArea', 'Here is some text.\nA new line.')</pre>
 * <p>produces:</p>
 * <pre class='example'>
 * <script language="javascript" type="text/javascript">
 *   document.write( view.text_area_tag('task[description]', 'Here is some text.\nA new line.') ) ;
 * </script>
 * </pre>
 * @param {String} name Form element's name.
 * @param {String} value Default value.
 * @param {Object} html_options Options used to create html attributes.  Uses the following:
 *      <ul>
 *          <li>size - A string specifying the dimensions of the textarea.  Ex: {size: '25x10'}</li>
 *      </ul>
 *
 * @return {String} password field text.
 *
 */
View.text_area_tag = function(name, value, html_options) { 
    html_options = html_options || {};
    html_options.id  = html_options.id  || name;
    html_options.name  = html_options.name  || name;
	value = value || ''
    if(html_options.size) {
        html_options.cols = html_options.size.split('x')[0]
        html_options.rows = html_options.size.split('x')[1]
        delete html_options.size
    }
    
    html_options.cols = html_options.cols  || 50;
    html_options.rows = html_options.rows  || 4;
    
    return  this.start_tag_for('textarea', html_options)+value+this.tag_end('textarea')
}
View.text_tag = View.text_area_tag
/**
 * Creates a standard text field.
 * <p>Example:</p>
 * <pre class='example'>
 * view.text_field_tag('myTextField', 'Here is some text.')</pre>
 * <p>produces:</p>
 * <pre class='example'>
 * <script language="javascript" type="text/javascript">
 *   document.write( view.text_field_tag('myTextField', 'Here is some text.') ) ;
 * </script>
 * </pre>
 * @param {String} name Form element's name.
 * @param {String} value Default value.
 * @param {Object} html_options Options used to create html attributes.  Uses the following:
 *
 * @return {String} password field text.
 *
 */
View.text_field_tag     = function(name, value, html_options) { return this.input_field_tag(name, value, 'text', html_options); }





/**
 * Returns javascript text that when run will call a controller action with parameters defined in params.
 * <p>This is primarly used for adding to onclick or other functions when creating templates.</p>
 * @param {Object} A url hash.
 * @param {Boolean} post true if a post request, false if otherwise.  Default is a get request.
 * @return {String} request function.
 */
View.url_for = function(url) {
        return 'window.location="'+url+'";'
}
/**
 * uses the type of column to deterimine the type of field it should present.  Useful in bluepritns.
 * @param {Object} model_name
 * @param {Object} column_name
 * @param {Object} options
 */


View.img_tag = function(image_location, alt, options){
	options = options || {};
	options.src = image_location
	options.alt = alt
	return View.single_tag_for('img', options)
}
