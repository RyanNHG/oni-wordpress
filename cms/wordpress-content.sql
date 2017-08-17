USE wordpress;

-- MySQL dump 10.16  Distrib 10.2.6-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: wordpress
-- ------------------------------------------------------
-- Server version	10.2.6-MariaDB-10.2.6+maria~jessie

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `wp_posts`
--
-- WHERE:  post_author IN (SELECT user_id FROM wordpress.wp_usermeta WHERE meta_key = 'wp_capabilities' AND meta_value LIKE '%editor%' )

LOCK TABLES `wp_posts` WRITE;
/*!40000 ALTER TABLE `wp_posts` DISABLE KEYS */;
INSERT INTO `wp_posts` VALUES (34,2,'2017-08-02 14:36:18','0000-00-00 00:00:00','','Auto Draft','','auto-draft','open','open','','','','','2017-08-02 14:36:18','0000-00-00 00:00:00','',0,'http://localhost:8080/?p=34',0,'post','',0),(35,2,'2017-08-02 14:36:31','2017-08-02 14:36:31','Live env','Client Post','','publish','closed','closed','','client-post','','','2017-08-02 14:36:31','2017-08-02 14:36:31','',0,'http://localhost:8080/?post_type=blog_post&#038;p=35',0,'blog_post','',0);
/*!40000 ALTER TABLE `wp_posts` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-08-02 14:41:26
