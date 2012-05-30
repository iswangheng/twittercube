delimiter $$

CREATE DATABASE `twitter_cube` /*!40100 DEFAULT CHARACTER SET utf8 */$$

delimiter $$

CREATE TABLE `experts` (
  `idexperts` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `user_img` varchar(150) DEFAULT NULL,
  `user_description` varchar(500) DEFAULT NULL,
  `artdesign` varchar(10) DEFAULT NULL,
  `autos` varchar(10) DEFAULT NULL,
  `business` varchar(10) DEFAULT NULL,
  `education` varchar(10) DEFAULT NULL,
  `entertainment` varchar(10) DEFAULT NULL,
  `fashion` varchar(10) DEFAULT NULL,
  `food` varchar(10) DEFAULT NULL,
  `health` varchar(10) DEFAULT NULL,
  `music` varchar(10) DEFAULT NULL,
  `politics` varchar(10) DEFAULT NULL,
  `religion` varchar(10) DEFAULT NULL,
  `scitech` varchar(10) DEFAULT NULL,
  `sports` varchar(10) DEFAULT NULL,
  `travel` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`idexperts`,`username`)
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8$$


delimiter $$

CREATE TABLE `keywords` (
  `word` varchar(30) DEFAULT NULL,
  `freq` int(11) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=302 DEFAULT CHARSET=utf8$$


delimiter $$

CREATE TABLE `questions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) DEFAULT NULL,
  `question` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8$$


delimiter $$

CREATE TABLE `sentiment_sentences` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `posneg` varchar(45) DEFAULT NULL,
  `sentence` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8$$


delimiter $$
/**********  this is the sessions table of web.py  **********/
CREATE TABLE `sessions` (
  `session_id` char(128) NOT NULL,
  `atime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `data` text,
  PRIMARY KEY (`session_id`),
  UNIQUE KEY `session_id_UNIQUE` (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8$$


delimiter $$

CREATE TABLE `tweets` (
  `id` bigint(20) NOT NULL,
  `screen_name` varchar(100) DEFAULT NULL,
  `image_url` varchar(200) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `text` varchar(150) DEFAULT NULL,
  `is_processed` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8$$



