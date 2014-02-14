<?php 

  $rep = array("hello");

  $rep['get'] = $_GET;

  $unlinkeds = [];
  foreach ($_GET['items'] as $value) {
    $filename = basename($value);
    
    $c = copy($value, '../assets/02-archives/'.$filename);
    if($c){
      $u = unlink($value);
      if($u)
        $unlinkeds[] = $value;  
    }
  }

  $rep['unlinkeds'] = $unlinkeds;

  header('Content-Type: application/json');
  echo json_encode($rep);

?>