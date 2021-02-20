<?php

echo 'Backend ';

echo '<a href="/frontend">Frontend</a>';
echo ' <a href="/adminer">Adminer</a>';

$dbh = new PDO('mysql:host=mysql;dbname=api', 'root', 'root');

foreach ($dbh->query('show tables') as $row) {
    print_r($row);
}
