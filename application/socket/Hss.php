<?php
namespace Hss;

use Ratchet\ConnectionInterface;
use Ratchet\MessageComponentInterface;

class Hss implements MessageComponentInterface
{
  protected $clients;

  protected $listeners;
  protected $servers;

  public function __construct() {
    $this->clients = new \SplObjectStorage;
  }

  public function onOpen(ConnectionInterface $conn) {
    // Store the new connection to send messages to later
    $this->clients->attach($conn);

    echo "New connection! ({$conn->resourceId})\n";
  }

  public function onMessage(ConnectionInterface $from, $msg) {
    $numRecv = count($this->clients) - 1;
    echo sprintf('Connection %d sending message "%s" to %d other connection%s' . "\n"
      , $from->resourceId, $msg, $numRecv, $numRecv == 1 ? '' : 's');

    $data = json_decode(trim($msg));


/* case 'registerClient':
                    // New user registered
                    $user->type = self::TYPE_LISTENER;
                    $this->send($user->socket, json_encode((object)['msg' => "clientRegistered", 'data' => ++$this->_ids]));
                    break;*/
    $data->sender = $from->resourceId;
    foreach ($this->clients as $client) {
      $client->send(json_encode($data));
    }
  }

  public function onClose(ConnectionInterface $conn) {
    // The connection is closed, remove it, as we can no longer send it messages
    $this->clients->detach($conn);

    echo "Connection {$conn->resourceId} has disconnected\n";
  }

  public function onError(ConnectionInterface $conn, \Exception $e) {
    echo "An error has occurred: {$e->getMessage()}\n";

    $conn->close();
  }
}
