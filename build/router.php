<?php 

include ROOT.'/build/mangle.php';
include ROOT.'/build/export.php';

$uri = $_SERVER['REQUEST_URI'];

switch ($uri) {
    case '/assets/plunc.js?mangle=true':
        header('Content-type:text/javascript');
        $script = export();
        echo mangle($script);
        break;
    case '/assets/plunc.js?mangle=false':
        header('Content-type:text/javascript');
        $script = export();
        echo $script;
        break;
    default: 
        require ROOT.'/test/index.html';
        break;
}