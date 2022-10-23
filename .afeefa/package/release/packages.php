<?php

use Afeefa\Component\Package\Package\Package;
use Symfony\Component\Filesystem\Path;

return [
    Package::composer()
        ->path(Path::join(getcwd(), 'api-resources-server'))
        ->split('git@github.com:afeefacode/api-resources-server.git'),

    Package::npm()
        ->path(Path::join(getcwd(), 'api-resources-client'))
        ->split('git@github.com:afeefacode/api-resources-client.git')
];
