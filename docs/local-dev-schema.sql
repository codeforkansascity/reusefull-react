-- Local development database structure for Reusefull.
--
-- Structure of the production `reusefull` database (MySQL 8) plus the two small
-- lookup lists (`types` = charity categories, `item` = item types). It contains NO
-- charity, user or activity data. Captured 2026-11-22 from the live database.
--
-- WARNING: each table is DROPped and recreated. Only run this against a throwaway
-- local database, never against production.
--
-- Usage (Docker):
--   docker run -d --name reusefull-local-mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=reusefull -p 3306:3306 mysql:8
--   docker exec -i reusefull-local-mysql mysql -uroot -proot reusefull < docs/local-dev-schema.sql
--
-- Columns added later by reusefull-api itself (donation contact, social links)
-- and the charity_activity table are created automatically on first use.

SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS `charity`;
CREATE TABLE `charity` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `address` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `zip_code` varchar(10) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `contact_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `mission` text,
  `description` text,
  `link_donate_cash` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `link_volunteer` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `link_website` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `link_wishlist` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `link_logo` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `pickup` tinyint(1) DEFAULT NULL,
  `dropoff` tinyint(1) DEFAULT NULL,
  `resell` tinyint(1) DEFAULT NULL,
  `faith` tinyint(1) DEFAULT NULL,
  `good_items` tinyint(1) DEFAULT NULL,
  `new_items` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `approved` tinyint(1) DEFAULT NULL,
  `taxid` varchar(20) DEFAULT NULL,
  `user_id` varchar(50) DEFAULT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `city` varchar(40) DEFAULT NULL,
  `state` varchar(40) DEFAULT NULL,
  `lat` float DEFAULT NULL,
  `lng` float DEFAULT NULL,
  `paused` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
DROP TABLE IF EXISTS `charity_activity`;
CREATE TABLE `charity_activity` (
  `id` int NOT NULL AUTO_INCREMENT,
  `charity_id` int NOT NULL,
  `charity_name` varchar(255) NOT NULL,
  `event_type` varchar(32) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_charity_activity_created_at` (`created_at`),
  KEY `idx_charity_activity_charity_id` (`charity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
DROP TABLE IF EXISTS `charity_item`;
CREATE TABLE `charity_item` (
  `charity_id` int NOT NULL,
  `item_id` int NOT NULL,
  UNIQUE KEY `charity_id` (`charity_id`,`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
DROP TABLE IF EXISTS `charity_type`;
CREATE TABLE `charity_type` (
  `charity_id` int NOT NULL,
  `type_id` int NOT NULL,
  UNIQUE KEY `charity_id` (`charity_id`,`type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
DROP TABLE IF EXISTS `item`;
CREATE TABLE `item` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO `item` (`id`,`name`) VALUES (1,'Appliances - Large');
INSERT INTO `item` (`id`,`name`) VALUES (2,'Appliances - Small');
INSERT INTO `item` (`id`,`name`) VALUES (10,'Arts & Crafts Supplies');
INSERT INTO `item` (`id`,`name`) VALUES (19,'Baby Supplies');
INSERT INTO `item` (`id`,`name`) VALUES (20,'Bicycles');
INSERT INTO `item` (`id`,`name`) VALUES (22,'Books & Magazines - Adult');
INSERT INTO `item` (`id`,`name`) VALUES (21,'Books & Magazines - Children\'s');
INSERT INTO `item` (`id`,`name`) VALUES (4,'Building Materials');
INSERT INTO `item` (`id`,`name`) VALUES (23,'Clothing - Children\'s');
INSERT INTO `item` (`id`,`name`) VALUES (24,'Clothing - Men\'s');
INSERT INTO `item` (`id`,`name`) VALUES (25,'Clothing - Women\'s');
INSERT INTO `item` (`id`,`name`) VALUES (12,'Computers & Technology');
INSERT INTO `item` (`id`,`name`) VALUES (14,'Electronics');
INSERT INTO `item` (`id`,`name`) VALUES (3,'Furniture - Bedroom');
INSERT INTO `item` (`id`,`name`) VALUES (5,'Furniture - Dining Room');
INSERT INTO `item` (`id`,`name`) VALUES (8,'Furniture - Living Room');
INSERT INTO `item` (`id`,`name`) VALUES (38,'Furniture - Office');
INSERT INTO `item` (`id`,`name`) VALUES (6,'Gardening Equipment');
INSERT INTO `item` (`id`,`name`) VALUES (26,'Home Decor');
INSERT INTO `item` (`id`,`name`) VALUES (27,'Hygiene Products');
INSERT INTO `item` (`id`,`name`) VALUES (28,'Kitchenware');
INSERT INTO `item` (`id`,`name`) VALUES (17,'Linens');
INSERT INTO `item` (`id`,`name`) VALUES (36,'Mattresses');
INSERT INTO `item` (`id`,`name`) VALUES (29,'Medical Supplies and Equipment');
INSERT INTO `item` (`id`,`name`) VALUES (37,'Music - Records, CDs, Tapes');
INSERT INTO `item` (`id`,`name`) VALUES (30,'Musical Instruments');
INSERT INTO `item` (`id`,`name`) VALUES (18,'Office Supplies');
INSERT INTO `item` (`id`,`name`) VALUES (31,'Pet Supplies');
INSERT INTO `item` (`id`,`name`) VALUES (32,'School Supplies');
INSERT INTO `item` (`id`,`name`) VALUES (39,'Scrap Metal');
INSERT INTO `item` (`id`,`name`) VALUES (33,'Sports Equipment');
INSERT INTO `item` (`id`,`name`) VALUES (9,'Tools');
INSERT INTO `item` (`id`,`name`) VALUES (34,'Toys, Games & Puzzles');
INSERT INTO `item` (`id`,`name`) VALUES (35,'Vehicles & Boats');
DROP TABLE IF EXISTS `types`;
CREATE TABLE `types` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO `types` (`id`,`name`) VALUES (1,'Animals & Pets');
INSERT INTO `types` (`id`,`name`) VALUES (2,'Arts & Music');
INSERT INTO `types` (`id`,`name`) VALUES (3,'Children & Youth');
INSERT INTO `types` (`id`,`name`) VALUES (4,'College & Universities');
INSERT INTO `types` (`id`,`name`) VALUES (5,'Domestic Violence');
INSERT INTO `types` (`id`,`name`) VALUES (6,'Education & Literacy');
INSERT INTO `types` (`id`,`name`) VALUES (7,'Environment');
INSERT INTO `types` (`id`,`name`) VALUES (8,'Food & Nutrition');
INSERT INTO `types` (`id`,`name`) VALUES (9,'Health & Substance Abuse');
INSERT INTO `types` (`id`,`name`) VALUES (10,'Healthcare');
INSERT INTO `types` (`id`,`name`) VALUES (11,'Homelessness & Housing');
INSERT INTO `types` (`id`,`name`) VALUES (12,'Immigrants & Refugees');
INSERT INTO `types` (`id`,`name`) VALUES (13,'Job Training & Employment');
INSERT INTO `types` (`id`,`name`) VALUES (14,'Media & Journalism');
INSERT INTO `types` (`id`,`name`) VALUES (15,'Re-entry & Criminal Justice');
INSERT INTO `types` (`id`,`name`) VALUES (16,'Seniors & Caregivers');
INSERT INTO `types` (`id`,`name`) VALUES (17,'Sports & Recreation');
INSERT INTO `types` (`id`,`name`) VALUES (18,'Other');
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` varchar(50) NOT NULL,
  `admin` tinyint(1) NOT NULL DEFAULT '0',
  `email_verified` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
SET FOREIGN_KEY_CHECKS=1;
