<? include_once 'krumo/class.krumo.php'; ?>
<? include_once 'MyDB.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <!-- <meta http-equiv="refresh" content="1"> -->
  <title>D48</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
	<?
		$db = new MyDB();
		$query = "SELECT date, text
							FROM message
							WHERE is_from_me = 0
							ORDER BY date DESC
							LIMIT 9";
		$result = $db->query($query);
		while($res = $result->fetchArray(SQLITE3_ASSOC)) :
		?><article>
				<div class="in">
					<p><?= $res['text'] ?></p>
					<time datetime="<?= $res['date'] ?>"><?= date("H:i:s", $res['date']+ 978307200) ?></time>
				</div>
			</article><?
		endwhile;
  ?>

</body>
</html>