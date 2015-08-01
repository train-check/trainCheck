<?php

	// DEFINE ("DB_USER", "test");
	// DEFINE ("DB_PASSWORD", "test");
	// DEFINE ("DB_HOST", "localhost");
	// DEFINE ("DB_NAME", "traincheck");

	DEFINE ("DB_USER", "u852407754_toms");
	DEFINE ("DB_PASSWORD", "toms15");
	DEFINE ("DB_HOST", "mysql.hostinger.co.uk");
	DEFINE ("DB_NAME", "u852407754_foc15");

	$connection = @mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)
	OR die("Could not connect to MySQL: ".mysqli_connect_error());

	require "twilio/Services/Twilio.php";

	$accountsid = "AC641c7f622228431cb15b88cc8cf08bbb";
	$authtoken = "494998948a186af729944778e0b7d6cb";
	$client = new Services_Twilio($accountsid, $authtoken);
	$from = "+441684342088";

	$pData = $_POST;

	$number = $pData["number"];
	$code = $pData["code"];
	$uid = $pData["uid"];
	$time = $pData["time"];
	$delta = $pData["delta"];
	$percent = $pData["percent"];
	$station = $pData["station"];

	$sql = "INSERT INTO trainCheck (phone_number, station_code, train_uid, time)
	VALUES ('".$number."', '".$code."', '".$uid."', '".$time."')";

	$message1 = "Hi, you requested updates for the $time departure from $station.";
	$message2 = "The service is currently running with $percent of trains on time, and your train is due $delta minutes from now.";

	$sms1 = $client->account->sms_messages->create($from, $number, $message1);
	$sms2 = $client->account->sms_messages->create($from, $number, $message2);

	$connection->close();

	// if ($connection->query($sql) === TRUE) {

	//     // echo "New record created successfully";

	// } else {

	//     // echo "Error: " . $sql . "<br>" . $connection->error;

	// }

	// // echo json_encode($pData);

?>