<?php 
function removeBrackets($str)
{
	return str_replace('<', '&lt;', str_replace('>', '&gt;', $str));
}

function htmlGenerator($record)
{
	$user = null;
	$msg = null;
	$time = null;
	if(is_object($record))
	{
		$user = $record->user;
		$msg = $record->msg;
		$time = $record->time;
	}

	if(is_array($record))
	{
		$user = $record['user'];
		$msg = $record['msg'];
		$time = $record['time'];
	}

	$result = "<div class='record-item'><div><span class='record-user'>".removeBrackets($user)."</span><span class='record-msg'>".removeBrackets($msg)."</span></div><span class='record-time' server-time='$time'>".date('d-m-Y', $time)."</span></div>";
	return $result;
}

$str = file_get_contents('records.json');
$json = null;
$html = null;
try {
	$json = json_decode($str);
	if(!is_null($json)) {
		foreach ($json as $record) {
			$html[] = htmlGenerator($record);
		}
	}
} catch (Exception $e) {
	die(json_encode(['status' => 400, 'message' => 'Bad file']));
}

if(isset($_POST['user']) && isset($_POST['msg']))
{
	$new_record = ['user' => $_POST['user'], 'msg' => $_POST['msg'], 'time' => time()];
	$json[] = $new_record;
	$new_record['user'] = removeBrackets($new_record['user']);
	$new_record['msg'] = removeBrackets($new_record['msg']);
	$html = [];
	$html[] = htmlGenerator($new_record);
	$f = fopen('records.json', 'w');
	fwrite($f, json_encode($json));
	fclose($f);
	die(json_encode(['status' => 200, 'response' => $new_record, 'html' => $html]));
} else {
	die(json_encode(['status' => 200, 'response' => $json, 'html' => $html, 'post' => $_POST]));
}

?>