#!/bin/bash

# Install wordpress (https://developer.wordpress.org/cli/commands/core/install/)
wp --allow-root \
    core install \
    --url=http://localhost:8080 \
    --title=Wordpress \
    --admin_user=$WP_ADMIN_USER \
    --admin_password=$WP_ADMIN_PASSWORD \
    --admin_email=$WP_ADMIN_EMAIL \
    --skip-email

# Activate plugins (https://developer.wordpress.org/cli/commands/plugin/activate/)
wp --allow-root \
    plugin activate publish-hook

# Run apache server
apache2-foreground
