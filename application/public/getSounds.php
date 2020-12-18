<?php

$files = glob(__DIR__ . "/sounds/*.{mp3,ogg}", GLOB_BRACE);

array_walk($files, function (&$item) {
  $parts = explode(DIRECTORY_SEPARATOR, $item);
  $filename = array_pop($parts);
  $fileparts = explode(".", $filename);
  $ext = array_pop($fileparts);
  if ($ext === "mp3" || $ext === "ogg") {

    $name = $fileparts[0];
    $name = explode("_", $name);
    $name = implode(" ", $name);
    $item = array("file" => $filename, "name" => $name);
  }
});

$result = ["status" => 200, "result" => $files];

http_response_code(200);
header("Access-Control-Allow-Origin: *");
header("Content-type: application/json");
echo json_encode($result);
exit;
