Development
===========

Build the docs
--------------

Server API Documentation
^^^^^^^^^^^^^^^^^^^^^^^^

The API documentation will be served statically on GitHub and hence needs to be checked into the repository for now. There is no github action yet.

* Install ``phpDocumentor`` globally: https://docs.phpdoc.org/3.0/guide/getting-started/installing.html and name it ``phpdoc``
* After running the generator, you'll perhaps need to remove the packages folder since it contains two default.html files in different casing which may harm your git workflow.

.. code-block:: bash

  rm -rf docs/server-api
  phpdoc --cache-folder=docs/build/server-api -d api-resources-server/src -t docs/server-api
  rm -rf docs/server-api/packages
  firefox docs/server-api/index.html &

Client API Documentation
^^^^^^^^^^^^^^^^^^^^^^^^

The API documentation will be served statically on GitHub and hence needs to be checked into the repository for now. There is no github action yet.

* Install ``typedoc`` globally.

.. code-block:: bash

  rm -rf docs/client-api
  typedoc --tsconfig api-resources-client/tsconfig.json api-resources-client/src --out docs/client-api
  firefox docs/client-api/index.html &

Sphinx documentation
^^^^^^^^^^^^^^^^^^^^

The Sphinx documentation will be built by Read the Docs automatically. To test the docs, you may run these commands:

.. code-block:: bash

  cd docs
  rm -rf build
  make html
  firefox build/html/index.html &
