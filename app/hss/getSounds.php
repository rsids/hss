<?php
/**
 * Created by PhpStorm.
 * User: ids
 * Date: 6/6/15
 * Time: 1:29 PM
 */

$files = glob(__DIR__ . '/sounds/*.{mp3,ogg}', GLOB_BRACE);

array_walk($files, function(&$item) {

    $item = str_replace(__DIR__, '', $item);

    $afile = explode('.', $item);
    $ext = array_pop($afile);
    if($ext === 'mp3' || $ext === 'ogg') {
        $name = explode(DIRECTORY_SEPARATOR, $afile[0]);
        $name = array_pop($name);
        $name = explode('_', $name);
        $name = implode(' ', $name);

        $item = array($afile[0] . '.' . $ext, $name);
    }

});

$result = ['status' => 200, 'result' => $files];

http_response_code(200);
header('Content-type: application/json');
echo json_encode($result);
exit;