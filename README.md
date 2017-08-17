# Wordpress | Headless
> Woohoo!

---

## Developers:

### Local Setup

1. Run __`docker-compose up`__

1. Use Wordpress: [http://localhost:8080/wp-login.php](http://localhost:8080/wp-login.php)

    - __Admin Username__: `admin`

    - __Admin Password__: `password`
    
    - __Editor Username__: `editor`

    - __Editor Password__: `password`

1. Or checkout the NodeJS API Demo

    - [http://localhost:3000/blog-posts](http://localhost:3000/blog-posts)

    - [http://localhost:3000/blog-posts?sort=title](http://localhost:3000/blog-posts?sort=title)

    - [http://localhost:3000/blog-posts/26](http://localhost:3000/blog-posts/26)

---

## Dev Ops (Mac & Linux)

### Updating the Docker Hub Images
> Make sure you have logged in with `docker login`.

1. Run __`./backup.sh`__
