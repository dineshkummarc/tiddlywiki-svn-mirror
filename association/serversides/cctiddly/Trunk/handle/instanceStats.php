<?php

$cct_base = "../";
include_once($cct_base."includes/header.php");


// format : "19-02-2006" or any other format strtotime can handle.
function getMaxDate($dates){
	foreach($dates as $date){
	if(gmdate("Y-m-d", strtotime($temp)) < gmdate("Y-m-d", strtotime($date)))
			 $temp = $date;
	}
	return $temp;
}


function aGetDays($sStartDate, $sEndDate, $interval, $format){
  echo	$sStartDate = gmdate($format, strtotime($sStartDate));
echo "<br />";
echo	$sEndDate = gmdate($format, strtotime($sEndDate));

	$aDays[] = $sStartDate;
	$sCurrentDate = $sStartDate;
	echo "c : ".strtotime($sCurrentDate)." <br />e : ".strtotime($sEndDate).".<br />";
  	while(strtotime($sCurrentDate) < strtotime($sEndDate)){
echo "<h2>$sEndDate</h2>";	
    	echo $sCurrentDate = gmdate($format, mktime()+$interval);
		$aDays[] = $sCurrentDate;
  	}
	return $aDays;
}





function GetDays($sStartDate, $sEndDate, $interval, $format){
  echo	$sStartDate = gmdate($format, strtotime($sStartDate));
echo "<br />";
echo	$sEndDate = gmdate($format, strtotime($sEndDate));

	$aDays[] = $sStartDate;
	$sCurrentDate = $sStartDate;
  	while(strtotime($sCurrentDate) < strtotime($sEndDate)){

    	echo $sCurrentDate = gmdate($format, mktime()+$interval);
		$aDays[] = $sCurrentDate;
  	}
	return $aDays;
}

//$a =  gaps(strtotime("2008-09-01 9:00"), strtotime("2008-09-01 12:00"), 3600);
//foreach ($a as $v)
//echo date("Y-m-d H:00", $v)."<br />";
//exit;
//getDays("2008-09-01 12:00", "2008-09-01 09:00", 3600, "Y-m-d H:00");
//exit;





function gaps($start, $interval){
	$gaps[] = $start;
	$temp=$start;
	while($temp < mktime()){
		$temp = $temp + $interval;
		$gaps[] = $temp;
  	}
	return $gaps;
}


function handleSQL($SQL, $format, $goBack, $interval){
	$results = mysql_query($SQL);
	$count = 0;
	while($result=mysql_fetch_assoc($results)){
			$dates[] .= $result['Date'];
			$hits[$result['Date']] = $result['numRows'];
	}
	$a = gaps(mktime()-$goBack, $interval);
	foreach ($a as $time){
		if(!in_array(date($format, $time), $dates)){
			$hits[date($format, $time)] = 0;
 			$dates[] = date($format, $time);
		}
	}
	sort($dates);
	
	foreach($dates as $date){
		if($date!="")
			$str .= "{ date:'".$date."', hits:".$hits[$date]." },";	
	}
	return substr($str,0,strlen($str)-1);	
}




if ($_REQUEST['graph']=="hour"){
	$SQL = "SELECT DATE_FORMAT(time, '%d-%k') AS Date,  COUNT(*) AS numRows FROM workspace_view  where time >SUBDATE(now() , INTERVAL 24 HOUR) AND workspace='".$w."' GROUP BY Date order by time limit 24";
	echo handleSQL($SQL, "d-H", 86400, 3600);
	// 3600 second in an hour.
	// 86400 second in a day.
	
}

exit;

if ($_REQUEST['graph']=="minute")
	echo handleSQL("SELECT DATE_FORMAT(time, '%k:%i') AS Date,  COUNT(*) AS numRows FROM workspace_view  where time >SUBDATE(now() , INTERVAL 20 MINUTE) AND workspace='".$w."' GROUP BY Date order by time asc limit 20", "Y-m-d");



if ($_REQUEST['graph']=="day"){
	$SQL = "SELECT DATE_FORMAT(time, '%Y-%m-%d') AS Date,  COUNT(*) AS numRows FROM workspace_view  where time >CURRENT_DATE() - INTERVAL 7 DAY GROUP BY Date order by time limit 15";
	echo handleSQL($SQL, "Y-m-d", "-5 day", "+2 day");
}
if ($_REQUEST['graph']=="month")
	echo handleSQL("SELECT DATE_FORMAT(time, '%m/%y') AS Date,  COUNT(*) AS numRows FROM workspace_view  where time >CURRENT_DATE() - INTERVAL 12 MONTH AND workspace='".$w."'  GROUP BY Date order by time limit 200", "Y-m-d");

if ($_REQUEST['graph']=="year")
	echo handleSQL("SELECT DATE_FORMAT(time, '%Y') AS Date,  COUNT(*) AS numRows FROM workspace_view  where time >CURRENT_DATE() - INTERVAL 5 YEAR AND workspace='".$w."' GROUP BY Date order by time limit 5");










exit;


















if(!user_session_validate())
{
	sendHeader("403");
}


$w=$_REQUEST['workspace'];

if (!user_isAdmin(user_getUsername(), $w))
{
	sendHeader("401");
	exit;
}























function chart_data($values) {
	$maxValue = max($values);
	$simpleEncoding = 
'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	$chartData = "s:";
  	for ($i = 0; $i < count($values); $i++) {
    	$currentValue = $values[$i];
    	if ($currentValue > -1) {
    			$chartData.=substr($simpleEncoding,61*($currentValue/$maxValue),1);
    	}
      	else {
      		$chartData.='_';
      	}
  	}
	return $chartData."&chxt=y&chxl=0:|0|".$maxValue;
}



function displayGraphData($chartTitle, $values, $xLabels, $yValues)
{	
	echo "[ {'thumb':'http://chart.apis.google.com/chart?cht=lc&chs=100x75&chd=".chart_data($values)."&chxt=x,y&chxl=0:||1:|', 'full':
	'http://chart.apis.google.com/chart?chtt=".urlencode($chartTitle)."&cht=lc&chs=800x375&chd=".chart_data($values)."&chxt=x,y&chxl=0:1:|".$yValues."&chf=c,lg,90,EEEEEE,0.5,ffffff,20|bg,s,FFFFFF&&chg=10.0,10.0&', 'a':'aaa' } ]";

	// echo "http://chart.apis.google.com/chart?chtt=".urlencode($chartTitle)."&cht=lc&chs=800x375&chd=".chart_data($values)."&chxt=x,y&chxl=0:1:|".$yValues."&chf=c,lg,90,EEEEEE,0.5,ffffff,20|bg,s,FFFFFF&&chg=10.0,10.0&";
	//echo "http://chart.apis.google.com/chart?chtt=".urlencode($chartTitle)."&cht=lc&chs=800x375&chd=".chart_data($values)."&chxt=x,y&chxl=0:|". $yLabels."1:|".$xValues."&chf=c,lg,90,EEEEEE,0.5,ffffff,20|bg,s,FFFFFF&&chg=10.0,10.0&";	
}


function displayGraph($SQL, $title)
{	$results = mysql_query($SQL);
	$count = 0;
	while($result=mysql_fetch_assoc($results)){
		$labelValues[$count]=$result['numRows'];	
		$values[$count++] .=$result['numRows'];
		$labels .= $result['Date']."|";
	}
	$labelValues = array_unique($labelValues);
	sort($labelValues);
	foreach($labelValues as $label)
		$lv .=$label.'|';
	$lv = substr($lv,0,strlen($lv)-1);
	$r2 = round(max($values), -2)/2;
	displayGraphData($_REQUEST['desc'], $values, "$label", $lv);
}







if ($_REQUEST['graph']=="minute"){
	$SQL ="SELECT DATE_FORMAT(time, '%d/%m/%Y-%k:%i') AS Date,  COUNT(*) AS numRows FROM workspace_view  where time >CURRENT_DATE() - INTERVAL 1 day AND workspace='".$_REQUEST['workspace']."' GROUP BY Date order by time";
displayGraph($SQL, "Views of workspace ".$_REQUEST['workspace']." over the past day by minutes");
}
if ($_REQUEST['graph']=="hour"){
	$SQL ="SELECT DATE_FORMAT(time, '%d/%m/%Y-%k') AS Date,  COUNT(*) AS numRows FROM workspace_view  where time >CURRENT_DATE() - INTERVAL 1 day AND workspace='".$_REQUEST['workspace']."' GROUP BY Date order by time";
displayGraph($SQL, "Views of workspace ".$_REQUEST['workspace']." over the past day by hour");
}
if ($_REQUEST['graph']=="day"){
	$SQL ="SELECT DATE_FORMAT(time, '%m/%Y') AS Date,  COUNT(*) AS numRows FROM workspace_view  where time >CURRENT_DATE() - INTERVAL 7 DAY GROUP BY Date order by time";
	displayGraph($SQL, "Instance views by month over the past seven Days.");
}
if ($_REQUEST['graph']=="month"){
	$SQL ="SELECT DATE_FORMAT(time, '%d/%m/%y') AS Date,  COUNT(*) AS numRows FROM workspace_view  where time >CURRENT_DATE() - INTERVAL 12 MONTH AND workspace='".$_REQUEST['workspace']."'  GROUP BY Date order by time";
	displayGraph($SQL, "Instance views by month over the past year.");
}
if ($_REQUEST['graph']=="year"){
	$SQL ="SELECT DATE_FORMAT(time, '%Y') AS Date,  COUNT(*) AS numRows FROM workspace_view  where time >CURRENT_DATE() - INTERVAL 5 YEAR AND workspace='".$_REQUEST['workspace']."' GROUP BY Date order by time";
displayGraph($SQL, "Views of workspace ".$_REQUEST['workspace']." over the past 5 years.");
}
?>