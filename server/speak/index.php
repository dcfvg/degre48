<?php                   

date_default_timezone_set('Europe/Paris');
$m_path = "../../server/assets/00-import/";

if(isset($_POST['quote']) || $_POST['quote'] !="" ) {
  $m = $_POST['quote'];
  $stamp = date("Ymd_His");
  $stamp_human = date("H:i:s");
  $message = '<h5>'.$stamp_human."</br>“".substr($m,0,20) ."…” publié !</h5>";
  
  file_put_contents($m_path.$stamp.".md",$m);
}



?>
<html>
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <h1>Speak !</h1>
    <form action="" method="post" accept-charset="utf-8">
      <p><textarea  maxlength="140" rows="10" cols="40" name="quote"></textarea></p>
      <p><input type="submit" value="submit"></p>
    </form>
    <?php echo $message?>

  </body>
</html>