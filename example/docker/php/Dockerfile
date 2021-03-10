FROM php:7.4-fpm

# packages

RUN apt-get update; \
  apt-get install -y \
  zip unzip libzip-dev \
  mariadb-client

# locales

RUN DEBIAN_FRONTEND=noninteractive apt-get install -y locales; \
  echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen; \
  echo "de_DE.UTF-8 UTF-8" >> /etc/locale.gen; \
  dpkg-reconfigure --frontend=noninteractive locales

# php modules

RUN docker-php-ext-install \
  pdo_mysql zip; \
  pecl install xdebug; \
  docker-php-ext-enable xdebug

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/bin --filename=composer

ENV XDEBUGINI_PATH="/usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini"
COPY xdebug.ini $XDEBUGINI_PATH
RUN echo "xdebug.client_host = host.docker.internal" >> $XDEBUGINI_PATH

# bash aliases

COPY .aliasesrc /root/.aliasesrc
RUN echo "\nsource /root/.aliasesrc" >> /root/.bashrc;

# entrypoint

COPY ./entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh", "php-fpm"]
