<?php

use Afeefa\Component\Package\Package\Package;
use Afeefa\Component\Package\ReleaseManager;
use Webmozart\PathUtil\Path;

return (new ReleaseManager())
    ->packages([
        Package::composer()
            ->path(Path::join(getcwd(), 'api-resources-server'))
            ->split(Path::join(getcwd(), '..', 'api-resources-server')),

        Package::npm()
            ->path(Path::join(getcwd(), 'api-resources-client'))
            ->split(Path::join(getcwd(), '..', 'api-resources-client'))
    ]);
