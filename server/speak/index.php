<?php                   
date_default_timezone_set('Europe/Paris');
$m_path = "../../server/assets/00-import/";
if(isset($_POST['quote']) and $_POST['quote'] !="" ) {
  $m = $_POST['quote'];
  $stamp = date("Ymd_His");
  $stamp_human = date("H:i:s");
  $message = '<h5>'.$stamp_human." “".substr($m,0,20) ."…” à été publié !</h5>";
  
  file_put_contents($m_path.$stamp.".md",$m);
}else {
  $message = "la messagerie des manifestes";
}
?>
<html>
  <head>
    <meta charset="utf-8">
    <title>Degré48</title>
    <link rel="stylesheet" href="css/screen.css">
    <link rel="stylesheet" href="dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="dist/css/bootstrap-theme.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="apple-mobile-web-app-capable" content="yes">
  </head>
  <body class="d48">
    <div class="container">
      <div class="page-header">
        <h1>Degré 48</h1>
        <p class="lead"><?php echo $message?></p>
      </div>
    <form role="form" id="mainForm" action="#mainForm" method="post" accept-charset="utf-8">
      <div class="form-group">
          <label for="quote">Message ( <span id="charsLeft"></span> )</label>
          <textarea id="quote"class="form-control" maxlength="140" rows="5"  name="quote"></textarea>
      </div>
       <button type="submit" class="btn btn-danger btn-lg">Envoyer</button>
    </form>
    </div>
    <script src="js/jquery-2.0.3.min.js"></script>
    <script src="js/jquery.limit-1.2.js"></script>
    <script type="text/javascript">
        $('#quote').limit('140','#charsLeft');
        $("#quote").focus();
        
        $("body").keypress(function(event) {
            if (event.which == 13) {
                event.preventDefault();
                $("#mainForm").submit();
            }
        });
    </script>
  </body>
</html>