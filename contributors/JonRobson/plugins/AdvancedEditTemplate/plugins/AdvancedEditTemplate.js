
if(!version.extensions.AdvancedEditTemplatePlugin) 
{

	version.extensions.AdvancedEditTemplatePlugin = {installed:true};
	config.macros.AdvancedEditTemplate = {
		getVariableFromQueryString:function(varName){
			var qs = window.location.search.substring(1);
			var atts = qs.split("&");

			for(var i =0; i <atts.length; i++){
				var varVal = atts[i].split("=");
				if(varVal[0]==varName){

					return decodeURI(varVal[1]);
				}
			}
			return false;

		}
		,advancedDropdown: function(){
			
		}
		,handler: function(place,macroName,p,wikifier,paramString,tiddler) {
			var tiddlerDom = story.findContainingTiddler(place);
			var params = paramString.parseParams("anon",null,true,false,false);
			var ctrlType = getParam(params,"type",null);

			var title = tiddlerDom.getAttribute("tiddler");
			var tiddler = store.getTiddler(title);
			var metaDataName = getParam(params,"metaDataName", null);
			
			// build a drop down control
			var valueSource = getParam(params,"valuesSource", null);
			if(!valueSource) valueSource = metaDataName + "Definition";
			
			if(ctrlType == 'dropdown') {
				if(!valueSource) {
					displayMessage("Please provide a parameter valuesSource telling me the name of the tiddler where your drop down is defined.");
					return;
				}
				
				if(metaDataName.indexOf(",") > -1){
					fields = metaDataName.split(",");
					for(var j=0; j < fields.length; j++){
						fields[j] = jQuery.trim(fields[j]);
					}
				}
				else{
					fields = [metaDataName];
				}
				
				var selected = store.getValue(tiddler,fields[fields.length -1]);
				if(!selected){
					var qsvalue =this.getVariableFromQueryString(fields[fields.length-1]);
					if(qsvalue) selected = qsvalue;
				}
				var tiddler =store.getTiddler(valueSource);
				
				if(tiddler){
					var values = tiddler.text.split('\n');
					var sorted = tiddler.tags.contains("sorted");
					this.createDropDownMenu(place,fields,values,false,this.setDropDownMetaData,selected,sorted);
				}
			}
			else if(ctrlType == 'search'){
				if(!valueSource) {
					displayMessage("Please provide a parameter valuesSource telling me the name of the tiddler where your drop down is defined.");
					return;
				}
				var selected = store.getValue(tiddler,metaDataName);
				if(!selected){
					var qsvalue =this.getVariableFromQueryString(metaDataName);
					if(qsvalue) selected = qsvalue;
				}
				var tiddler =store.getTiddler(valueSource);
				if(tiddler){
					var values = tiddler.text.split('\n');
					var handler= function(value){
						config.macros.AdvancedEditTemplate.setMetaData(title,metaDataName,value);
					}
					this.createSearchBox(place,metaDataName,values,selected,handler);
				}
			}
			else if(ctrlType == 'checkbox'){
			        					
				this.createCheckBox(place,title,metaDataName);
				
			}
			else if(ctrlType == 'date'){
			        this.createDatePicker(place,title,metaDataName);
			}
			else if(ctrlType == 'color'){
				this.createColorBar(place,title,metaDataName);
			}
			else if(ctrlType == 'image'){
				var that = this;
				var handler = function(value){
					that.setMetaData(title,metaDataName,value);
				};
				var initialValue = "";
				initialValue = this.getMetaData(title,metaDataName);
				var image = new config.macros.AdvancedEditTemplate.EditTemplateImage(place, paramString,initialValue,handler);
			}

		}
		,createColorBar: function(place,tiddlerTitle,metaDataName){

			var aet = this;
			var curValue = this.getMetaData(tiddlerTitle,metaDataName);
			var changefunction = function(newcolor){
				aet.setMetaData(tiddlerTitle,metaDataName,newcolor)
			};
			
			var container = document.createElement("span");
			place.appendChild(container);
			var slider = new VismoColorSlider(container,200,15,changefunction);
			slider.setColor(curValue);
		}
		,createSearchBox: function(place,fieldName,values,initialValue,action){
		    var whatyousee=[];
			var whatyousave = {};
			for(var i=0; i < values.length; i ++){
			    if(values[i] != ""){
    			    var name_value = values[i].split(":");
    			    var name = name_value[0];
    			    var value = name_value[1];
    			    if(!value) value = name;
			    
    			    name = name.replace(/[\>|\<]/ig, "");
    			    value = value.replace(/[\>|\<]/ig, "");
    			    whatyousee.push(name);
    			    whatyousave[name] = value;
    			    if(initialValue == value) initialValue = name;
			    }
			}
			var handler = function(event,targets){
			    
			    if(targets.length == 0) return;
			    var name = targets[0]
			    var save_this = whatyousave[name];
			    if(action)action(save_this);
			};
			
			if(!initialValue) initialValue = "";
			var options = {matchContains: true};
		    jQuery("<input type='text' value=\""+initialValue +"\"/>").autocomplete(whatyousee,options).result(handler).appendTo(place);
		
		}

		,_createMenus: function(menutextrepresentation){
			var chain = [0];
			var menus = [];
			var values = menutextrepresentation;
			var myparents = [];
			var depth = 0;
			for (var i=0; i < values.length; i++) {
				
				var value;
				var caption = values[i];
				if(caption.indexOf("##") > -1){ //remove any commenting
					caption = caption.substring(0,caption.indexOf("##"));
				}
				value = caption;

				if(caption.indexOf(":") > -1){
					var splitstr= caption.split(":");
					caption = splitstr[0];
					value = splitstr[1];
				}
				caption = caption.replace("<","");
				caption = caption.replace(">","");
		
				var chainid = chain.length -1;
				if(!menus[chain[chainid]]){
					menus[chain[chainid]] = {depth: depth};
					menus[chain[chainid]].options= [];
				}
	

				if(value.indexOf(">") != -1){
					value = value.replace(">","");
					var newmenuid = menus.length;
					menus[chain[chainid]].options.push({'caption': caption, 'value': value,'childMenu': newmenuid});
					chain.push(newmenuid);
					myparents.push(value+">");
					depth += 1;	
			
				}
				else if(value.indexOf("<") != -1){			
					value = value.replace("<","");

					menus[chain[chainid]].options.push({'caption': caption,'value': value});
					myparents.pop();
					chain.pop();
					depth -= 1;	
				}
				else{
					menus[chain[chainid]].options.push({'caption': caption, 'value':value});
				}
			
						

								
			}
	
			return menus;
		}
		,createDropDownMenu: function(place,fieldName,values,initialValue,handler,selected,sort){
				if(typeof fieldName == 'object'){
					fields = fieldName;
				}
				else{
					fields = [fieldName];
				}
				
				
				if(!selected) selected = "";
				if(!initialValue){
					initialValue = "Please select.. ";
				}
				var menus = this._createMenus(values);
				
				var lastMenu, fieldid;
				var allMenus = [];
				var selectedItem = false;
				var nowtselected = true;
				
				
				for(var j=menus.length-1; j >-1; j--){
					var newMenu = document.createElement("select");
					
					if(j > 0){
						newMenu.style.display = "none";
					}
					if(fields.length == 1){
						fieldid = 0;
					}
					else{
						fieldid = menus[j].depth;
					}
			
					newMenu.name = fields[fieldid];
					newMenu.associatedFields = fields;
					var menuoptions = menus[j].options;
					
					if(sort){		 
						var sorter = function(a,b){if(a.caption < b.caption){ return -1; }else return 1;};
						sorter =menuoptions.sort(sorter);
					}
					var topitem = [{'caption': initialValue, 'value': 'null', 'name': null}];
					menuoptions = topitem.concat(menuoptions);
					
					for(var k=0; k <menuoptions.length; k++){
						var opt =menuoptions[k];
						
						if(opt.caption.replace(" ","") != ""){
							var optionEl = document.createElement("option");
							if(opt.childMenu) {
								optionEl.childMenu = allMenus[opt.childMenu];
								optionEl.childMenu.parentOption = optionEl;
							}
						
							if(opt.value){
								optionEl.value = opt.value;
							}
			
							if(nowtselected && optionEl.value ==selected){
								optionEl.selected = true;
								newMenu.style.display = "";
								selectedItem = optionEl;
								nowtselected = false;
							}
							optionEl.appendChild(document.createTextNode(opt.caption));
							newMenu.appendChild(optionEl);
						}
					}
					newMenu.onchange = function(e){
						

						/*toggle menu*/
						var opt =this[this.selectedIndex];
			
						if(opt.childMenu){
							opt.childMenu.style.display=""
							if(this.expandedMenu) this.expandedMenu.style.display = "none";
							this.expandedMenu = opt.childMenu;
						}
						else{
							if(this.expandedMenu) this.expandedMenu.style.display = "none";
							this.expandedMenu = null;
						}
						
						handler(e,this);
					};
					
					allMenus[j] = newMenu;

					if(lastMenu){
						lastMenu.childMenu = newMenu;
					}
					
					lastMenu = newMenu;
					
				}
				for(var k=0; k < allMenus.length; k++){
					place.appendChild(allMenus[k]);
				}
				
				if(nowtselected){
					selectedItem = allMenus[0].firstChild;
				}
				if(selectedItem){
					this._revealSelectMenus(selectedItem);
				}
		}

		,_revealSelectMenus: function(selecteditem){
			if(!selecteditem.selected) selecteditem.selected = true;
			
			var containingmenu = selecteditem.parentNode;
			
			
			if(selecteditem.childMenu){
				selecteditem.childMenu.style.display = "";
				containingmenu.expandedMenu = selecteditem.childMenu;
			}
			if(containingmenu.style.display == "none"){
				containingmenu.style.display = "";
			}
			while(containingmenu){
				var parentoption = containingmenu.parentOption;
				if(parentoption) {
					parentoption.selected = true;
					var parentmenu = parentoption.parentNode;
					if(parentmenu){ 
						parentmenu.style.display = "";
						parentmenu.expandedMenu = containingmenu;
						containingmenu = parentmenu;
					}
					else{
						containingmenu = false;
					}
				}
				else{
					containingmenu = false;
				}

				
				
			}
			
			//containingmenu.parentMenu.style.display = "";
		}



		// Ensure that changes to a dropdown field are stored as an extended field.
		,setDropDownMetaData: function(ev,el) {
			
			var e = ev ? ev : window.event;
			var taskTiddler = story.findContainingTiddler(el);
			
			if(taskTiddler && taskTiddler != undefined) {
				var title = taskTiddler.getAttribute('tiddler');

				
				var selected = el[el.selectedIndex];
				var aet = config.macros.AdvancedEditTemplate;

				
				var fieldname = selected.parentNode.name;
				var fieldvalue = selected.value;
				for(var i=0; i < el.associatedFields.length; i++){
					var fieldname =el.associatedFields[i];
					aet.setMetaData(title,fieldname,fieldvalue);
				}	
				var parent = selected.parentNode.parentOption;
				
				if(selected.value == 'null'){
					if(parent){
						selected = parent;
						fieldvalue = selected.value;	
					}
				}
				
				if(parent){
					aet.setDropDownMetaData(ev,parent.parentNode);
				}
				
				aet.setMetaData(title,fieldname,fieldvalue);
			}
		},
		
		getMetaData: function(title,extField){ 
			extField = extField.toLowerCase();
			var tiddler =  store.getTiddler(title);
			if(!tiddler) {
				return false;
			}
			else{
				if(!tiddler.fields[extField]){
					return false;
				}
				else{
					return tiddler.fields[extField];
				}
			}
		}
		
		,setMetaData: function(title,extField,extFieldVal){
			extField = extField.toLowerCase();
			if(extFieldVal == "null") {
				extFieldVal = "";
			}
			var tiddler =  store.getTiddler(title);
			if(!tiddler) {
				store.saveTiddler(title,title,null,true,null,[],config.defaultCustomFields,null);
				tiddler =  store.getTiddler(title);
			}
			store.setValue(tiddler,extField,extFieldVal);	
			
		
		}
		,createDatePicker: function(place,title,metaDataName){
		        
		        var tiddler = store.getTiddler(title);
		        var params = [metaDataName];
		        
                        var div = document.createElement("div");
                        div.className  = "datePicker";
                        var input = document.createElement("input");
                        input.className = "date-pick";
                        jQuery(div).append(input);
                        jQuery(place).append(div);
                        $(function()
                        {
                                var start =config.macros.AdvancedEditTemplate.getMetaData(title,metaDataName);
                                if(!start)start="";
                        	$(input).datePicker({startDate:'01/01/1700'}).val(start).trigger('change');
                        	$(input).change(function(e){
                        	        config.macros.AdvancedEditTemplate.setMetaData(title,metaDataName,this.value);
                        	
                        	});
                        });
              
		        //config.macros.edit.handler(place,false,params,false,false,tiddler)
                        
		}
		
		,createCheckBox: function(place,title,metaDataName){
		         
		        		var c = document.createElement("input");
		        		
					c.setAttribute("type","checkbox");
					c.value = "false";
					   //    alert("!");
	                               place.appendChild(c);
					var selected =this.getMetaData(title,metaDataName);
				
					if(!selected){
						var qsvalue =this.getVariableFromQueryString(metaDataName);
						if(qsvalue) selected = qsvalue;
					}
				
					if(selected){
					        c.value = selected;
					        c.checked = true;
					  
					        
					}
			
					var that = this;
					
					jQuery(c).click(function(e){
					     
						var taskTiddler = story.findContainingTiddler(place);
						var title = taskTiddler.getAttribute("tiddler");
						
						if(this.checked){
							that.setMetaData(title,metaDataName,"true");
						}
						else{
						  
							that.setMetaData(title,metaDataName,null);
						}
					});
						
					
		}
	};
	
	
	config.macros.AdvancedEditTemplate.EditTemplateImage = function(place,paramString,initial,handler){
		this.init(place,paramString,initial,handler);
	};
	config.macros.AdvancedEditTemplate.EditTemplateImage.prototype = {
		init: function(place,paramString,initial,handler){
			var holder = document.createElement("div");
			holder.className = "AdvancedEditTemplateImage";
			var form = document.createElement("form");
			form.setAttribute("enctype","multipart/form-data");
			form.setAttribute("action","http://localhost/ilga/upload");
			form.setAttribute("method","POST");
			form.setAttribute("target","_blank");
			var input = document.createElement("input");
			var submit = document.createElement("input");
			submit.type = "button";

			input.type = "file";

			var image = document.createElement("img");
			image.src = initial;
			image.alt = "currently selected image";

			var params = paramString.parseParams("anon",null,true,false,false);
                	
			var root = getParam(params,"root", null);
			var connector = getParam(params,"connector", null);
		   
			var home =  getParam(params,"home", null);
			

			//var root  ='images/'
			//var connector = 
			//var home = http://www.jonrobson.me.uk/projects/AdvancedEditTemplate/connectors/

			//	var connector= "http://www.jonrobson.me.uk/projects/AdvancedEditTemplate/connectors/jqueryFileTree.php";	
			jQuery(holder).append("<div class='tip'>The image currently selected is shown below if selected</div>");
			holder.appendChild(image);
			//jQuery(holder).append("<div class='tip'>Please select a file from your local machine to upload.</div>");
			//form.appendChild(input);
			//input.name = "mysexyfile";
			//form.appendChild(submit);			
			holder.appendChild(form);
			jQuery(holder).append("<div class='tip'>Please select a file from the server (listed below) to use as the image or enter the path to that filename.</div>");

			place.appendChild(holder);


            
			var filename = document.createElement("input");
			
			filename.onchange = function(e){
				var newsrc = this.value;
				image.src=  "";
				image.src = newsrc;
				if(handler)handler(newsrc);
			};
			if(initial)filename.value = initial;			
			//filename.setAttribute("type","hidden");
			holder.appendChild(filename);
			jQuery(holder).append("<div class='browserarea' style='position:relative;'><input type='button' class='browsebutton' value='browse'><div class='filebrowser' style='position:absolute;display:none;'></div></div>");
			var bb = jQuery(".browsebutton",holder);
			bb.click(function(e){
			    var browser =$(".filebrowser",$(this).parent());
			    browser.toggle();
		
			    browser.css({left:$(this).position().left});    
			})
			
			
			var browser = jQuery(".filebrowser");

			var r;
			if(!home) home = "";
			if(root) r =root; else r ="";
			browser.fileTree({ root: r, script: connector }, function(file) { 
						filename.value = home +file;
						filename.onchange();
			});
			
		}
	};
};


//}}}
