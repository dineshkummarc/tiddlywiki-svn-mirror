<?php
$p = new Plugin('Static Plugin','0.1','simonmcmanus.com');
$p->addEvent("returnNotFound", 'static/files/static_check.php');
$p->addEvent("afterIncludes", 'static/files/static_check.php');
?>