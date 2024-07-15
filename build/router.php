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
    case '/assets/index.css':
        header('Content-type:text/css');
        echo file_get_contents(ROOT.'/test/index.css');
        break;
    case '/assets/index.js':
        header('Content-type:text/javascript');
        $script = file_get_contents(ROOT.'/export/test/index.js');
        echo clear_ex_im_stmt($script);
        break;
    case '/assets/app.js':
        header('Content-type:text/javascript');
        $script = file_get_contents(ROOT.'/export/test/app.js');
        echo clear_ex_im_stmt($script);
        break;
    default: 
        require ROOT.'/test/index.html';
        break;
}