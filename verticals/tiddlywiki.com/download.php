<?php
        $source = "empty.html";
        header("Content-type: text/html;charset=UTF-8");
        header("Content-Disposition: attachment; filename=" . $source);
        $text = file_get_contents($source);
        header("Content-length: " . strlen($text));
        echo($text);
?>
