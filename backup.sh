#!/bin/bash

container_prefix=
while [ -z $container_prefix ]
do
    echo -n 'Container Prefix: '
    read container_prefix
done

cms_container="${container_prefix}_cms_1"
db_container="${container_prefix}_db_1"

echo "* Backing up ${cms_container}..."
docker exec $cms_container cp -a /var/www/html/. /usr/src/wordpress/

echo "* Backing up ${db_container}..."
docker exec $db_container mysqldump --user="root" --password="password" --databases wordpress --result-file /docker-entrypoint-initdb.d/wordpress.sql

author=
while [ -z $author ]
do
    echo -n 'Docker ID: '
    read author
done

tag=
while [ -z $tag ]
do
    echo -n 'Tag: '
    read tag
done

echo "* Commiting ${author}/oni-cms:${tag}..."
docker pause $cms_container
docker commit $cms_container ${author}/oni-cms:${tag}
docker unpause $cms_container

echo "* Commiting ${author}/oni-db:${tag}..."
docker pause $db_container
docker commit $db_container ${author}/oni-db:${tag}
docker unpause $db_container

should_push=
while [ -z $should_push ]
do
    echo -n 'Push to Docker Hub? (Y/N): '
    read should_push
done

if [ $should_push = "Y" ] || [ $should_push = "y" ]; then
    echo "Pushing..."
    docker push ${author}/oni-cms:${tag}
    docker push ${author}/oni-db:${tag}
else
    echo "Not pushing."
fi

echo "Done!"
