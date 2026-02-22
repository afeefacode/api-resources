<?php

if (!file_exists('vendor/bin/_phpunit')) {
    rename('vendor/bin/phpunit', 'vendor/bin/_phpunit');
}
