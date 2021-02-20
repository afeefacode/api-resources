#!/bin/sh

# install php dependencies

if [ ! -d "vendor" ]; then
  composer install --no-interaction
fi

# wait for db

while ! mysqladmin ping -h"mysql" --silent; do
    echo "waiting for database connection ..."
    sleep 1
done

echo "database is ready"

# migrate

ROWS=`mysql -hmysql -uroot -proot -N -e "SELECT COUNT(*) as count_tables FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'api'"`

if [ "$ROWS" -eq 0 ]; then
  echo "not migrated, migrate now ..."
  vendor/bin/phinx migrate
else
  echo "aready migrated"
fi

exec "$@"
