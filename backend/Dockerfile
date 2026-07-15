FROM php:8.5-cli

RUN apt-get update && apt-get install -y \
    git unzip libzip-dev libpng-dev libjpeg-dev libfreetype6-dev ca-certificates \
    && docker-php-ext-configure gd --with-jpeg --with-freetype \
    && docker-php-ext-install pdo_mysql zip gd \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY . .

RUN composer install --no-dev --optimize-autoloader --no-interaction

EXPOSE 8080
CMD php artisan storage:link --force; \
    php artisan config:cache; \
    php artisan migrate --force; \
    if [ "$RUN_SEED" = "true" ]; then php artisan db:seed --force; fi; \
    php artisan serve --host=0.0.0.0 --port=8080
