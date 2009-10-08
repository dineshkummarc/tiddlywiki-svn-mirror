var oTable;
$(document).ready(function() {
	// set up records table
	var $table = $('#recordsTable');
	if($table.length!==0) {
		oTable = $table.dataTable({
			bAutoWidth: false,
			bPaginate: false,
			bSortClasses: false,
			bInfo: false,
			aoColumns: [
				null, // AVID
				null, // Legal Name
				{ bVisible: false }, // Previous Names(s)
				{ bVisible: false }, // Trades As Name(s)
				null, // Trading Status
				{ bVisible: false }, // Company Website
				{ bVisible: false }, // Operational PO Box
				{ bVisible: false }, // Operational Floor
				{ bVisible: false }, // Operational Buidling
				null, // Operational Street 1
				{ bVisible: false }, // Operational Street 2
				{ bVisible: false }, // Operational Street 3
				null, // Operational City
				null, // Operational State
				null, // Operational Country
				null, // Operational Postcode
				{ sClass: "center" },
				{ sClass: "center" }
			],
			sDom: 't'
		});
		$table.css('visibility',"visible")
		$.fn.dataTableExt.FixedHeader(oTable);
		var columns = oTable.fnSettings().aoColumns;
		var titles = [];
		for(var i=0;i<columns.length;i++) {
			titles.push(columns[i].sTitle);
		}
		function hideColumn(col) {
			if(columns[col].bVisible) {
				oTable.fnSetColumnVis(col, false);
			}
		}
		function showColumn(col) {
			if(!columns[col].bVisible) {
				oTable.fnSetColumnVis(col, true);
			}
		}
		$('#recordsTable tfoot th').click(function() {
			var i = $('#recordsTable tfoot th').index(this);
			var head = $('#recordsTable thead th')[i];
			var title = head.innerHTML;
			var pos = $.inArray(title, titles);
			hideColumn(pos);
			return false;
		});
		var $labels = $('#columnPicker span.label');
		var $controls = $('#columnPicker span.controls');
		var updateControlList = function() {
			$controls.each(function(i) {
				if(!columns[i].bVisible) {
					$(this).addClass("invisible");
				} else {
					$(this).removeClass("invisible");
				}
			});
		};
		$('#columnPicker .hideControl').click(function() {
			var i = $('#columnPicker .hideControl').index(this);
			var label = $labels[i].innerHTML;
			var pos = $.inArray(label, titles);
			hideColumn(pos);
			updateControlList();
			return false;
		});
		$('#columnPicker .showControl').click(function() {
			var i = $('#columnPicker .showControl').index(this);
			var label = $labels[i].innerHTML;
			var pos = $.inArray(label, titles);
			showColumn(pos);
			updateControlList();
			return false;
		});
		$('#columnPicker').hover(function() {
			updateControlList();
			$('#columnPicker .columns').show();
		}, function() {
			$('#columnPicker .columns').hide();
		});
	}
});