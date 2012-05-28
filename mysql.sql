/**********  this is the sessions table of web.py  **********/
CREATE  TABLE `twitter_cube`.`sessions` (
  `session_id` CHAR(128) NOT NULL ,
  `atime` TIMESTAMP NOT NULL DEFAULT current_timestamp ,
  `data` TEXT NULL ,
  UNIQUE INDEX `session_id_UNIQUE` (`session_id` ASC) ,
  PRIMARY KEY (`session_id`) )
DEFAULT CHARACTER SET = utf8;
