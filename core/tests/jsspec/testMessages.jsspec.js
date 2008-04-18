// <![CDATA[
describe('displayMessage', {
	before_each: function() {
		createTiddlyElement(document.body,"div","messageArea");
	},

	'should fail if the messageArea element does not exist': function() {
		var actual = displayMessage('test value');
		var expected = undefined;
		value_of(actual).should_be(expected);
	}
});
// ]]>
