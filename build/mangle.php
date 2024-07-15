<?php 

/**
 * Mangling, in the context of this build process, refers to the process of 
 * shortening or obfuscating class, property, and method names. Mangling 
 * properties comes with certain assumptions, which is why it's considered 
 * very unsafe in JS minifications, as stated in the Terser documentation.
 * 
 * This mangle function operates within a rule where it converts only class, 
 * property, and method names that start with a double underscore (__) to 
 * shortened names.
 */
function mangle(string $source_code): string {

    $tokens = [];

    /** Is it something that resembles a convertible token? */
    function tokenish(string $str){
        if ($str!=='_'&&(strlen($str)<2)) return false;
        if ($str!=='__'&&(strlen($str)===2)) return false;
        return true;
    }

    /** Removes last character in a string */
    function rmvlast(string $str) {
        return substr($str, 0, -1);
    }

    /** Rmoves all character in a string */
    function clear(string &$str){
        $str = '';
    }

    /** Takes all the convertible tokens from the source code */
    foreach (\explode("\n",$source_code) as $line) {
        $eots = [' ','{','(','[',',',']',')','}','.',':'];
        $token = '';
        foreach (\str_split($line) as $char) {
            $token .= $char;
            if (!tokenish($token)) {
                clear($token);
                continue;
            }
            if (\in_array($char, $eots)) {
                \array_push(
                    $tokens,
                    rmvlast($token)
                );
                clear($token);
            }
        }
    }
    
    /** Takes only the unique token in the array */
    $unique_tokens = \array_unique($tokens);
    
    /** Sorts the array from shortest length to longest */
    usort($unique_tokens, function ($a, $b) {
        return strlen($b) - strlen($a);
    });

    $i = 1;
    foreach ($unique_tokens as $unique_token) {
        $source_code = str_replace(
            $unique_token,
            ['','x','a','e'][rand(1,3)].$i,
            $source_code
        );
        $i++;
    }

    return $source_code;

}