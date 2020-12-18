<?php

use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;
use Hss\Hss;
use Ratchet\WebSocket\WsServer;

require dirname(__DIR__) . '/vendor/autoload.php';

$server = IoServer::factory(
  new HttpServer(
    new WsServer(
      new Hss()
    )
  ),
  5050
);

$server->run();
