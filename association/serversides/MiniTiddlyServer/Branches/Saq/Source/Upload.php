<?php
    session_start(); 
    
    include_once("Functions.php");
    
    $basedir = "../";
    
    $file = $_FILES['uploadfile'];
    $localfilename =  basename( $file['name']); 
    $tmpfilename = $file['tmp_name'];  
    $remotefilename = $_POST['sourcepath'];
    $wrapperpath = $_POST['wrapperpath'];
    
    /*
    // SECURITY // 
        // 1 // Check for .html extension in remotefilename  yay!
        // 2 // Check for "../" in remote file name... no parental folders allowed! yay!
        // 3 // Verify the data sent? yay!
        // 4 // 
    */
    
    if ( $file['type'] != "text/html" || strpos($localfilename, ".htm") === false ) {
        err("Error: source wasn't an html file :: ".$file['type']." :: $localfilename");
        exit;
    }
    
    if (!( strpos($remotefilename, "../") === false )) {
        err("Error: source specified a parent folder");
        exit;
    }
    
    if ( strpos($remotefilename, ".htm") === false ) {
        err("Error: remote file specified was not an html file");
        exit;
    }
    
    $subject = readFileToString ( $tmpfilename );
    if (! preg_match('/\\A(.*<div id="storeArea">\\n?)(.*)(\\n?<\\/div>\\n?<!--POST-BODY-START-->.*)$/sm', $subject, $regs)) {
        err("Error: remote file specified was not a valid TiddlyWiki file");
        exit;
    }
    
    $remotefilename = $basedir.$remotefilename;
    
    if (!copy($tmpfilename, $remotefilename)) {
        err( "There was an error uploading the file, please try again!");
    }
    else
    {
        echo "<script>window.location = '$basedir$wrapperpath'</script>";
    
    }
    
    function err($msg) {
        echo $msg;
        echo "<pre>";
        print_r($_FILES);
        echo "</pre>";
    }
    
    
    
?>
