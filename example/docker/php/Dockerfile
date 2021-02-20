FROM php:7.4-fpm

RUN apt update; \
  apt install -y \
  zip unzip libzip-dev \
  mariadb-client

RUN docker-php-ext-install \
  pdo_mysql zip

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/bin --filename=composer

COPY ./entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh", "php-fpm"]
