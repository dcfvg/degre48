<?php                   

date_default_timezone_set('Europe/Paris');
$m_path = "../../server/assets/00-import/";

$message = "la messagerie des manifestes";


if(isset($_POST['quote']) || $_POST['quote'] !="" ) {
  $m = $_POST['quote'];
  $stamp = date("Ymd_His");
  $stamp_human = date("H:i:s");
  $message = '<h5>'.$stamp_human." “".substr($m,0,20) ."…” à été publié !</h5>";
  
  file_put_contents($m_path.$stamp.".md",$m);
}



?>
<html>
  <head>
    <meta charset="utf-8">
    <title></title>
    <link rel="stylesheet" href="css/screen.css">
    <link rel="stylesheet" href="dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="dist/css/bootstrap-theme.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body class="d48">
    <div class="container">
      <div class="page-header">
        <h1>Degré 48</h1>
        <p class="lead"><?php echo $message?></p>
      </div>
    
    <form role="form" action="" method="post" accept-charset="utf-8">
      <div class="form-group">
          <label for="quote">Message ( <span id="charsLeft"></span> )</label>
          <textarea id="quote"class="form-control" maxlength="140" rows="10" cols="40" name="quote"></textarea>
      </div>
       <button type="submit" class="btn btn-danger btn-lg">Envoyer</button>
    </form>
 
    </div>
    <script src="js/jquery-2.0.3.min.js"></script>
    <script src="js/jquery.limit-1.2.js"></script>
    <script type="text/javascript">
        $('#quote').limit('140','#charsLeft');
    </script>
  </body>
</html>