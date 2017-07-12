# Wordpress | Headless
> Woohoo!

---

## Developers:

### Local Setup

1. Clone this repo: __`git clone https://github.com/ryannhg/oni-wordpress.git`__

1. Enter directory: __`cd oni-wordpress`__

1. Run server: __`docker-compose up`__

1. Use Wordpress: [http://localhost:8080/wp-login.php](http://localhost:8080/wp-login.php)

    - __Username__: `admin`

    - __Password__: `password`

---

## Dev Ops:

### Updating the Docker Hub Images
> Must be logged in with `docker login`.

_For the examples below:_
- Replace `<user>` with your Docker Hub ID.
- Replace `<tag>` with your new tag.
- Replace `<commit-message>` with a description of changes.

__MariaDB Image (db)__

1. Backup database: `docker exec oni-wordpress_db_1 /backup-wordpress.sh`

1. Pause container: `docker pause oni-wordpress_db_1`

1. Save as image: `docker commit -m <commit-message> oni-wordpress_db_1 <user>/oni-mariadb:<tag>`

1. Pause container: `docker unpause oni-wordpress_db_1`

1. Push to DockerHub: `docker push <user>/oni-mariadb:<tag>`


__Wordpress Image (cms)__

1. Backup configuration: `docker exec oni-wordpress_cms_1 cp /var/www/html /usr/src/wordpress`

1. Pause container: `docker pause oni-wordpress_cms_1`

1. Save as image: `docker commit -m <commit-message> oni-wordpress_cms_1  <user>/oni-wordpress:<tag>`

1. Pause container: `docker unpause oni-wordpress_cms_1`

1. Push to DockerHub: `docker push [user]/oni-wordpress:<tag>`
