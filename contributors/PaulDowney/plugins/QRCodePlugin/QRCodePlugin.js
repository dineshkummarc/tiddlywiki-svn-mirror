/***
|''Name:''|QRCodePlugin|
|''Description:''|embed QR Codes|
|''Author:''|PaulDowney (psd (at) osmosoft (dot) com)|
|''CodeRepository:''|http://svn.tiddlywiki.org/Trunk/contributors/PaulDowney/plugins/QRCodePlugin/ |
|''Version:''|0.1|
|''License:''|[[BSD open source license]]|
|''Comments:''|Please make comments at http://groups.google.co.uk/group/TiddlyWikiDev |
|''~CoreVersion:''|2.4|
!Original Code
Original code by Kazuhiko Arase, taken from http://www.d-project.com/qrcode/index.html
!Code
***/
//{{{
if(!version.extensions.QRCodePlugin){
version.extensions.QRCodePlugin = {installed:true};

	config.macros.QRCode = { 

		handler: function(place,macroName,params,wikifier,paramString,tiddler){
			var qr = new Qrcode;
			var res = qr.make_qrcode(byteSplit(paramString));
			var e = createTiddlyElement(place,"div");
			e.innerHTML = maketable(res);
		}
	};

setStylesheet('table.qr { cellspacing: 0px; padding: 0px; border-style: none; }'
	+'td.qr0 { width: 4px; height: 4px; background: #000; padding: 0px; margin: 0px; border-style: none; }'
	+'td.qr1 { width: 4px; height: 4px; background: #FFF; padding: 0px; margin: 0px; border-style: none; }',
	'qrcode');

function File(filename,mode){
	this.offset = 0;
	this.binmode = (/bin/.test(mode)) ? true : false ;
	var req = new XMLHttpRequest;
	if(this.binmode) filename+=".hex";
	req.open("GET",filename,false);
	req.send(null);
	this.file = req.responseText;
}
File.open = function(filename,mode){
	return new File(filename,mode)
}

File.prototype.read = function(length){
	if(this.binmode){length *= 2}
	var res = this.file.substr(this.offset,length)
	this.offset += length;
	if(this.binmode){
		res = res.pack();
	}
	return res
}

File.prototype.close = null;

/*
 Array extra support (ver 1.0 / 2005-09-13)
  by ma.la http://ma.la/

 Licence: GPL
  http://www.gnu.org/copyleft/gpl.html
*/

Array.prototype.forEach = function(callback,thisObject){
	for(var i=0,len=this.length;i<len;i++)
		callback.call(thisObject,this[i],i,this)
}
Array.prototype.map = function(callback,thisObject){
	for(var i=0,res=[],len=this.length;i<len;i++)
		res[i] = callback.call(thisObject,this[i],i,this);
	return res
}
Array.prototype.filter = function(callback,thisObject){
	for(var i=0,res=[],len=this.length;i<len;i++)
		callback.call(thisObject,this[i],i,this) && res.push(this[i]);
	return res
}
Array.prototype.indexOf = function(searchElement,fromIndex){
	var i = (fromIndex < 0) ? this.length+fromIndex : fromIndex || 0;
	for(;i<this.length;i++)
		if(searchElement === this[i]) return i;
	return -1
}
Array.prototype.lastIndexOf = function(searchElement,fromIndex){
	var max = this.length-1;
	var i = (fromIndex < 0)   ? Math.max(max+1 + fromIndex,0) :
			(fromIndex > max) ? max :
			max-(fromIndex||0) || max;
	for(;i>=0;i--)
		if(searchElement === this[i]) return i;
	return -1
}
Array.prototype.every = function(callback,thisObject){
	for(var i=0,len=this.length;i<len;i++)
		if(!callback.call(thisObject,this[i],i,this)) return false;
	return true
}
Array.prototype.some = function(callback,thisObject){
	for(var i=0,len=this.length;i<len;i++)
		if(callback.call(thisObject,this[i],i,this)) return true;
	return false
}
/*
  and more extra methods
*/
Array.prototype.clone = function(){
	return Array.apply(null,this)
};

(function(){
 var native_sort = Array.prototype.sort;
 Array.prototype.sortIt = function(){return native_sort.apply(this,arguments)}
 var native_reverse = Array.prototype.reverse;
 Array.prototype.reverseIt = function(){return native_reverse.apply(this,arguments)}
})();
Array.prototype.sort = function(){
	var tmp = this.clone();
	return tmp.sortIt.apply(tmp,arguments)
}
Array.prototype.reverse = function(){
	var tmp = this.clone();
	return tmp.reverseIt.apply(tmp,arguments)
}

Array.prototype.last = function(){
	return this[this.length-1]
}
Array.prototype.compact = function(){
	return this.remove("");
}
Array.prototype.uniq = function(){
	var tmp = {};
	var len = this.length;
	for(var i=0;i<this.length;i++){
		if(tmp.hasOwnProperty(this[i])){
			this.splice(i,1);
			if(this.length == i){break}
			i--;
		}else{
			tmp[this[i]] = true;
		}
	}
	return this;
}
Array.prototype.select = function(func){
	var result = [];
	for(var i=0;i<this.length;i++)
		func(this[i],i) && result.push(this[i]);
	return result;
}

Array.prototype.lazyselect = function(func,num,callback){
	var result = [];
	var count  = 0;
	var self   = this;
	for(var i=0;i<this.length;i++){
		if(func(this[i],i)){
			count++;
			result.push(this[i])
		}
		if(count == num){i++; break;}
	}
	(function(){
		if(i == self.length){arguments.callee.kill();return;}
		if(func(self[i],i)){
			result.push(self[i]);
			callback({
				result : result,
				thread : arguments.callee
			});
			window.status = "追加"+i;
		}
		i++
	}).bg(10);
	return result;
}

Array.prototype.append = function(val){
	this.push(val);
	return this
}
Array.prototype.remove = function(to_remove){
	return this.select(function(val){
		return val != to_remove ? true : false
	});
}

Array.prototype.splitter = function(callback,thisObject){
	var res = [];
	var tmp = [];
	for(var i=0,len=this.length;i<len;i++)
		callback.call(thisObject,this[i],i,this) ? 
			(tmp.push(this[i]),res.push(tmp),tmp=[]) : 
			 tmp.push(this[i]);
	tmp.length ? res.push(tmp) : 0;
	return res;
}
Array.prototype.splitPer = function(num){
	return this.splitter(function(v,i){return i%num==num-1});
}

Array.prototype.splitTo = function(num){
	var per = Math.ceil(this.length / num);
	return this.splitter(function(v,i){return i%per==per-1});
}


/*
 date_extra.js

*/

if(typeof Locale == "undefined") Locale = {};
Locale.jp = {
 abday   : ["日", "月", "火", "水", "木", "金", "土"],
 day     : ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"],
 abmon   : [" 1月", " 2月", " 3月", " 4月", " 5月", " 6月", " 7月", " 8月", " 9月", "10月", "11月", "12月"],
 mon     : ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
 d_t_fmt : "%Y年%m月%d日 %H時%M分%S秒",
 d_fmt   : "%Y年%m月%d日",
 t_fmt   : "%H時%M分%S秒",
 am_pm   : ["午前", "午後"],
 t_fmt_ampm : "%p%H時%M分%S秒"
}
Locale.en = {
 abday   : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
 day     : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
 abmon   : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
 mon     : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
 d_t_fmt : "%a %b %d %Y",
 d_fmt   : "%d/%m/%Y",
 t_fmt   : "%H:%M:%S",
 am_pm   : ["AM", "PM"]
}

Date.setLocale = function(lc){
	Date.prototype.locale = lc
}
Date.prototype.setLocale = function(lc){
	this.locale = lc;
	return this;
}

Date.isleap = function(year){
 return ((year % 400) == 0) ? 1 :
		((year % 100) == 0) ? 0 :
		((year % 4)   == 0) ? 1 :
		 0;
}
Date.prototype.isleap = function(){
	return Date.isleap(this.getFullYear())
}
Date.month_yday = [
	[0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365],
	[0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366]
];
/*
 tm object like ruby
  mon : 1-12
  yday: 1-366
*/
Date.prototype.tm = function(){
	with(this){return {
		year : getFullYear(),
		mon  : getMonth() + 1,
		mday : getDate(),
		yday : Date.month_yday[isleap()][getMonth()] + getDate(),
		wday : getDay(),
		hour : getHours(),
		min  : getMinutes(),
		sec  : getSeconds()
	}}
}
/*
http://www.microsoft.com/japan/msdn/library/default.asp?url=/japan/msdn/library/ja/cpref/html/frlrfSystemGlobalizationDateTimeFormatInfoClassTopic.asp 
*/
Date.prototype.toObject = function(){
	var zerofill = function(keta){
		return function(){return ("0".x(keta) + this).slice(-keta)}
	}
	with(this.tm()){
	var o = {
		yyyy : year,
		M    : mon,
		d    : mday,
		t    : Locale[this.locale].am_pm[(hour < 12 ) ? 0 : 1],
		h    : hour % 12 || 12,
		H    : hour,
		m    : min,
		s    : sec
	}}
	o.yy = this.getYear().format(zerofill(2));
	"M d H h m s".split(" ").forEach(function(v){
		o[v+v] = o[v].format(zerofill(2))
	});
	return o;
}
Date.prototype.strfObject = function(){
	var self = this;
	var tm = this.tm();
	var o  = this.toObject();
	var lc = Locale[this.locale];
	var lazy = function(f){
		var tmp = {};
		tmp.toString = function(){return self.strftime(f)}
		return tmp;
	}
	return {
		"a" : lc.abday[tm.wday],
		"A" : lc.day[tm.wday],
		"b" : lc.abmon[tm.mon-1],
		"B" : lc.mon[tm.mon-1],
		"c" : lazy(lc.d_t_fmt),
		"d" : o.dd,
		"H" : o.HH,
		"I" : o.hh,
		"j" : tm.yday,
		"M" : o.mm,
		"m" : o.MM,
		"p" : o.t,
		"S" : o.ss,
		"U" : "",
		"w" : tm.wday,
		"W" : "",
		"x" : lazy(lc.d_fmt),
		"X" : lazy(lc.t_fmt),
		"Y" : o.yyyy,
		"y" : o.yy,
		"z" : "",
		"Z" : ""
	}
}
Date.prototype.strftime = function(format){
	var obj = this.strfObject();
	return format.replace(/%(\w{1})/g,function(){
		var arg = arguments;
		return obj[arg[1]]
	})
}
Date.prototype.format = function(){

};
/*
 Function.prototype
*/

Function.prototype.isFunction = true;

Function.prototype.New = 
Function.prototype.newInstance = function(){
	for(var i=0,arg=[];i<arguments.length;i++) arg.push("arguments["+i+"]");
	eval("var ins = new this("+arg.join(",")+")");
	return ins;
}
Function.prototype.getbody = function(){
	var m;
	return (m=this.toString().match(RE.func_body)) ? m[1] : "";
}
Function.prototype.getname = function(){
	var m;
	return (m=this.toString().match(RE.func_name)) ? m[1] : "";
}
Function.prototype.getargs = function(){
	var m;
	return (m=this.toString().match(RE.func_args)) ? m[1].split(/\s*,\s*/) : [];
}
// 使われている変数名を取得する
Function.prototype.getvars = function(){
	var body = this.getbody();
	var list = [];
	body.replace(/var ([\w$]+)/g,function(){
		list.push(arguments[1])
	});
	return list;
}

Function.prototype.rename = function(name){
	var self = this;
	eval("var tmp = function "+name+"("+self.getargs().join(",")+")"+"{return self.apply(this,arguments)}");
	return tmp
}
Function.prototype.renameArgs = function(arg){
	var self = this;
	eval("var tmp = function " + self.getname() + "(" + arg.join(",")+")"+"{return self.apply(this,arguments)}");
	return tmp
}
Function.prototype.rebuild = function(){
	var self = this;
	return Function(
		self.getargs().join(","),
		self.getbody()
	);
}
Function.prototype.rebuildWith = function(base){
	var self = this;
	var tmp  = new Function(
		self.getargs().join(","),
		"with(arguments.callee.__base__){" + self.getbody() + "}"
	);
	tmp.__base__ = base;
	return tmp;
}
Function.prototype.swap = function(func){
	this.call  = function(){return func.apply(arguments[0],arguments.toArray().slice(1))}
	this.apply = function(){return func.apply(arguments[0],arguments[1])}
	return this;
}
Function.prototype.applied = function(thisObj,args){
	var self = this;
	return function(){
		return self.apply(thisObj,args)
	}
}
Function.prototype.bindThis = function(thisObj){
	var self = this;
	return function(){
		return self.apply(thisObj,arguments)
	}
}

Function.prototype.to_here = function(str){
	return "var str = " + this
}

Function.prototype.to_eval = function(re){
	var self = this;
	return "try{" 
		+ self.getbody().replace(/(function.*?\{[^}]*?\})|(return)/g,
			function(){return $1 ? $0 : "throw"}.replace_callback()
		)
		+ "}catch(e){"
		+ (re ? "var " + re + " = e" : "")
		+ "}"
}

/*
 AOP
*/
Function.prototype.addBefore = function(func){
	var self = this;
	return function(){
		var args = func(arguments);
		return (args) ? self.apply(this,args) : self.apply(this,arguments)
	}
}
Function.prototype.addAfter  = function(func){
	var self = this;
	return function(){
		var old_rv = self.apply(this,arguments);
		var result = func(old_rv,arguments);
		return (result) ? result : old_rv;
	}
}
Function.prototype.addAround = function(func){
	return function(){
		return func.apply(this,arguments);
	}
}


/*
 Number.prototype
  2005-09-15
*/
Number.prototype.isNumber = true;

function zerofill(keta){
	return function(){return ("0".x(keta) + this).slice(-keta)}
}
Number.prototype.zerofill = function(keta){
	return ("0".x(keta) + this).slice(-keta)
}
Number.prototype.format = function(func){
	this.toString = func;
	return this;
}
/*
 Object.prototype

*/
Object.extend = function(destination, source) {
	for (property in source) {
		source.own(property) &&
			(destination[property] = source[property])
	}
	return destination;
}
Object.prototype.extend = function(object) {
  return Object.extend.apply(this, [this, object]);
}
/*
Object.prototype.own = function(key){
	return this.hasOwnProperty(key)
}
*/
Object.prototype.own = Object.prototype.hasOwnProperty;

Object.prototype.extend({
	forEach : function(callback,thisObject){
		for(var i in this)
			this.own(i) && callback.call(thisObject,this[i],i,this)
	},
	every : function(callback,thisObject){
		for(var i in this)
			if(this.own(i)){
				if(!callback.call(thisObject,this[i],i,this)) return false;
			}
		return true;
	},
	keys : function(){
		var tmp = [];
		for(var i in this) this.own(i) && tmp.push(i);
		return tmp;
	},
	values : function(){
		var tmp = [];
		for(var i in this) this.own(i) && tmp.push(this[i]);
		return tmp;
	},
	each : function(func){
		for(var i in this) this.own(i) && func(this[i],i,this)
	},
	map  : function(callback,thisObject){
		var tmp = {};
		for(var i in this)
			this.own(i) && (tmp[i] = callback.call(thisObject,this[i],i,this));
		return tmp
	},
	toArray : function(){
		var tmp = [];
		for(var i=0;i<this.length;i++) tmp[i] = this[i];
		return tmp;
	},
	loop : function(func){
		for(var i=0;i<this.length;i++){
			if(this.hasOwnProperty(i)) func(i,this[i],this)
		}
	}
});
Object.prototype.getClassName = function(){
	return this.constructor.getname();
}


/*
 RegExp.prototype
*/

RegExp.prototype.isRegExp = true;

RE = Regexp = RegExp;
RegExp.escape = function(str){
	return str.replace(/(\\|\[|\]|\(|\)|\{|\}|\^|\-|\$|\||\+|\*|\?|\.|\!)/g,"\\$1");
};

// よく使われる正規表現を高速化
RE.func_body = /\{((:?.|\n)*)\}/;
RE.func_name = /function ([\w$]+)/;
RE.func_args = /\(([^)]*)/;

function MatchData(){
	var self = this;
	this.leftContext = this.pre_match  = new LazyString(function(){
		return self.input.slice(0,self.index)
	});
	this.rightContext = this.post_match = new LazyString(function(){
		return self.input.slice(self.index+self.$0.length)
	});
	return this;
}
MatchData.prototype.update = function(a){
	this.lastMatch = this.$0 = a[0];
	this.match = this.captures = [];
	for(var i=1;i<a.length-2;i++){
		this.match.push(a[i]);
		this["$"+i] = a[i];
	}
	this.index = a[a.length-2];
	this.input = this.$_ = a[a.length-1];
}

// 関数をreplaceのcallbackとして使いやすいように
Function.prototype.replace_callback = function(thisObject){
	var self = this;
	var match = new MatchData();
	var newfunc = self.rebuildWith(match);
	return function(){
		match.update(arguments);
		return newfunc.call(thisObject)
	}
}



/*
 String.prorotype

*/
String.prototype.isString = true;
String.prototype.x = function(l){
	for(var i=0,tmp="";i<l;i++) tmp+=this;
	return tmp;
}
String.prototype.chars = function() { return(this.split("")) }
String.prototype.toRegExp = function(){
	return new RegExp(this);
}



function LazyNumber(func){
	this.toString = function(base){
		return base ? (func()).toString(base) : func()
	};
	this.isLazy = true;
}
function LazyString(func){
	this.toString = func;
	this.length = new LazyNumber(function(){return func().toString().length});
	this.isLazy = true;
}
LazyString.methods = [
	"split","substr","substring","slice","concat","toUpperCase","toLowerCase",
	"search","match","replace","charAt","length"
];
(function(){
	var m = LazyString.methods;
	var mm = function(method){
		return function(){
			var tmp = this.toString();
			return tmp[method].apply(tmp,arguments)
		}
	}
	for(var i=0;i<m.length;i++){
		LazyString.prototype[m[i]] = mm(m[i]);
	}
})();
Function.prototype.bg = function(ms){
	this.PID = setInterval(this,ms);
	return this;
}
Function.prototype.kill = function(){
	clearInterval(this.PID)
}
/*
 var a = function(v){alert(v)};
 var b = a.later(100);
 b("testtest");
 b.cancel(); // cancel
 b.notify(); // do 
*/
Function.prototype.later = function(ms){
	var self = this;
	var func = function(){
		var arg = func.arguments;
		var apply_to = this;
		var later_func = function(){
			self.apply(apply_to,arg)
		};
		var PID = setTimeout(later_func,ms);
		return {
			cancel : function(){clearTimeout(PID)},
			notify : function(){clearTimeout(PID);later_func()}
		}
	};
	return func;
};
Function.prototype.wait = Function.prototype.later;


//!/usr/local/bin/ruby
//
// QRcode class library for ruby version 0.50beta6  (c)2002-2004 Y.Swetake
//
//

/*
 for JavaScript by ma.la / (2005/10)
 http://la.ma.la/misc/qrcode/
*/

nil = null;

function Qrcode(){
	this.initialize.apply(this,arguments)
}

Qrcode.prototype.extend({

initialize : function(){
	this.path="./qrcode_data"

	this.qrcode_error_correct="M"
	this.qrcode_version=0

	this.qrcode_structureappend_n=0
	this.qrcode_structureappend_m=0
	this.qrcode_structureappend_parity=""
	this.qrcode_structureappend_originaldata=""
},


string_bit_cal : function(s1,s2,ind){
	if (s1.length>s2.length){
		s3=s1
		s1=s2
		s2=s3
	}
	i=0
	res=""
	left_length=s2.length-s1.length
	
	switch(ind){
	 case "xor" :
		s1.each_byte(function(b){
			res += (b ^ s2.charCodeAt(i)).chr()
			i += 1
		})
		res += s2[s1.length,left_length]
		break
	  case "or" :
		s1.each_byte(function(b){
			res += (b | s2.charCodeAt(i)).chr()
			i += 1
		})
		res += s2[s1.length,left_length]
		break
	  case "and" :
		s1.each_byte(function(b){
			res += (b & s2.charCodeAt(i)).chr()
			i += 1
		})
		res += chr(0).x(left_length)
		break
	}
//	alert("res" + res.unpack("C*"));

	return(res)
},


string_bit_not : function(s1){
	res=""
	s1.each_byte(function(b){res += (256 + ~b).chr()})
	return(res)
},


set_qrcode_version : function(z){
	if (z>=0 && z<=40) 
		this.qrcode_version=z
},

set_qrcode_error_correct : function(z){
	this.qrcode_error_correct=z
},


get_qrcode_version : function(){
	return this.qrcode_version
},


set_structureappend : function(m,n,p){
	if (n>1 && n<=16 && m>0 && m<=16 && p>=0 && p<=255){
		this.qrcode_structureappend_m=m
		this.qrcode_structureappend_n=n
		this.qrcode_structureappend_parity=p
	}
},


cal_structureappend_parity : function(originaldata){
	if (originaldata.length>1) {
		structureappend_parity=0
		originaldata.each_byte(function(b){structureappend_parity^=b})
		return structureappend_parity
	}
},

make_qrcode : function(qrcode_data_string){
    var data_length, data_counter, data_value, data_bits, codeword_num_plus, codeword_num_counter_value, i, alphanumeric_character_hash, total_data_bits, ecc_character_hash, ec, max_data_bits_array, j, max_data_bits, max_codewords_array, max_codewords, max_modules_1side, matrix_remain_bit, byte_num, filename, fp, matx, maty, masks, fi_x, fi_y, rs_ecc_codewords, rso, matrix_x_array, matrix_y_array, mask_array, rs_block_order, format_information_x2, format_information_y2, format_information_x1, format_information_y1, max_data_codewords, rs_cal_table_array, frame_data, codewords_counter, codewords, remaining_bits, buffer, buffer_bits, flag, rs_block_number, rs_temp, rs_block_order_num, rs_codewords, rs_data_codewords, rstemp, first, left_chr, cal, matrix_content, codeword_i, codeword_bits_number, matrix_remain, remain_bit_temp, min_demerit_score, hor_master, ver_master, k, l, all_matrix, demerit_n1, ptn_temp, bit, bit_r, bit_mask, hor, ver, ver_and, ver_or, n1_search, n2_search1, n2_search2, n3_search, n4_search, hor_temp, demerit_n3, demerit_n4, demerit_n2, demerit_score, mask_number, mask_content, format_information_value, format_information_array, content, out, mxe;
    data_length = qrcode_data_string.length;
    if (data_length <= 0) {
        throw "Data do not exist";
        return 0;
    }
    data_counter = 0;
    data_value = [];
    data_bits = [];
    if (this.qrcode_structureappend_n > 1) {
        data_value[0] = 3;
        data_bits[0] = 4;
        data_value[1] = this.qrcode_structureappend_m - 1;
        data_bits[1] = 4;
        data_value[2] = this.qrcode_structureappend_n - 1;
        data_bits[2] = 4;
        data_value[3] = this.qrcode_structureappend_parity;
        data_bits[3] = 8;
        data_counter = 4;
    }
    data_bits[data_counter] = 4;
    if (/[^0-9]/.test(qrcode_data_string)) {
        if (/[^0-9A-Z \$\*\%\+\-\.\/\:]/.test(qrcode_data_string)) {
            codeword_num_plus = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8];
            data_value[data_counter] = 4;
            data_counter += 1;
            data_value[data_counter] = data_length;
            data_bits[data_counter] = 8;
            codeword_num_counter_value = data_counter;
            data_counter += 1;
            i = 0;
            while (i < data_length) {
                data_value[data_counter] = qrcode_data_string.charCodeAt(i);
                data_bits[data_counter] = 8;
                data_counter += 1;
                i += 1;
            }
        } else {
            codeword_num_plus = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4];
            data_value[data_counter] = 2;
            data_counter += 1;
            data_value[data_counter] = data_length;
            data_bits[data_counter] = 9;
            codeword_num_counter_value = data_counter;
            alphanumeric_character_hash = {'0':0, '1':1, '2':2, '3':3, '4':4, '5':5, '6':6, '7':7, '8':8, '9':9, A:10, B:11, C:12, D:13, E:14, F:15, G:16, H:17, I:18, J:19, K:20, L:21, M:22, N:23, O:24, P:25, Q:26, R:27, S:28, T:29, U:30, V:31, W:32, X:33, Y:34, Z:35, ' ':36, $:37, '%':38, '*':39, '+':40, '-':41, '.':42, '/':43, ':':44};
            i = 0;
            data_counter += 1;
            while (i < data_length) {
                if ((i % 2) == 0) {
                    data_value[data_counter] = alphanumeric_character_hash[qrcode_data_string.ruby_slice(i, 1)];
                    data_bits[data_counter] = 6;
                } else {
                    data_value[data_counter] = data_value[data_counter] * 45 + alphanumeric_character_hash[qrcode_data_string.ruby_slice(i, 1)];
                    data_bits[data_counter] = 11;
                    data_counter += 1;
                }
                i += 1;
            }
        }
    } else {
        codeword_num_plus = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4];
        data_value[data_counter] = 1;
        data_counter += 1;
        data_value[data_counter] = data_length;
        data_bits[data_counter] = 10;
        codeword_num_counter_value = data_counter;
        i = 0;
        data_counter += 1;
        while (i < data_length) {
            if ((i % 3) == 0) {
                data_value[data_counter] = qrcode_data_string.ruby_slice(i, 1).to_i();
                data_bits[data_counter] = 4;
            } else {
                data_value[data_counter] = data_value[data_counter] * 10 + qrcode_data_string.ruby_slice(i, 1).to_i();
                if ((i % 3) == 1) {
                    data_bits[data_counter] = 7;
                } else {
                    data_bits[data_counter] = 10;
                    data_counter += 1;
                }
            }
            i += 1;
        }
    }
    if (typeof data_bits[data_counter] == "undefined") {
    } else {
        if (data_bits[data_counter] > 0) {
            data_counter += 1;
        }
    }
    i = 0;
    total_data_bits = 0;
    while (i < data_counter) {
        total_data_bits += data_bits[i];
        i += 1;
    }
    ecc_character_hash = {L:1, l:1, M:0, m:0, Q:3, q:3, H:2, h:2};
    ec = ecc_character_hash[this.qrcode_error_correct];
    if (!ec) {
        ec = 0;
    }
    max_data_bits_array = [0, 128, 224, 352, 512, 688, 864, 992, 1232, 1456, 1728, 2032, 2320, 2672, 2920, 3320, 3624, 4056, 4504, 5016, 5352, 5712, 6256, 6880, 7312, 8000, 8496, 9024, 9544, 10136, 10984, 11640, 12328, 13048, 13800, 14496, 15312, 15936, 16816, 17728, 18672, 152, 272, 440, 640, 864, 1088, 1248, 1552, 1856, 2192, 2592, 2960, 3424, 3688, 4184, 4712, 5176, 5768, 6360, 6888, 7456, 8048, 8752, 9392, 10208, 10960, 11744, 12248, 13048, 13880, 14744, 15640, 16568, 17528, 18448, 19472, 20528, 21616, 22496, 23648, 72, 128, 208, 288, 368, 480, 528, 688, 800, 976, 1120, 1264, 1440, 1576, 1784, 2024, 2264, 2504, 2728, 3080, 3248, 3536, 3712, 4112, 4304, 4768, 5024, 5288, 5608, 5960, 6344, 6760, 7208, 7688, 7888, 8432, 8768, 9136, 9776, 10208, 104, 176, 272, 384, 496, 608, 704, 880, 1056, 1232, 1440, 1648, 1952, 2088, 2360, 2600, 2936, 3176, 3560, 3880, 4096, 4544, 4912, 5312, 5744, 6032, 6464, 6968, 7288, 7880, 8264, 8920, 9368, 9848, 10288, 10832, 11408, 12016, 12656, 13328];
    if (this.qrcode_version == 0) {
        i = 1 + 40 * ec;
        j = i + 39;
        this.qrcode_version = 1;
        while (i <= j) {
            if ((max_data_bits_array[i]) >= total_data_bits + codeword_num_plus[this.qrcode_version]) {
                max_data_bits = max_data_bits_array[i];
                break;
            }
            i += 1;
            this.qrcode_version += 1;
        }
    } else {
        max_data_bits = max_data_bits_array[this.qrcode_version + 40 * ec];
    }
    total_data_bits += codeword_num_plus[this.qrcode_version];
    data_bits[codeword_num_counter_value] += codeword_num_plus[this.qrcode_version];
    max_codewords_array = [0, 26, 44, 70, 100, 134, 172, 196, 242, 292, 346, 404, 466, 532, 581, 655, 733, 815, 901, 991, 1085, 1156, 1258, 1364, 1474, 1588, 1706, 1828, 1921, 2051, 2185, 2323, 2465, 2611, 2761, 2876, 3034, 3196, 3362, 3532, 3706];
    max_codewords = max_codewords_array[this.qrcode_version];
    max_modules_1side = 17 + (this.qrcode_version << 2);
    matrix_remain_bit = [0, 0, 7, 7, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0];
    try {
        byte_num = matrix_remain_bit[this.qrcode_version] + (max_codewords << 3);
        filename = this.path + "/qrv" + this.qrcode_version.to_s() + "_" + ec.to_s() + ".dat";
        fp = File.open(filename, "rb_bin");
        matx = fp.read(byte_num);
        maty = fp.read(byte_num);
        masks = fp.read(byte_num);
        fi_x = fp.read(15);
        fi_y = fp.read(15);
        rs_ecc_codewords = fp.read(1).unpack("C")[0];
        rso = fp.read(128);
        matrix_x_array = matx.unpack("C*");
        matrix_y_array = maty.unpack("C*");
        mask_array = masks.unpack("C*");
        rs_block_order = rso.unpack("C*");
        format_information_x2 = fi_x.unpack("C*");
        format_information_y2 = fi_y.unpack("C*");
        format_information_x1 = [0, 1, 2, 3, 4, 5, 7, 8, 8, 8, 8, 8, 8, 8, 8];
        format_information_y1 = [8, 8, 8, 8, 8, 8, 8, 8, 7, 5, 4, 3, 2, 1, 0];
        max_data_codewords = (max_data_bits >> 3);
        filename = this.path + "/rsc" + rs_ecc_codewords.to_s() + ".dat";
        fp = File.open(filename, "rb_bin");
        i = 0;
        rs_cal_table_array = [];
        while (i < 256) {
            rs_cal_table_array[i] = fp.read(rs_ecc_codewords);
            i += 1;
        }
        filename = this.path + "/qrvfr" + this.qrcode_version.to_s() + ".dat";
        fp = File.open(filename, "rb");
        frame_data = fp.read(65535);
    } catch (e) {
        throw e;
    }
    if (total_data_bits <= max_data_bits - 4) {
        data_value[data_counter] = 0;
        data_bits[data_counter] = 4;
    } else {
        if (total_data_bits < max_data_bits) {
            data_value[data_counter] = 0;
            data_bits[data_counter] = max_data_bits - total_data_bits;
        } else {
            if (total_data_bits > max_data_bits) {
                throw "Overflow error";
                return 0;
            }
        }
    }
    i = 0;
    codewords_counter = 0;
    codewords = [];
    codewords[0] = 0;
    remaining_bits = 8;
    while ((i <= data_counter)) {
        buffer = data_value[i];
        buffer_bits = data_bits[i];
        flag = 1;
        while (flag != 0) {
            if (remaining_bits > buffer_bits) {
                if (codewords[codewords_counter] == nil) {
                    codewords[codewords_counter] = 0;
                }
                codewords[codewords_counter] = ((codewords[codewords_counter] << buffer_bits) | buffer);
                remaining_bits -= buffer_bits;
                flag = 0;
            } else {
                buffer_bits -= remaining_bits;
                codewords[codewords_counter] = ((codewords[codewords_counter] << remaining_bits) | (buffer >> buffer_bits));
                if (buffer_bits == 0) {
                    flag = 0;
                } else {
                    buffer = (buffer & ((1 << buffer_bits) - 1));
                    flag = 1;
                }
                codewords_counter += 1;
                if (codewords_counter < max_data_codewords - 1) {
                    codewords[codewords_counter] = 0;
                }
                remaining_bits = 8;
            }
        }
        i += 1;
    }
    if (remaining_bits != 8) {
        codewords[codewords_counter] = codewords[codewords_counter] << remaining_bits;
    } else {
        codewords_counter -= 1;
    }
    if (codewords_counter < max_data_codewords - 1) {
        flag = 1;
        while (codewords_counter < max_data_codewords - 1) {
            codewords_counter += 1;
            if (flag == 1) {
                codewords[codewords_counter] = 236;
            } else {
                codewords[codewords_counter] = 17;
            }
            flag = flag * (-1);
        }
    }
    i = 0;
    j = 0;
    rs_block_number = 0;
    rs_temp = [];
    rs_temp[0] = "";
    while (i < max_data_codewords) {
        rs_temp[rs_block_number] += codewords[i].chr();
        j += 1;
        if (j >= rs_block_order[rs_block_number] - rs_ecc_codewords) {
            j = 0;
            rs_block_number += 1;
            rs_temp[rs_block_number] = "";
        }
        i += 1;
    }
    rs_block_number = 0;
    rs_block_order_num = rs_block_order.length;
    while (rs_block_number < rs_block_order_num) {
        rs_codewords = rs_block_order[rs_block_number];
        rs_data_codewords = rs_codewords - rs_ecc_codewords;
        rstemp = rs_temp[rs_block_number];
        j = rs_data_codewords;
        while (j > 0) {
            first = rstemp.charCodeAt(0);
            if (first != 0) {
                left_chr = rstemp.ruby_slice(1, rstemp.length - 1);
                cal = rs_cal_table_array[first];
                rstemp = this.string_bit_cal(left_chr, cal, "xor");
            } else {
                rstemp = rstemp.ruby_slice(1, rstemp.length - 1);
            }
            j -= 1;
        }
        codewords = codewords.concat(rstemp.unpack("C*"));
        rs_block_number += 1;
    }
    matrix_content = (new Range(0, max_modules_1side, true)).collect((function () {return (new Array(max_modules_1side)).fill(0);}));
    i = 0;
    while (i < max_codewords) {
        codeword_i = codewords[i];
        j = 7;
        while (j >= 0) {
            codeword_bits_number = (i << 3) + j;
            matrix_content[matrix_x_array[codeword_bits_number]][matrix_y_array[codeword_bits_number]] = ((255 * (codeword_i & 1)) ^ mask_array[codeword_bits_number]);
            codeword_i = codeword_i >> 1;
            j -= 1;
        }
        i += 1;
    }
    matrix_remain = matrix_remain_bit[this.qrcode_version];
    while (matrix_remain > 0) {
        remain_bit_temp = matrix_remain + (max_codewords << 3) - 1;
        matrix_content[matrix_x_array[remain_bit_temp]][matrix_y_array[remain_bit_temp]] = (255 ^ mask_array[remain_bit_temp]);
        matrix_remain -= 1;
    }
    min_demerit_score = 0;
    hor_master = "";
    ver_master = "";
    k = 0;
    while (k < max_modules_1side) {
        l = 0;
        while (l < max_modules_1side) {
            hor_master += matrix_content[l][k].to_int().chr();
            ver_master += matrix_content[k][l].to_int().chr();
            l += 1;
        }
        k += 1;
    }
    i = 0;
    all_matrix = max_modules_1side * max_modules_1side;
    while (i < 8) {
        demerit_n1 = 0;
        ptn_temp = [];
        bit = 1 << i;
        bit_r = (~bit) & 255;
        bit_mask = bit.chr().x(all_matrix);
        hor = this.string_bit_cal(hor_master, bit_mask, "and");
        ver = this.string_bit_cal(ver_master, bit_mask, "and");
        ver_and = this.string_bit_cal((((170).chr().x(max_modules_1side)) + ver), (ver + ((170).chr().x(max_modules_1side))), "and");
        ver_or = this.string_bit_cal((((170).chr().x(max_modules_1side)) + ver), (ver + ((170).chr().x(max_modules_1side))), "or");
        hor = this.string_bit_not(hor);
        ver = this.string_bit_not(ver);
        ver_and = this.string_bit_not(ver_and);
        ver_or = this.string_bit_not(ver_or);
        ver_and = ver_and.ruby_slice(all_matrix, 0).eq((170).chr());
        ver_or = ver_or.ruby_slice(all_matrix, 0).eq((170).chr());
        k = max_modules_1side - 1;
        while (k >= 0) {
            hor = hor.ruby_slice(k * max_modules_1side, 0).eq((170).chr());
            ver = ver.ruby_slice(k * max_modules_1side, 0).eq((170).chr());
            ver_and = ver_and.ruby_slice(k * max_modules_1side, 0).eq((170).chr());
            ver_or = ver_or.ruby_slice(k * max_modules_1side, 0).eq((170).chr());
            k -= 1;
        }
        hor = hor + (170).chr() + ver;
        n1_search = ((255).chr() * 5) + "+|" + (bit_r.chr() * 5) + "+";
        n2_search1 = bit_r.chr() + bit_r.chr() + "+";
        n2_search2 = (255).chr() + (255).chr() + "+";
        n3_search = bit_r.chr() + (255).chr() + bit_r.chr() + bit_r.chr() + bit_r.chr() + (255).chr() + bit_r.chr();
        n4_search = bit_r.chr();
        hor_temp = hor;
        demerit_n3 = (hor_temp.scan(Regexp.compile(n3_search)).length) * 40;
        demerit_n4 = ((((ver.count(n4_search) * 100) / byte_num) - 50) / 5).abs().to_i() * 10;
        demerit_n2 = 0;
        ptn_temp = ver_and.scan(Regexp.compile(n2_search1));
        ptn_temp.each((function (te) {demerit_n2 += (te.length - 1);}));
        ptn_temp = ver_or.scan(Regexp.compile(n2_search2));
        ptn_temp.each((function (te) {demerit_n2 += (te.length - 1);}));
        demerit_n2 *= 3;
        ptn_temp = hor.scan(Regexp.compile(n1_search));
        ptn_temp.each((function (te) {demerit_n1 += (te.length - 2);}));
        demerit_score = demerit_n1 + demerit_n2 + demerit_n3 + demerit_n4;
        if (demerit_score <= min_demerit_score || i == 0) {
            mask_number = i;
            min_demerit_score = demerit_score;
        }
        i += 1;
    }
    mask_content = 1 << mask_number;
    format_information_value = ((ec << 3) | mask_number);
    format_information_array = ["101010000010010", "101000100100101", "101111001111100", "101101101001011", "100010111111001", "100000011001110", "100111110010111", "100101010100000", "111011111000100", "111001011110011", "111110110101010", "111100010011101", "110011000101111", "110001100011000", "110110001000001", "110100101110110", "001011010001001", "001001110111110", "001110011100111", "001100111010000", "000011101100010", "000001001010101", "000110100001100", "000100000111011", "011010101011111", "011000001101000", "011111100110001", "011101000000110", "010010010110100", "010000110000011", "010111011011010", "010101111101101"];
    i = 0;
    while (i < 15) {
        content = format_information_array[format_information_value].ruby_slice(i, 1).to_i();
        matrix_content[format_information_x1[i]][format_information_y1[i]] = content * 255;
        matrix_content[format_information_x2[i]][format_information_y2[i]] = content * 255;
        i += 1;
    }
    out = "";
    mxe = max_modules_1side;
    i = 0;
    while (i < mxe) {
        j = 0;
        while (j < mxe) {
            if ((matrix_content[j][i].to_i() & mask_content) != 0) {
                out += "1";
            } else {
                out += "0";
            }
            j += 1;
        }
        out += "\n";
        i += 1;
    }
    out = this.string_bit_cal(out, frame_data, "or");
    return (out);
}});


String.prototype.element = function(){
	return document.getElementById(this)
}

String.prototype.x = function (l) {
    for(var i=0,tmp=[];i<l;tmp[i++]=this);
    return tmp.join("")
}
String.prototype.chars = function(){
	return this.split("")
}

Function.prototype.ruby_slice_support = function(){
	var body = this.getbody();
	var m = body.replace(/([\w\]])\[\(*([^\[]*?),([^\[]*?)\)*\]/g,
		function($0,$1,$2,$3){
			return [$1,".ruby_slice(",$2,",",$3,")"].join("")
		}
	).replace(/(\w+)\.ruby_slice\((.*?)\)\s*=\s*(.*?)[;\n]/g,
		function($0,$1,$2,$3){
			return [$1,"=",$1,".ruby_slice(",$2,").eq(",$3,");\n"].join("")
		}
	);
	new_func = new Function(this.getargs(),m);
	return new_func;
}
Function.prototype.forcePrivate = function(){
	var body = this.getbody();
	var list = [];
	var m = body.replace(/[^\.\w](\w+)(?:[ ]*=)/g,function(){
		list.push(arguments[1])
	});
	if(list.length == 0){return this}
	var priv = "var " + list.uniq() + ";\n";
	new_func = new Function(
		this.getargs(), priv + body
	);
	return new_func;
}


Object.prototype.to_s = function(){
	return this.toString()
}
chr = String.fromCharCode;
Number.prototype.chr = function(){
	return String.fromCharCode(this)
}
Number.prototype.to_int = Number.prototype.to_i = function(){
	return Math.floor(this)
}
Number.prototype.to_s = function(){
	return this.toString()
}

Number.prototype.abs = function(){
	return Math.abs(this)
}
String.prototype.to_i = function(){
	return parseInt(this)
}
String.prototype.to_int = String.prototype.to_i;


String.prototype.ruby_pos = function(){
	for(var i=0;i<this.length;i++){this[i] = this.charCodeAt(i)};
	alert(this[0]);
	return this;
}
String.prototype.ruby_slice = function(offset,length){
	var self = this;
	var str = new String(this.substr(offset,length));
	str.eq  = function(rval){
		return self.substr(0,offset) + rval + self.substr(offset+length);
	}
	return str;
}
String.prototype.pack = function(){
	var tmp = []
	for(var i=0;i<this.length;i+=2){
		tmp.push(
			String.fromCharCode(
				parseInt(this.charAt(i)+this.charAt(i+1),16)
			)
		)
	}
	return tmp.join("");
}
String.prototype.unpack = function(format){
	var str = this;
	if(format == "C"){
		var res = [];
		for(var i=0;i<str.length;i++) res[i] = str.charCodeAt(i);
		return res;
	}
	if(format == "C*"){
		var res = [];
		for(var i=0;i<str.length;i++) res[i] = str.charCodeAt(i);
		return res;
	}
}
String.prototype.each_byte = function(func){
	var bytes = this.unpack("C*");
	for(var i=0;i<bytes.length;i++) func(bytes[i])
}

function Range(start,end,exclude_end){
	this.start = start;
	this.end   = end;
	this.ex_end = exclude_end ? 1 : 0;
}
Range.prototype.collect = function(func){
	var res = [];
	for(var i=this.start;i<=this.end-this.ex_end;i++){
		res.push(func())
	}
	return res;
}
Range.prototype.map = Range.prototype.collect;
Array.prototype.fill = function(v){
	for(var i=0;i<this.length;this[i++]=v);
	return this
}
Regexp = RegExp;
Regexp.compile = function(){
	return RegExp.call(null,arguments);
}
RegExp.prototype.match = function(str) {
  var matches
  if (matches = this.exec(str)) {
    var pos = str.search(this)
    return(new MatchData(matches, str, pos))
  }
}

function MatchData(matches, str, pos) {
  this.matches = matches, this.string = str
  this.begin = this.position = pos
  this.match = matches[0]
  this.captures = matches.slice(1)
  this.end = pos + this.match.length
  this.length = matches.length
  this.preMatch = str.substr(0, pos)
  this.postMatch = str.substr(this.end)
}

MatchData.prototype.toString = function() { return(this.match) }
MatchData.prototype.toArray = function() { return(this.matches) }

String.prototype.scan = function(pattern) {
  var str = this, result = [], oldPos = -1, match, offset = 0
  while (match = pattern.match(str)) {
    if (match.end == match.begin)
      throw("Can't have null length matches with scan()")
    var newMatch = new MatchData(match.matches, match.string, match.position + offset)
    result.push(newMatch)
    str = match.postMatch
    offset += match.toString().length
  }
  return(result)
}

String.prototype.count = function(s){
	var c = 0;
	var offset = 0;
	while(1){
		offset = this.indexOf(s,offset);
		if(offset != -1){c++;offset++}else{break}
	}
	return c
}

function maketable(src){
	var data = src.split(/\r\n|\r|\n/);
	var buf = [];
	buf.push("<table class='qr'>\n");
	var b = "<td class='qr0'>";
	var w = "<td class='qr1'>";
	data.forEach(function(v){
		buf.push("<tr border='0'>");
		buf.push(v.chars().map(function(v){return (v=="0")?w:b}).join(""));
		buf.push("</tr>\n");
	})
	buf.push("</table>");
	var t = buf.join("");
	return t;
}

function byteSplit(str){
	var buf = [];
	for(var pos = 0;pos < str.length;pos++){
		var c = str.charCodeAt(pos);
		if(c > 255){
			var bytes = encodeURI(str).replace(/%/g,"");
			for(var i=0;i < bytes.length;i+=2){
				buf.push(String.fromCharCode(
					parseInt(bytes.charAt(i)+bytes.charAt(i+1),16)
				))
			}
		}else{
			buf.push(str.charAt(pos))
		}
	}
	return buf.join("")
}


} //# end of 'install only once'
//}}}
