<?php 
function removeBrackets($str)
{
	return str_replace('<', '&lt;', str_replace('>', '&gt;', $str));
}

$file_content = file_get_contents('records.json');
$json = null;
$json = json_decode($file_content);	

if(isset($_POST['user']) && isset($_POST['msg']))
{
	$time = time();
	$new_record = ['user' => $_POST['user'], 'msg' => $_POST['msg'], 'time' => $time, 'date' => date('d-m-Y', $time)];
	$json[] = $new_record;
	$new_record['user'] = removeBrackets($new_record['user']);
	$new_record['msg'] = removeBrackets($new_record['msg']);
	$f = fopen('records.json', 'w');
	fwrite($f, json_encode($json));
	fclose($f);
	die(json_encode(['status' => 200, 'response' => $new_record]));
} else {
	die(json_encode(['status' => 200, 'response' => $json, 'post' => $_POST]));
}

?>