<?php

date_default_timezone_set('Europe/Paris');


/**
 * Globals
 */
$_META_REFRESH = "";
$_STYLES = "";
$_BODY_CLASSES = "";
$_SCRIPT = "";
$_DOM_LI = "";

/**
 * INIT
 */
function init(){
  global $_DOM_LI, $_META_REFRESH, $_BODY_CLASSES;

  $m_path = "../assets/00-import/*.*";
  // $item_limits = rand(1, 45);
  $item_limits = rand(10,50); 
  $files = glob($m_path);
  shuffle($files);
  
  $files = array_slice(array_reverse($files),0,$item_limits);
  $_DOM_LI = setupDomList($files);
  
  $nb_f = count($files);
  setupLayout($nb_f);

  if(isset($_GET['refresh']) && is_numeric($_GET['refresh'])){
    $_META_REFRESH = '<META HTTP-EQUIV="Refresh" CONTENT="'.$_GET['refresh'].'">';
    $_BODY_CLASSES = "refresh";
  }
  // else{
  //   $_BODY_CLASSES = "no-refresh";
  // }
    
  printHTML();
}

/**
 * dom + layout
 */
function setupDomList($files){
  $list = "";
  foreach ($files as $id => $file) {
        
    $f = pathinfo($file);
    
    $datetime = DateTime::createFromFormat( 'Ymd_His', $f["filename"], new DateTimeZone('Europe/Paris'));
    $timestamp = $datetime->getTimestamp();
    $date = "48°54' :: ".date('H:i:s',$timestamp);
    

    $item_class = 'grid-item'; 
    switch (strtolower($f['extension'])) {
      case 'jpg':
        $cont = '<img src="'.$file.'" />';
        $item_class .= ' image';
        break;
      case 'md':
        $cont = '<p class="bigtext">'.cutwords2(file_get_contents($file)).'</p>';
        $item_class .= ' md';
        break;
    }

    $item = '<li class="'.$item_class.'" file="'.$file.'">'.$cont.'<sup>'.$date.'</sup></li>';
    $list .= $item;
  }

  return $list;
}

function setupLayout($nb_f){
  global $_SCRIPT, $_BODY_CLASSES; // $_META_REFRESH, $_STYLES, ,  

  $refresh = (isset($_GET['refresh']) && is_numeric($_GET['refresh'])) ? 1 : 0;
  $_SCRIPT = 'var settings = {nb_items:'.$nb_f.', refresh:'.$refresh.'}';
  
} 

/**
 * text
 */
function cutwords($text){
  
  $txts = explode(" ",$text);
  
  $lignes = 4;
  $w_ligne = round((count($txts)+1)/$lignes);
  
  foreach ($txts as $id => $t) {
    $s .= " ".$t;
    
    if($id % $w_ligne == $w_ligne-1) {
      $p .= '<span>'.$s.'</span>';
      $s ="";
    }
  }
  
  $p .= '<span>'.$s.'</span>';
  
  // echo "$text > $w_tot \n";
  
  return $p;
}

function cutwords2($text){
  
  $nb_chars = strlen($text);
  $nb_w = str_word_count($text);
  
  $nb_lines = 8;
  if($nb_w < 20 ) $nb_lines = 7;
  if($nb_w < 13 ) $nb_lines = 5;
  if($nb_w < 10 ) $nb_lines = 4;
  if($nb_w < 8 ) $nb_lines = 3;
  if($nb_w < 5 ) $nb_lines = 2;
  
  $charPerLine = ceil($nb_chars/$nb_lines);
  
  $text = wordwrap(insec($text), $charPerLine, "<!>");
  $lines = explode("<!>",$text);
  
  $p = "";  
  foreach ($lines as $id => $l) {
    $p .= "<span>$l</span>";
  }

  return $p;
}

function insec($t){
  $t = str_replace(" !", "&nbsp;!", $t);
  $t = str_replace(" ?", "&nbsp;?", $t);
  $t = str_replace(" ?", "&nbsp;?", $t);
  return $t;  
}


/**
 * print html
 */
function printHTML(){
  global $_META_REFRESH, $_STYLES, $_BODY_CLASSES, $_SCRIPT, $_DOM_LI;

  $html = '<html>
  <head>
    <meta charset="utf-8">';
  $html .= $_META_REFRESH;
  $html .= '<title>degré48</title>
      <link rel="stylesheet" href="css/screen.css">
      <style type="text/css" media="screen">'. $_STYLES.'</style>
    </head>
    <body class="' . $_BODY_CLASSES .'">
      <ul id="item-list">'. $_DOM_LI .'</ul>
      <script src="js/jquery-1.10.2.min.js"></script>
      <script src="js/BigText/bigtext.js"></script>
      <script src="js/script.js"></script>
      <script>'. $_SCRIPT .'</script>
    </body>
  </html>';


  print $html;
}

init();

?>
