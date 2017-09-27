FROM wordpress

# Install wp-cli
RUN curl -o /usr/local/bin/wp-cli.phar \
    https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
RUN chmod +x /usr/local/bin/wp-cli.phar
RUN mv /usr/local/bin/wp-cli.phar /usr/local/bin/wp

RUN rm /usr/src/wordpress/wp-content/plugins/hello.php
RUN rm -r /usr/src/wordpress/wp-content/plugins/akismet

# Change entrypoint to enable wp-cli
COPY apache2-wordpress-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/apache2-wordpress-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["apache2-wordpress-entrypoint.sh"]
