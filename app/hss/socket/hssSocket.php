#!/php -q
<?php

$shortOpts  = "";
$shortOpts .= "p::"; // port

$longOpts = array(
    'port::'
);
$options = getopt($shortOpts, $longOpts);

// Run from command prompt > php -q quantifiedSocket.php
date_default_timezone_set('Europe/Amsterdam');
include 'websocket.class.php';

class HiddenSocket extends WebSocket {
	
	const TYPE_LISTENER = 1;
	const TYPE_SERVER = 2;
	const TYPE_VISUALIZATION = 3;

    private $_ids = 0;

	function process(&$user,$msg){
		$data = json_decode(trim($msg));
	    if(!$data) {
            error_log("Data is not an object, " . var_export($msg, true) . "\n", 3, __DIR__ . '/error.log');
        } else {
            switch ($data->action) {

                case 'registerServer':
                    $user->type = self::TYPE_SERVER;
                    $this->send($user->socket, json_encode((object)['msg' => "serverRegistered"]));
                    break;

                // Client / scale actions
                case 'registerClient':
                    // New user registered
                    $user->type = self::TYPE_LISTENER;
                    $this->send($user->socket, json_encode((object)['msg' => "clientRegistered", 'data' => ++$this->_ids]));
                    break;

                case 'playSound':
                    foreach ($this->users as $user) {
                        if ($user->type == self::TYPE_SERVER) {
                            $this->send($user->socket, json_encode((object)array('msg' => 'playSound', 'data' => $data->data, 'clientId' => $data->clientId)));
                        }
                    }
                    break;
                case 'disconnect':
                    $user->type = self::TYPE_LISTENER;
            }
        }
	}
}
$jsonFile = __DIR__ . '/../../settings.json';

if(!file_exists($jsonFile)) {
    die('Configuration file not found, create a settings.json in the app folder!');
}
$json = file_get_contents($jsonFile);
$json = json_decode($json);


if(array_key_exists('port', $options)) {
    $json -> port = $options['port'];
}

$master = new HiddenSocket($json -> host, $json -> port);