<?php

use Afeefa\Component\Package\Package\Package;
use Webmozart\PathUtil\Path;

return [
    Package::composer()
        ->path(Path::join(getcwd(), 'api-resources-server'))
        ->split(Path::join(getcwd(), '..', 'api-resources-server')),

    Package::npm()
        ->path(Path::join(getcwd(), 'api-resources-client'))
        ->split(Path::join(getcwd(), '..', 'api-resources-client'))
];
