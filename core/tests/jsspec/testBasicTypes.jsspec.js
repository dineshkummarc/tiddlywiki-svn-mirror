// <![CDATA[

describe('BasicTypes : Number.clamp()', {

	before_each: function(){
		max = 10;
		min = 5;
	},

	'given a number below the minium value, Number.clamp() brings the number into the range' : function() {
		var n = 2;
		n = n.clamp(min,max);
		value_of(n).should_be(min);
	},

	'given a number above the maximum value, Number.clamp() brings the number into the range' : function() {
		var n = 20;
		n = n.clamp(min,max);
		value_of(n).should_be(max);
	},

	'given a number within the perscribed range, Number.clamp() returns the original value' : function() {
		var n = 7;
		n = n.clamp(min,max);
		value_of(n).should_be(7);
	}

});

describe('BasicTypes : Array.indexOf()', {

	before_each: function(){
		test_arr = ['item1', 'item2','item3'];
	},

	'an array object should have an indexOf method.' : function() {
		var t = typeof test_arr.indexOf;
		value_of(t).should_be('function');
	},

	'given the value of the element at position 0, indexOf should return 0' : function() {
		value_of(test_arr.indexOf('item1')).should_be(0);
	},

	'given a value not present in an array, indexOf should return -1' : function() {
		value_of(test_arr.indexOf('noitem')).should_be(-1);
	},

	'indexOf should retuen the index of an element in a restricted range in an array' : function() {
		value_of(test_arr.indexOf('item3',1)).should_be(2);
	},

	'indexOf should return -1 when searching for an element outside a restricted range in an array' : function() {
		value_of(test_arr.indexOf('item1',1)).should_be(-1);
	}

});


describe('BasicTypes : Array.contains()', {

	before_each: function(){
		test_arr = ['item1', 'item2','item3'];		
	},
	
	'given an item which exist in the array, contains() will return true' : function() {
		var res = test_arr.contains('item1');
		value_of(res).should_be_true();
	},

	'given an item which does not exist in the array, contains() will return false' : function() {
		var res = test_arr.contains('dud');
		value_of(res).should_be_false();
	}

});


describe('BasicTypes : Array.setItem()', {

	before_each: function(){
		test_arr = ['item1', 'item2','item3'];
	},

	'given a string and a mode value of +1, setItem() will add the string to an array. ' : function() {
		test_arr.setItem('item4',+1);
		value_of(test_arr.length).should_be(4);
	},
	
	'given a string which is present in the array and a mode value of -1, setItem() will remove the string from an array. ' : function() {
		test_arr.setItem('item3',-1);
		value_of(test_arr.length).should_be(2);
	},
	
	'given a string which is not present in the array  and a mode value of -1, setItem() will not modify the array. ' : function() {
		test_arr.setItem('item4',-1);
		value_of(test_arr.length).should_be(3);
	},
	
	'given a string which is present in the array and a mode value of 0, setItem() will remove the string from the array. ' : function() {
		test_arr.setItem('item2', 0);
		value_of(test_arr.length).should_be(2);
	},
	
	'given a string which is not present in the array and a mode value of 0, setItem() will add the string to the array. ' : function() {
		test_arr.setItem('item4', 0);
		value_of(test_arr.length).should_be(4);
	}

});

describe('BasicTypes : Array.containsAny()', {

	before_each: function(){
		test_strings_arr = ['item1', 'item2','item3'];
	},

	'given a test array containing on string which is present in the array, containsAny() returns true.' : function() {
		var result = test_strings_arr.containsAny(['item1']);
		value_of(result).should_be_true();
	},
	
	'given a test array containing 2 strings which are present in the array, containsAny() returns true.' : function() {
		var result = test_strings_arr.containsAny(['item1','item3']);
		value_of(result).should_be_true();
	},
	
	'given a test array containing a string which is not present in the array, containsAny() returns false.' : function() {
		var result = test_strings_arr.containsAny(['item4']);
		value_of(result).should_be_false();
	},
	
	'given a test array containing one string which is present and one which is not present in the array, containsAny() returns true.' : function() {
		var result = test_strings_arr.containsAny(['item1','item4']);
		value_of(result).should_be_true();
	}
	
});

describe('BasicTypes : Array.containsAll()', {

	before_each: function(){
		test_strings_arr = ['item1','item2','item3'];
	},

	'given a list of string items, none of which are present in the target array, containsAll() returns false.' : function() {
		var query_arr = ['itemA','itemB'];
		var result = test_strings_arr.containsAll(query_arr);
		value_of(result).should_be_false();
	},

	'given a list of string items, some of which are present in the target array, containsAll() returns false.' : function() {
		var query_arr = ['item1','itemB'];
		var result = test_strings_arr.containsAll(query_arr);
		value_of(result).should_be_false();
	},
		
	'given a list of string items, all of which are present in the target array, containsAll() returns true.' : function() {
		var query_arr = ['item1','item2'];
		var result = test_strings_arr.containsAll(query_arr);
		value_of(result).should_be_true();
	}

});

describe('BasicTypes : Array.pushUnique()', {

	before_each: function(){
		test_strings_arr = ['item1','item2','item3'];
	},
	
	'given a string value which is not present in the target array, pushUnique() adds the value to the array' : function() {
		var originalLength = test_strings_arr.length;
		test_strings_arr.pushUnique('item4');
		var modifiedLength = test_strings_arr.length;
		value_of(modifiedLength).should_be(originalLength+1);
	},
	
	'given a string value which is already present in the target array, pushUnique() does not change the target array.' : function() {
		var originalLength = test_strings_arr.length;
		test_strings_arr.pushUnique('item2');
		var modifiedLength = test_strings_arr.length;
		value_of(modifiedLength).should_be(originalLength);
	},
	
	'given a string value which is already present in the target array and a value of false in the unique parameter, pushUnique() add the item to the target array.' : function() {
		var originalLength = test_strings_arr.length;
		test_strings_arr.pushUnique('item2',false);
		var modifiedLength = test_strings_arr.length;
		value_of(modifiedLength).should_be(originalLength + 1);
	}
	
});

describe('BasicTypes : Array.remove()', {
	
	before_each: function(){
		test_strings_arr = ['item1', 'item2', 'item3'];
	},
	
	'given a string which is present as an item in the array, Array.remove() will remove the item from the array.' : function() {
		test_strings_arr.remove('item1');
		var ispresent = test_strings_arr.indexOf('item1');
		value_of(ispresent).should_be(-1);
	},

	'given a string which is not present as an item in the array, Array.remove() takes no action and throws no errors.' : function() {
		test_strings_arr.remove('itemA');
		value_of(test_strings_arr.length).should_be(3);
	}
	
});


// ]]>

