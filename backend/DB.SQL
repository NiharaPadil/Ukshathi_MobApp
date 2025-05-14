CREATE DATABASE IF NOT EXISTS UkshatiTechnologies;
Use UkshatiTechnologies;

SHOW TABLES;

SELECT * FROM `userLogin`;
SELECT * FROM `userData`;
SELECT * FROM `controller`;
SELECT * FROM `node`;
SELECT * FROM `valve`;
SELECT * FROM `schedule`;
SELECT * FROM `flowmeter`;
SELECT * FROM `battery`;
SELECT * FROM `history`;
SELECT * FROM `fetch`;
SELECT * FROM `hardware`;


CREATE TABLE `userLogin` (
  `userID` INT NOT NULL AUTO_INCREMENT,
  `userEmail` VARCHAR(45) NOT NULL,
  `passwordHash` VARCHAR(100) DEFAULT NULL,
  `passwordSalt` VARCHAR(45) DEFAULT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `userEmail_UNIQUE` (`userEmail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `userData` (
  `userID` INT NOT NULL,
  `firstName` VARCHAR(45) DEFAULT NULL,
  `lastName` VARCHAR(45) DEFAULT NULL,
  `phoneNumber` VARCHAR(45) DEFAULT NULL,
  `userEmail` VARCHAR(45) NOT NULL,
  `address` VARCHAR(45) DEFAULT NULL,
  `city` VARCHAR(45) DEFAULT NULL,
  `state` VARCHAR(45) DEFAULT NULL,
  PRIMARY KEY (`userID`),
  FOREIGN KEY (`userID`) REFERENCES `userLogin` (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;




CREATE TABLE `controller` (
  `controllerID` VARCHAR(45) NOT NULL,
  `controllerName` VARCHAR(45) NOT NULL,
  `userID` INT DEFAULT NULL,
  `deviceType` VARCHAR(45) DEFAULT NULL,
  PRIMARY KEY (`controllerID`),
  FOREIGN KEY (`userID`) REFERENCES `userLogin` (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `node` (
  `nodeID` VARCHAR(45) NOT NULL,
  `nodeName` VARCHAR(45) NOT NULL,
  `batteryVoltage` INT DEFAULT NULL,
  `controllerID` VARCHAR(45) DEFAULT NULL,
  PRIMARY KEY (`nodeID`),
  FOREIGN KEY (`controllerID`) REFERENCES `controller` (`controllerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `valve` (
  `valveID` VARCHAR(45) NOT NULL,
  `valveName` VARCHAR(45) NOT NULL,
  `nodeID` VARCHAR(45) DEFAULT NULL,
  `controllerID` VARCHAR(45) DEFAULT NULL,
  `userID` INT DEFAULT NULL,
  PRIMARY KEY (`valveID`),
  FOREIGN KEY (`nodeID`) REFERENCES `node` (`nodeID`),
  FOREIGN KEY (`controllerID`) REFERENCES `controller` (`controllerID`),
  FOREIGN KEY (`userID`) REFERENCES `userLogin` (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `schedule` (
  `valveID` VARCHAR(45) NOT NULL,
  `startDate` DATE DEFAULT NULL,
  `duration` INT DEFAULT NULL,
  `time` TIME DEFAULT NULL,
  `scheduleChange` INT DEFAULT NULL,
  `onoff` INT DEFAULT NULL,
  `weather` INT DEFAULT NULL,
  PRIMARY KEY (`valveID`),
  CONSTRAINT `fk_schedule_valve` FOREIGN KEY (`valveID`) REFERENCES `valve` (`valveID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `flowmeter` (
  `nodeID` VARCHAR(45) NOT NULL,
  `flowRate` VARCHAR(45) DEFAULT NULL,
  `dateTime` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`nodeID`),
  CONSTRAINT `fk_flowmeter_node` FOREIGN KEY (`nodeID`) REFERENCES `node` (`nodeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `battery` (
  `nodeID` VARCHAR(45) NOT NULL,
  `batteryVoltage` INT DEFAULT NULL,
  `dateTime` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`nodeID`),
  CONSTRAINT `fk_battery_node` FOREIGN KEY (`nodeID`) REFERENCES `node` (`nodeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



CREATE TABLE `history` (
  `valveID` VARCHAR(45) NOT NULL,
  `wateredDateTime` TIMESTAMP(6) NOT NULL,
  `wateredDuration` VARCHAR(45) DEFAULT NULL,
  `waterVolume` VARCHAR(45) DEFAULT NULL,
  PRIMARY KEY (`valveID`, `wateredDateTime`),
  CONSTRAINT `fk_history_valve` FOREIGN KEY (`valveID`) REFERENCES `valve` (`valveID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `fetch` (
  `userID` INT DEFAULT NULL,
  `controllerID` VARCHAR(45) DEFAULT NULL,
  `nodeID` VARCHAR(45) DEFAULT NULL,
  `valveID` VARCHAR(45) NOT NULL,
  `controllerName` VARCHAR(45) DEFAULT NULL,
  `nodeName` VARCHAR(45) DEFAULT NULL,
  `valveName` VARCHAR(45) DEFAULT NULL,
  `zoneName` VARCHAR(45) DEFAULT NULL,
  `fetchBV` INT DEFAULT NULL,
  `flowRate` VARCHAR(25) DEFAULT NULL,
  `manualOP` INT DEFAULT NULL,
  `DIK` VARCHAR(45) DEFAULT NULL,
  `pin1` INT DEFAULT NULL,
  `pin2` INT DEFAULT NULL,
  `userLogged` INT DEFAULT NULL,
  PRIMARY KEY (`valveID`),
  CONSTRAINT `fk_fetch_user` FOREIGN KEY (`userID`) REFERENCES `userLogin` (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `hardware` (
  `valveID` VARCHAR(45) NOT NULL,
  `subject` VARCHAR(45) DEFAULT NULL,
  `reading` VARCHAR(450) DEFAULT NULL,
  `timestamp` TIMESTAMP NOT NULL,
  PRIMARY KEY (`valveID`, `timestamp`),
  CONSTRAINT `fk_hardware_valve` FOREIGN KEY (`valveID`) REFERENCES `valve` (`valveID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- my changes


ALTER TABLE `battery`
DROP PRIMARY KEY,
ADD PRIMARY KEY (`nodeID`, `dateTime`);

CREATE TABLE queries_and_feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    query_type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    image_path VARCHAR(255), -- Stores the path to the uploaded image
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE android (
    idandroid INT NOT NULL,
    androidToken VARCHAR(500) NOT NULL,
    androidDeviceID VARCHAR(100) NOT NULL,
    registeredDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (idandroid, androidDeviceID),
    FOREIGN KEY (idandroid) REFERENCES userLogin(userID),
    INDEX (androidToken),
    INDEX (androidDeviceID)
) ENGINE=InnoDB;


CREATE TABLE Notificationsandalerts (
    idNotificationsandalerts INT,
    Message VARCHAR(110),
    Acknowledgementstatus VARCHAR(45),
    Closestatus VARCHAR(45),
    Messagetime TIMESTAMP,
    Acknowledgetime TIMESTAMP,
    eventid INT UNIQUE AUTO_INCREMENT PRIMARY KEY
) ENGINE=InnoDB;




INSERT INTO battery (nodeID, batteryVoltage, dateTime) VALUES 
('N1', 300, '2024-03-07 06:00:00'),
('N1', 310, '2024-03-07 07:00:00'),
('N1', 320, '2024-03-07 08:00:00'),
('N1', 315, '2024-03-07 09:00:00'),
('N1', 330, '2024-03-07 10:00:00'),
('N1', 340, '2024-03-07 11:00:00'),
('N1', 335, '2024-03-07 12:00:00'),
('N1', 345, '2024-03-07 13:00:00'),
('N1', 355, '2024-03-07 14:00:00'),
('N1', 360, '2024-03-07 15:00:00'),
('N1', 370, '2024-03-07 16:00:00'),
('N1', 365, '2024-03-07 17:00:00'),
('N1', 380, '2024-03-07 18:00:00'),
('N1', 390, '2024-03-07 19:00:00'),
('N1', 395, '2024-03-07 20:00:00'),
('N1', 400, '2024-03-07 21:00:00'),
('N1', 390, '2024-03-07 22:00:00'),
('N1', 385, '2024-03-07 23:00:00');

INSERT INTO history (valveID, wateredDateTime, wateredDuration, waterVolume) VALUES 
('V1', '2024-03-07 06:30:00.000000', '10 min', '8 L'),
('V1', '2024-03-07 12:15:00.000000', '20 min', '15 L'),
('V1', '2024-03-07 18:45:00.000000', '30 min', '25 L'),
('V2', '2024-03-07 07:00:00.000000', '15 min', '10 L'),
('V2', '2024-03-07 13:20:00.000000', '25 min', '18 L'),
('V2', '2024-03-07 19:10:00.000000', '35 min', '30 L'),
('V3', '2024-03-07 08:10:00.000000', '12 min', '9 L'),
('V3', '2024-03-07 14:45:00.000000', '22 min', '17 L'),
('V3', '2024-03-07 20:30:00.000000', '28 min', '23 L');












