function popupchecker(b){var a=window.open("itestwin.html","","width=1,height=1,left=0,top=0,scrollbars=no");if(a==null){alert(b)}else{a.close()}}function checkall(){var b=document.getElementsByTagName("input");for(var a=0;a<b.length;a++){if(b[a].type=="checkbox"){b[a].checked=true}}}function checknone(){var b=document.getElementsByTagName("input");for(var a=0;a<b.length;a++){if(b[a].type=="checkbox"){b[a].checked=false}}}function lockoptions(formid,master,subitems){var form=document.forms[formid];if(eval("form."+master+".checked")){for(i=0;i<subitems.length;i++){unlockoption(form,subitems[i])}}else{for(i=0;i<subitems.length;i++){lockoption(form,subitems[i])}}return(true)}function lockoption(form,item){eval("form."+item+".disabled=true");if(form.elements["h"+item]){eval("form.h"+item+".value=1")}}function unlockoption(form,item){eval("form."+item+".disabled=false");if(form.elements["h"+item]){eval("form.h"+item+".value=0")}}function get_form_element_value(e,b){var c=e[b];if(!c){return null}if(c.tagName){return c.value}for(var a=0;a<c.length;a++){var d=c[a];if(d.checked){return d.value}}return null}function set_form_element_disabled(f,b,e){var c=f[b];if(!c){return}if(c.tagName){c.disabled=e}for(var a=0;a<c.length;a++){var d=c[a];d.disabled=e}}function set_form_element_hidden(e,b,f){var c=e[b];if(!c){return}if(c.tagName){var d=findParentNode(c,"DIV","fitem",false);if(d!=null){d.style.display=f?"none":"";d.style.visibility=f?"hidden":""}}for(var a=0;a<c.length;a++){var d=findParentNode(c[a],"DIV","fitem",false);if(d!=null){d.style.display=f?"none":"";d.style.visibility=f?"hidden":""}}}function lockoptionsall(formid){var form=document.forms[formid];var dependons=eval(formid+"items");var tolock=[];var tohide=[];for(var dependon in dependons){if(!dependons.propertyIsEnumerable(dependon)){continue}if(!form[dependon]){continue}for(var condition in dependons[dependon]){for(var value in dependons[dependon][condition]){var lock;var hide=false;switch(condition){case"notchecked":lock=!form[dependon].checked;break;case"checked":lock=form[dependon].checked;break;case"noitemselected":lock=form[dependon].selectedIndex==-1;break;case"eq":lock=get_form_element_value(form,dependon)==value;break;case"hide":hide=true;break;default:lock=get_form_element_value(form,dependon)!=value;break}for(var ei in dependons[dependon][condition][value]){var eltolock=dependons[dependon][condition][value][ei];if(hide){tohide[eltolock]=true}if(tolock[eltolock]!=null){tolock[eltolock]=lock||tolock[eltolock]}else{tolock[eltolock]=lock}}}}}for(var el in tolock){if(!tolock.propertyIsEnumerable(el)){continue}set_form_element_disabled(form,el,tolock[el]);if(tohide.propertyIsEnumerable(el)){set_form_element_hidden(form,el,tolock[el])}}return true}function lockoptionsallsetup(formid){var form=document.forms[formid];var dependons=eval(formid+"items");for(var dependon in dependons){if(!dependons.propertyIsEnumerable(dependon)){continue}var masters=form[dependon];if(!masters){continue}if(masters.tagName){masters=[masters]}for(var j=0;j<masters.length;j++){master=masters[j];master.formid=formid;master.onclick=function(){return lockoptionsall(this.formid)};master.onblur=function(){return lockoptionsall(this.formid)};master.onchange=function(){return lockoptionsall(this.formid)}}}for(var i=0;i<form.elements.length;i++){var formelement=form.elements[i];if(formelement.type=="reset"){formelement.formid=formid;formelement.onclick=function(){this.form.reset();return lockoptionsall(this.formid)};formelement.onblur=function(){this.form.reset();return lockoptionsall(this.formid)};formelement.onchange=function(){this.form.reset();return lockoptionsall(this.formid)}}}return lockoptionsall(formid)}function submitFormById(b){var a=document.getElementById(b);if(!a){return false}if(a.tagName.toLowerCase()!="form"){return false}if(!a.onsubmit||a.onsubmit()){return a.submit()}}function select_all_in(b,e,c){var a=document.getElementsByTagName("input");a=filterByParent(a,function(f){return findParentNode(f,b,e,c)});for(var d=0;d<a.length;++d){if(a[d].type=="checkbox"||a[d].type=="radio"){a[d].checked="checked"}}}function deselect_all_in(b,e,c){var a=document.getElementsByTagName("INPUT");a=filterByParent(a,function(f){return findParentNode(f,b,e,c)});for(var d=0;d<a.length;++d){if(a[d].type=="checkbox"||a[d].type=="radio"){a[d].checked=""}}}function confirm_if(b,a){if(!b){return true}return confirm(a)}function findParentNode(b,d,c,a){while(b.nodeName.toUpperCase()!="BODY"){if((!d||b.nodeName.toUpperCase()==d)&&(!c||b.className.indexOf(c)!=-1)&&(!a||b.id==a)){break}b=b.parentNode}return b}function findChildNodes(a,f,k,j,l){var e=new Array();for(var g=0;g<a.childNodes.length;g++){var h=false;var d=a.childNodes[g];if((d.nodeType==1)&&(k&&(typeof(d.className)=="string"))){var c=d.className.split(/\s+/);for(var b in c){if(c[b]==k){h=true;break}}}if(d.nodeType==1){if((!f||d.nodeName==f)&&(!k||h)&&(!j||d.id==j)&&(!l||d.name==l)){e=e.concat(d)}else{e=e.concat(findChildNodes(d,f,k,j,l))}}}return e}function elementShowAdvanced(c,a){for(var b in c){element=c[b];element.className=element.className.replace(new RegExp(" ?hide"),"");if(!a){element.className+=" hide"}}}function showAdvancedInit(d,b,f,a,c){var e=document.createElement("input");e.type="button";e.value=f;e.name=b;e.moodle={hideLabel:a,showLabel:c};YAHOO.util.Event.addListener(e,"click",showAdvancedOnClick);el=document.getElementById(d);el.parentNode.insertBefore(e,el)}function showAdvancedOnClick(f){var c=f.target?f.target:f.srcElement;var d=findChildNodes(c.form,null,"advanced");var g="";if(c.form.elements.mform_showadvanced_last.value=="0"||c.form.elements.mform_showadvanced_last.value==""){elementShowAdvanced(d,true);g=c.moodle.hideLabel;c.form.elements.mform_showadvanced_last.value="1"}else{elementShowAdvanced(d,false);g=c.moodle.showLabel;c.form.elements.mform_showadvanced_last.value="0"}var a=c.form.elements;for(var b=0;b<a.length;b++){if(a[b]&&a[b].name&&(a[b].name=="mform_showadvanced")){a[b].value=g}}return false}function unmaskPassword(f){var a=document.getElementById(f);var d=document.getElementById(f+"unmask");try{if(d.checked){var b=document.createElement('<input type="text" name="'+a.name+'">')}else{var b=document.createElement('<input type="password" name="'+a.name+'">')}b.attributes["class"].nodeValue=a.attributes["class"].nodeValue}catch(c){var b=document.createElement("input");b.setAttribute("name",a.name);if(d.checked){b.setAttribute("type","text")}else{b.setAttribute("type","password")}b.setAttribute("class",a.getAttribute("class"))}b.id=a.id;b.size=a.size;b.onblur=a.onblur;b.onchange=a.onchange;b.value=a.value;a.parentNode.replaceChild(b,a)}function elementToggleHide(d,a,b,c,f){if(!b){var g=d;d=document.getElementById("togglehide_"+g.id)}else{var g=b(d)}if(g.className.indexOf("hidden")==-1){g.className+=" hidden";if(d.src){d.src=d.src.replace("switch_minus","switch_plus");d.alt=c;d.title=c}var e=0}else{g.className=g.className.replace(new RegExp(" ?hidden"),"");if(d.src){d.src=d.src.replace("switch_plus","switch_minus");d.alt=f;d.title=f}var e=1}if(a==true){new cookie("hide:"+g.id,1,(e?-1:356),"/").set()}}function elementCookieHide(e,b,c){var d=document.getElementById(e);var a=new cookie("hide:"+e).read();if(a!=null){elementToggleHide(d,false,null,b,c)}}function filterByParent(e,a){var d=[];for(var c=0;c<e.length;++c){var b=a(e[c]);if(b.nodeName!="BODY"){d.push(e[c])}}return d}function fix_column_widths(){var a=navigator.userAgent.toLowerCase();if((a.indexOf("msie")!=-1)&&(a.indexOf("opera")==-1)){fix_column_width("left-column");fix_column_width("right-column")}}function fix_column_width(c){if(column=document.getElementById(c)){if(!column.offsetWidth){setTimeout("fix_column_width('"+c+"')",20);return}var b=0;var a=column.childNodes;for(i=0;i<a.length;++i){if(a[i].className.indexOf("sideblock")!=-1){if(b<a[i].offsetWidth){b=a[i].offsetWidth}}}for(i=0;i<a.length;++i){if(a[i].className.indexOf("sideblock")!=-1){a[i].style.width=b+"px"}}}}function insertAtCursor(d,c){if(document.selection){d.focus();sel=document.selection.createRange();sel.text=c}else{if(d.selectionStart||d.selectionStart=="0"){var b=d.selectionStart;var a=d.selectionEnd;d.value=d.value.substring(0,b)+c+d.value.substring(a,d.value.length)}else{d.value+=c}}}function addonload(a){var b=window.onload;window.onload=function(){if(b){b()}a()}};