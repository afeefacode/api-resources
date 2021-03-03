Relations
=========

There are two types of relations we deal in `api-resources` (has, link). Each of them can appear in one of two multiplicities (one, many). These relations describe how related objects are stored and retrieved by api clients. There are no assumptions on how the relations are implemented in the underlaying database schema.

.. list-table:: Relation types
   :widths: auto
   :header-rows: 1

   * - Relation

     - Meaning

     - Constraints

   * - A hasOne B

     - a **owns** the related b

     - -- a can have zero or one b

       -- b can have zero or one owner

       -- owner of a B may be any a, b, c

   * - A hasMany B

     - a **owns** all related bs

     - -- a can have zero, one or many bs

       -- b can have zero or one owner

       -- owner of a B may be any a, b, c

   * - A linkOne B

     - a **uses** the related b

       c might use b as well

     - -- a can use zero or one b

       -- b can have multiple users

       -- user of a B may be any a, b, c

   * - A linkMany B

     - a **uses** all related bs

       c might use any of the bs as well

     - -- a can use zero, one or many bs

       -- b can have multiple users

       -- user of a B may be any a, b, c


hasOne
######

Retrival
++++++++

.. container:: flex

    .. container::

        Request

        .. code-block:: json

            {
              "type": "A",
              "id": "1",
              "fields": [
                "title",
                "b": {
                  "title"
                }
              ]
            }


    .. container::

        Response

        .. code-block:: json

            {
              "_type": "A",
              "id": "1",
              "title": "title-a",
              "b": {
                "_type": "B",
                "id": "1",
                "title": "title-b"
              }
            }

    .. container::

        Response (empty)

        .. code-block:: json

            {
              "_type": "A",
              "id": "1",
              "title": "title-a",
              "b": null
            }


Storage
+++++++

.. container:: flex

    .. container::

        Create

        .. code-tabs::

            .. code-tab:: json
                :title: Request

                {
                  "type": "A",
                  "id": "1",
                  "data": {
                    "title": "title-a",
                    "b": {
                      "title": "title-b"
                    }
                  }
                  "fields": [
                    "title",
                    "b": {
                      "title"
                    }
                  ]
                }

            .. code-tab:: json
                :title: Response

                {
                  "_type": "A",
                  "id": "1",
                  "title": "title-a",
                  "b": {
                    "_type": "B",
                    "id": "1",
                    "title": "title-b"
                  }
                }

    .. container::

        Update

        .. code-tabs::

            .. code-tab:: json
                :title: Request

                {
                  "type": "A",
                  "id": "1",
                  "data": {
                    "title": "title-a",
                    "b": {
                      "id": 1,
                      "title": "title-b"
                    }
                  }
                  "fields": [
                    "title",
                    "b": {
                      "title"
                    }
                  ]
                }

            .. code-tab:: json
                :title: Response

                {
                  "_type": "A",
                  "id": "1",
                  "title": "title-a",
                  "b": {
                    "_type": "B",
                    "id": "1",
                    "title": "title-b"
                  }
                }

    .. container::

        Delete

        .. code-tabs::

            .. code-tab:: json
                :title: Request

                {
                  "type": "A",
                  "id": "1",
                  "data": {
                    "title": "title-a",
                    "b": null
                  }
                  "fields": [
                    "title",
                    "b": {
                      "title"
                    }
                  ]
                }

            .. code-tab:: json
                :title: Response

                {
                  "_type": "A",
                  "id": "1",
                  "title": "title-a",
                  "b": null
                }


Implementation
++++++++++++++

hasMany
#######

linkOne
#######

linkMany
########
