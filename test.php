<?php 

/**
*
* This server will be used to host the test/index.html and load
* the necessary assets to facilate end-to-end testing.
* 
* To start the test server: 
* php -S 127.0.0.1:5800 test.php 
*
**/

define('ROOT',__DIR__);
require ROOT.'/build/router.php';