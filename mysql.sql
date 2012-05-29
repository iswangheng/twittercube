/**********  this is the sessions table of web.py  **********/
CREATE  TABLE `twitter_cube`.`sessions` (
  `session_id` CHAR(128) NOT NULL ,
  `atime` TIMESTAMP NOT NULL DEFAULT current_timestamp ,
  `data` TEXT NULL ,
  UNIQUE INDEX `session_id_UNIQUE` (`session_id` ASC) ,
  PRIMARY KEY (`session_id`) )
DEFAULT CHARACTER SET = utf8;

CREATE TABLE `experts` (
  `idexperts` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) DEFAULT NULL,
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
  PRIMARY KEY (`idexperts`)
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8

CREATE TABLE `questions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) DEFAULT NULL,
  `question` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8


CREATE TABLE `sentiment_sentences` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `posneg` varchar(45) DEFAULT NULL,
  `sentence` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8
