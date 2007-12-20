String.prototype.rsplit=function(F){var E=this;var A=F.exec(E);var G=new Array();while(A!=null){var D=A.index;var C=F.lastIndex;if((D)!=0){var B=E.substring(0,D);G.push(E.substring(0,D));E=E.slice(D)}G.push(A[0]);E=E.slice(A[0].length);A=F.exec(E)}if(!E==""){G.push(E)}return G};String.prototype.chop=function(){return this.substr(0,this.length-1)};var EjsScanner=function(B,C,A){this.left_delimiter=C+"%";this.right_delimiter="%"+A;this.double_left=C+"%%";this.double_right="%%"+A;this.left_equal=C+"%=";this.left_comment=C+"%#";if(C=="["){this.SplitRegexp=/(\[%%)|(%%\])|(\[%=)|(\[%#)|(\[%)|(%\]\n)|(%\])|(\n)/}else{this.SplitRegexp=new RegExp("("+this.double_left+")|(%%"+this.double_right+")|("+this.left_equal+")|("+this.left_comment+")|("+this.left_delimiter+")|("+this.right_delimiter+"\n)|("+this.right_delimiter+")|(\n)")}this.source=B;this.stag=null;this.lines=0};EjsView={};EjsScanner.to_text=function(A){if(A==null||A===undefined){return""}if(A instanceof Date){return A.toDateString()}if(A.toString){return A.toString()}return""};EjsScanner.prototype={scan:function(D){scanline=this.scanline;regex=this.SplitRegexp;if(!this.source==""){var C=this.source.rsplit(/\n/);for(var A=0;A<C.length;A++){var B=C[A];this.scanline(B,regex,D)}}},scanline:function(A,D,G){this.lines++;var E=A.rsplit(D);for(var C=0;C<E.length;C++){var B=E[C];if(B!=null){try{G(B,this)}catch(F){throw {type:"EjsScanner",line:this.lines}}}}}};var EjsBuffer=function(B,C){this.line=new Array();this.script="";this.pre_cmd=B;this.post_cmd=C;for(var A=0;A<this.pre_cmd.length;A++){this.push(B[A])}};EjsBuffer.prototype={push:function(A){this.line.push(A)},cr:function(){this.script=this.script+this.line.join("; ");this.line=new Array();this.script=this.script+"\n"},close:function(){if(this.line.length>0){for(var A=0;A<this.post_cmd.length;A++){this.push(pre_cmd[A])}this.script=this.script+this.line.join("; ");line=null}}};EjsCompiler=function(B,C){this.pre_cmd=['___ejsO = "";'];this.post_cmd=new Array();this.source=" ";if(B!=null){if(typeof B=="string"){B=B.replace(/\r\n/g,"\n");B=B.replace(/\r/g,"\n");this.source=B}else{if(B.innerHTML){this.source=B.innerHTML}}if(typeof this.source!="string"){this.source=""}}C=C||"<";var A=">";switch(C){case"[":A="]";break;case"<":break;default:throw C+" is not a supported deliminator";break}this.scanner=new EjsScanner(this.source,C,A);this.out=""};EjsCompiler.prototype={compile:function(options){options=options||{};this.out="";var put_cmd="___ejsO += ";var insert_cmd=put_cmd;var buff=new EjsBuffer(this.pre_cmd,this.post_cmd);var content="";var clean=function(content){content=content.replace(/\\/g,"\\\\");content=content.replace(/\n/g,"\\n");content=content.replace(/"/g,'\\"');return content};this.scanner.scan(function(token,scanner){if(scanner.stag==null){switch(token){case"\n":content=content+"\n";buff.push(put_cmd+'"'+clean(content)+'";');buff.cr();content="";break;case scanner.left_delimiter:case scanner.left_equal:case scanner.left_comment:scanner.stag=token;if(content.length>0){buff.push(put_cmd+'"'+clean(content)+'"')}content="";break;case scanner.double_left:content=content+scanner.left_delimiter;break;default:content=content+token;break}}else{switch(token){case scanner.right_delimiter:switch(scanner.stag){case scanner.left_delimiter:if(content[content.length-1]=="\n"){content=content.chop();buff.push(content);buff.cr()}else{buff.push(content)}break;case scanner.left_equal:buff.push(insert_cmd+"(EjsScanner.to_text("+content+"))");break}scanner.stag=null;content="";break;case scanner.double_right:content=content+scanner.right_delimiter;break;default:content=content+token;break}}});if(content.length>0){buff.push(put_cmd+'"'+clean(content)+'"')}buff.close();this.out=buff.script+";";var to_be_evaled="this.process = function(_CONTEXT) { try { with(EjsView) { with (_CONTEXT) {"+this.out+" return ___ejsO;}}}catch(e){e.lineNumber=null;throw e;}};";try{eval(to_be_evaled)}catch(e){if(typeof JSLINT!="undefined"){JSLINT(this.out);for(var i=0;i<JSLINT.errors.length;i++){var error=JSLINT.errors[i];if(error.reason!="Unnecessary semicolon."){error.line++;var e=new Error();e.lineNumber=error.line;e.message=error.reason;if(options.url){e.fileName=options.url}throw e}}}else{throw e}}}};EJS=function(B){this.set_options(B);if(B.url){var C=EJS.get(B.url,this.cache);if(C){return C}if(C==EJS.INVALID_PATH){return null}this.text=EJS.request(B.url);if(this.text==null){throw"There is no template at "+B.url}this.name=B.url}else{if(B.element){if(typeof B.element=="string"){var A=B.element;B.element=document.getElementById(B.element);if(B.element==null){throw A+"does not exist!"}}if(B.element.value){this.text=B.element.value}else{this.text=B.element.innerHTML}this.name=B.element.id;this.type="["}}var C=new EjsCompiler(this.text,this.type);C.compile(B);EJS.update(this.name,this);this.template=C};EJS.config=function(B){EJS.cache=B.cache!=null?B.cache:EJS.cache;EJS.type=B.type!=null?B.type:EJS.type;var A={};EJS.get=function(D,C){if(C==false){return null}if(A[D]){return A[D]}return null};EJS.update=function(D,C){if(D==null){return }A[D]=C};EJS.INVALID_PATH=-1};EJS.config({cache:true,type:"<"});EJS.prototype={render:function(A){return this.template.process.call(A,A)},out:function(){return this.template.out},set_options:function(A){this.type=A.type!=null?A.type:EJS.type;this.cache=A.cache!=null?A.cache:EJS.cache;this.text=A.text!=null?A.text:null;this.name=A.name!=null?A.name:null},update:function(element,options){if(typeof element=="string"){element=document.getElementById(element)}if(typeof options=="string"){params={};params.url=options;_template=this;params.onComplete=function(request){var object=eval(request.responseText);EJS.prototype.update.call(_template,element,object)};EJS.ajax_request(params)}else{element.innerHTML=this.render(options)}}};EJS.newRequest=function(){var C=[function(){return new XMLHttpRequest()},function(){return new ActiveXObject("Msxml2.XMLHTTP")},function(){return new ActiveXObject("Microsoft.XMLHTTP")}];for(var A=0;A<C.length;A++){try{var B=C[A]();if(B!=null){return B}}catch(D){continue}}};EJS.request=function(C){var A=new EJS.newRequest();A.open("GET",C,false);try{A.send(null)}catch(B){return null}if(A.status==404||A.status==2||(A.status==0&&A.responseText=="")){return null}return A.responseText};EJS.ajax_request=function(B){B.method=(B.method?B.method:"GET");var A=new EJS.newRequest();A.onreadystatechange=function(){if(A.readyState==4){if(A.status==200){B.onComplete(A)}else{B.onComplete(A)}}};A.open(B.method,B.url);A.send(null)};EjsView=function(){};EjsView.date_tag=function(C,O,A){if(!(O instanceof Date)){O=new Date()}var B=["January","February","March","April","May","June","July","August","September","October","November","December"];var G=[],D=[],P=[];var J=O.getFullYear();var H=O.getMonth();var N=O.getDate();for(var M=J-15;M<J+15;M++){G.push({value:M,text:M})}for(var E=0;E<12;E++){D.push({value:(E),text:B[E]})}for(var I=0;I<31;I++){P.push({value:(I+1),text:(I+1)})}var L=this.select_tag(C+"[year]",J,G,{id:C+"[year]"});var F=this.select_tag(C+"[month]",H,D,{id:C+"[month]"});var K=this.select_tag(C+"[day]",N,P,{id:C+"[day]"});return L+F+K};EjsView.form_tag=function(B,A){A=A||{};A.action=B;if(A.multipart==true){A.method="post";A.enctype="multipart/form-data"}return this.start_tag_for("form",A)};EjsView.form_tag_end=function(){return this.tag_end("form")};EjsView.hidden_field_tag=function(A,C,B){return this.input_field_tag(A,C,"hidden",B)};EjsView.input_field_tag=function(A,D,C,B){B=B||{};B.id=B.id||A;B.value=D||"";B.type=C||"text";B.name=A;return this.single_tag_for("input",B)};EjsView.is_current_page=function(A){if(window.location.href==A||window.location.pathname==A){return true}return false};EjsView.link_to=function(B,A,C){if(!B){var B="null"}if(!C){var C={}}if(C.confirm){C.onclick=' var ret_confirm = confirm("'+C.confirm+'"); if(!ret_confirm){ return false;} ';C.confirm=null}C.href=A;return this.start_tag_for("a",C)+B+this.tag_end("a")};EjsView.submit_link_to=function(B,A,C){if(!B){var B="null"}if(!C){var C={}}C.onclick=C.onclick||"";if(C.confirm){C.onclick=' var ret_confirm = confirm("'+C.confirm+'"); if(!ret_confirm){ return false;} ';C.confirm=null}C.value=B;C.type="submit";C.onclick=C.onclick+(A?this.url_for(A):"")+"return false;";return this.start_tag_for("input",C)};EjsView.link_to_if=function(F,B,A,D,C,E){return this.link_to_unless((F==false),B,A,D,C,E)};EjsView.link_to_unless=function(E,B,A,C,D){C=C||{};if(E){if(D&&typeof D=="function"){return D(B,A,C,D)}else{return B}}else{return this.link_to(B,A,C)}};EjsView.link_to_unless_current=function(B,A,C,D){C=C||{};return this.link_to_unless(this.is_current_page(A),B,A,C,D)};EjsView.password_field_tag=function(A,C,B){return this.input_field_tag(A,C,"password",B)};EjsView.select_tag=function(D,G,H,F){F=F||{};F.id=F.id||D;F.value=G;F.name=D;var B="";B+=this.start_tag_for("select",F);for(var E=0;E<H.length;E++){var C=H[E];var A={value:C.value};if(C.value==G){A.selected="selected"}B+=this.start_tag_for("option",A)+C.text+this.tag_end("option")}B+=this.tag_end("select");return B};EjsView.single_tag_for=function(A,B){return this.tag(A,B,"/>")};EjsView.start_tag_for=function(A,B){return this.tag(A,B)};EjsView.submit_tag=function(A,B){B=B||{};B.type=B.type||"submit";B.value=A||"Submit";return this.single_tag_for("input",B)};EjsView.tag=function(C,E,D){if(!D){var D=">"}var B=" ";for(var A in E){if(E[A]!=null){var F=E[A].toString()}else{var F=""}if(A=="Class"){A="class"}if(F.indexOf("'")!=-1){B+=A+'="'+F+'" '}else{B+=A+"='"+F+"' "}}return"<"+C+B+D};EjsView.tag_end=function(A){return"</"+A+">"};EjsView.text_area_tag=function(A,C,B){B=B||{};B.id=B.id||A;B.name=B.name||A;C=C||"";if(B.size){B.cols=B.size.split("x")[0];B.rows=B.size.split("x")[1];delete B.size}B.cols=B.cols||50;B.rows=B.rows||4;return this.start_tag_for("textarea",B)+C+this.tag_end("textarea")};EjsView.text_tag=EjsView.text_area_tag;EjsView.text_field_tag=function(A,C,B){return this.input_field_tag(A,C,"text",B)};EjsView.url_for=function(A){return'window.location="'+A+'";'};EjsView.img_tag=function(B,C,A){A=A||{};A.src=B;A.alt=C;return EjsView.single_tag_for("img",A)}