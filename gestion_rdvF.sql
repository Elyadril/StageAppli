-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Client :  127.0.0.1
-- Généré le :  Mer 03 Février 2016 à 15:49
-- Version du serveur :  5.6.17
-- Version de PHP :  5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données :  `gestion_rdvf`
--

-- --------------------------------------------------------

--
-- Structure de la table `agenda`
--

CREATE TABLE IF NOT EXISTS `agenda` (
  `idAgenda` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identifiant de l''agenda',
  `libAgenda` varchar(30) COLLATE utf8_bin NOT NULL COMMENT 'Nom de l''agenda',
  `mail` varchar(50) COLLATE utf8_bin NOT NULL COMMENT 'Adresse mail du créateur de l''agenda',
  `nbJourOuverture` tinyint(4) NOT NULL COMMENT 'Nombre de jours avant l''ouverture aux inscriptions de l''agenda',
  `nbJourLimite` tinyint(4) NOT NULL COMMENT 'Nombre de jour avant fin de la possibilitée d''inscription et de modification ',
  `inscriptionMax` smallint(6) NOT NULL COMMENT 'Nombre maximum de personne pouvant s''inscrire par créneau horaire',
  `cacheNom` tinyint(1) NOT NULL COMMENT 'option pour cacher les noms ',
  `autoIns` tinyint(1) NOT NULL COMMENT 'Autorise l''inscription d''une personne par une autre',
  `commentaire` text COLLATE utf8_bin NOT NULL COMMENT 'Informations supplémentaires de l''agenda',
  `dateCreation` datetime NOT NULL COMMENT 'Date de création de l''agenda',
  PRIMARY KEY (`idAgenda`),
  KEY `mail` (`mail`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Table gérant la création d''un agenda' AUTO_INCREMENT=16 ;

--
-- Contenu de la table `agenda`
--

INSERT INTO `agenda` (`idAgenda`, `libAgenda`, `mail`, `nbJourOuverture`, `nbJourLimite`, `inscriptionMax`, `cacheNom`, `autoIns`, `commentaire`, `dateCreation`) VALUES
(1, 'Piscine', 'createur.maurice@gmail.com', 30, 7, 4, 1, 1, 'Bonjour Veuillez-noter de ne pas oublier \r\n\r\nvotre maillot de bain et votre bonnet lors\r\n\r\n de vos rendez-vous à la piscine ! \r\n\r\nMerci de votre bonne attention !', '2016-01-28 00:00:00'),
(2, 'Tir', 'createur.maurice@gmail.com', 15, 7, 2, 0, 0, '', '2016-01-28 00:00:00'),
(5, 'cross', 'createur.maurice@gmail.com', 60, 15, 50, 0, 0, '', '2016-01-29 08:08:07'),
(6, 'marche', 'admin.jean@gmail.com', 30, 7, 3, 0, 0, '', '2016-02-01 13:25:12'),
(9, 'RH', 'admin.jean@gmail.com', 30, 7, 1, 1, 1, 'qnvkiaivkqnikaoannkqnaoin', '2016-02-03 14:27:23'),
(10, 'vzavz', 'admin.jean@gmail.com', 30, 1, 2, 1, 1, 'acacaacac\naacacaca\nacacac', '2016-02-03 14:32:40'),
(14, 'caacaaevg', 'admin.jean@gmail.com', 30, 7, 1, 0, 1, 'qcqcqcq', '2016-02-03 14:37:49'),
(15, 'caacaaevg', 'admin.jean@gmail.com', 30, 7, 1, 0, 1, 'qcqcqcq', '2016-02-03 14:37:49');

-- --------------------------------------------------------

--
-- Structure de la table `gestionnaire_agendas`
--

CREATE TABLE IF NOT EXISTS `gestionnaire_agendas` (
  `mail` varchar(50) COLLATE utf8_bin NOT NULL COMMENT 'Adresse mail du gestionnaire de l''agenda',
  `idAgenda` int(11) NOT NULL COMMENT 'Identifiant de l''agenda géré par le gestionnaire',
  PRIMARY KEY (`mail`,`idAgenda`),
  KEY `idAgenda` (`idAgenda`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Table listant les gestionnaires d''un agenda';

--
-- Contenu de la table `gestionnaire_agendas`
--

INSERT INTO `gestionnaire_agendas` (`mail`, `idAgenda`) VALUES
('gestio.mathieu@gmail.com', 1),
('lambda.kevin@gmail.com', 1),
('gestio.mathieu@gmail.com', 5);

-- --------------------------------------------------------

--
-- Structure de la table `inscription`
--

CREATE TABLE IF NOT EXISTS `inscription` (
  `mail` varchar(50) COLLATE utf8_bin NOT NULL COMMENT 'Adresse mail de la personne s''inscrivant au rendez-vous',
  `idRDV` int(11) NOT NULL COMMENT 'Identifiant du rendez-vous ',
  `DateInscription` datetime NOT NULL COMMENT 'Date d''inscription de l''utlisateur',
  PRIMARY KEY (`mail`,`idRDV`),
  KEY `idRDV` (`idRDV`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Table gérant l''inscription d''une personne à un rendez-vous';

--
-- Contenu de la table `inscription`
--

INSERT INTO `inscription` (`mail`, `idRDV`, `DateInscription`) VALUES
('admin.jean@gmail.com', 14, '0000-00-00 00:00:00'),
('admin.jean@gmail.com', 36, '0000-00-00 00:00:00'),
('banal.thomas@gmail.com', 14, '0000-00-00 00:00:00'),
('courant.paul@gmail.com', 14, '0000-00-00 00:00:00'),
('courant.paul@gmail.com', 18, '0000-00-00 00:00:00'),
('lambda.kevin@gmail.com', 36, '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `inscriptionpers`
--
CREATE TABLE IF NOT EXISTS `inscriptionpers` (
`mail` varchar(50)
,`idRDV` int(11)
,`DateDebut` date
,`HeureDebut` time
,`HeureFin` time
,`libAgenda` varchar(30)
);
-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `nbinscription`
--
CREATE TABLE IF NOT EXISTS `nbinscription` (
`idAgenda` int(11)
,`idRDV` int(11)
,`DateDebut` date
,`HeureDebut` time
,`HeureFin` time
,`nbInscrits` bigint(21)
,`inscriptionMax` smallint(6)
);
-- --------------------------------------------------------

--
-- Structure de la table `personne`
--

CREATE TABLE IF NOT EXISTS `personne` (
  `mail` varchar(50) COLLATE utf8_bin NOT NULL COMMENT 'Adresse mail de la personne permettant son authentification',
  `nom` varchar(30) COLLATE utf8_bin NOT NULL COMMENT 'Nom de la personne',
  `prenom` varchar(30) COLLATE utf8_bin NOT NULL COMMENT 'Prénom de la personne',
  `grade` varchar(25) COLLATE utf8_bin NOT NULL COMMENT 'Grade de la personne',
  `createurAg` tinyint(1) NOT NULL COMMENT 'Variable permettant de définir une personne comme pouvant créer un agenda ( 0 : non-créateur d''agenda , 1 : créateur d''agenda )',
  `admin` tinyint(1) NOT NULL COMMENT 'Variable permettant de définir une personne comme administrateur ( 0 : non-administrateur , 1 : administrateur )',
  PRIMARY KEY (`mail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Contenu de la table `personne`
--

INSERT INTO `personne` (`mail`, `nom`, `prenom`, `grade`, `createurAg`, `admin`) VALUES
('admin.jean@gmail.com', 'admin', 'jean', 'gnl', 1, 1),
('banal.thomas@gmail.com', 'banal', 'thomas', 'ift', 0, 0),
('courant.paul@gmail.com', 'courant', 'paul', 'ift', 0, 0),
('createur.maurice@gmail.com', 'createur', 'maurice', 'adj', 1, 0),
('gestio.mathieu@gmail.com', 'gestio', 'mathieu', 'cln', 0, 0),
('lambda.kevin@gmail.com', 'lambda', 'kevin', 'sgt', 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table `rendez_vous`
--

CREATE TABLE IF NOT EXISTS `rendez_vous` (
  `idRDV` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identifiant du rendez-vous',
  `DateDebut` date NOT NULL COMMENT 'Date de début du rendez-vous',
  `HeureDebut` time NOT NULL COMMENT 'Heure de début du rendez-vous',
  `DateFin` date NOT NULL COMMENT 'Date  de fin du rendez-vous',
  `HeureFin` time NOT NULL COMMENT 'Heure de fin du rendez-vous',
  `idAgenda` int(11) NOT NULL COMMENT 'Identifiant de l''agenda permettant d''associer le rendez-vous a un agenda',
  `DateCreation` datetime NOT NULL COMMENT 'Date de création de l''agenda',
  PRIMARY KEY (`idRDV`),
  KEY `idAgenda` (`idAgenda`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Table gérant la création d''un rendez-vous sur agenda' AUTO_INCREMENT=37 ;

--
-- Contenu de la table `rendez_vous`
--

INSERT INTO `rendez_vous` (`idRDV`, `DateDebut`, `HeureDebut`, `DateFin`, `HeureFin`, `idAgenda`, `DateCreation`) VALUES
(1, '2016-02-29', '08:00:00', '2016-02-29', '09:00:00', 1, '0000-00-00 00:00:00'),
(5, '2016-01-08', '08:00:00', '2016-01-08', '09:00:00', 1, '0000-00-00 00:00:00'),
(6, '2016-01-15', '08:00:00', '2016-01-15', '09:00:00', 1, '0000-00-00 00:00:00'),
(7, '2016-01-22', '08:00:00', '2016-01-22', '09:00:00', 1, '0000-00-00 00:00:00'),
(9, '2016-01-29', '08:00:00', '2016-01-29', '09:00:00', 1, '0000-00-00 00:00:00'),
(10, '2016-02-05', '08:00:00', '2016-02-05', '09:00:00', 1, '0000-00-00 00:00:00'),
(11, '2016-02-12', '08:00:00', '2016-02-12', '09:00:00', 1, '0000-00-00 00:00:00'),
(12, '2016-02-19', '08:00:00', '2016-02-12', '09:00:00', 1, '0000-00-00 00:00:00'),
(13, '2016-02-26', '08:00:00', '2016-02-26', '09:00:00', 1, '0000-00-00 00:00:00'),
(14, '2016-01-01', '10:00:00', '2016-01-02', '11:00:00', 1, '2016-01-22 00:00:00'),
(18, '2016-01-01', '14:00:00', '2016-01-01', '15:00:00', 1, '2016-01-26 00:00:00'),
(19, '2016-01-01', '16:00:00', '2016-01-01', '17:00:00', 1, '2016-01-21 00:00:00'),
(20, '2016-01-01', '15:00:00', '2016-01-01', '16:00:00', 1, '2016-01-14 00:00:00'),
(21, '2016-03-15', '08:00:00', '2016-03-15', '09:00:00', 1, '2016-01-06 00:00:00'),
(22, '2016-03-17', '08:00:00', '2016-03-17', '09:00:00', 1, '2016-01-13 00:00:00'),
(23, '2016-04-19', '08:00:00', '2016-04-19', '09:00:00', 1, '0000-00-00 00:00:00'),
(24, '2016-04-21', '08:00:00', '2016-04-21', '09:00:00', 1, '0000-00-00 00:00:00'),
(25, '2016-09-06', '08:00:00', '2016-09-06', '09:00:00', 1, '0000-00-00 00:00:00'),
(26, '2016-12-23', '08:00:00', '2016-12-23', '09:00:00', 1, '0000-00-00 00:00:00'),
(27, '2016-06-16', '08:00:00', '2016-06-16', '09:00:00', 1, '2016-01-21 00:00:00'),
(28, '2016-07-28', '08:00:00', '2016-07-28', '09:00:00', 1, '2016-01-27 00:00:00'),
(29, '2016-08-11', '08:00:00', '2016-08-11', '09:00:00', 1, '2016-01-19 00:00:00'),
(30, '2016-04-14', '08:00:00', '2016-01-14', '09:00:00', 1, '2016-01-29 00:00:00'),
(31, '2016-01-06', '08:00:00', '2016-01-06', '09:00:00', 1, '0000-00-00 00:00:00'),
(32, '2016-01-21', '08:00:00', '2016-01-21', '09:00:00', 1, '0000-00-00 00:00:00'),
(33, '2016-02-19', '08:00:00', '2016-02-19', '09:00:00', 1, '2016-01-13 00:00:00'),
(34, '2016-03-14', '08:00:00', '2016-02-14', '09:00:00', 1, '2016-01-21 00:00:00'),
(36, '2016-02-02', '08:00:00', '2016-02-02', '09:00:00', 2, '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Structure de la vue `inscriptionpers`
--
DROP TABLE IF EXISTS `inscriptionpers`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `inscriptionpers` AS select `i`.`mail` AS `mail`,`i`.`idRDV` AS `idRDV`,`rd`.`DateDebut` AS `DateDebut`,`rd`.`HeureDebut` AS `HeureDebut`,`rd`.`HeureFin` AS `HeureFin`,`a`.`libAgenda` AS `libAgenda` from ((`inscription` `i` join `rendez_vous` `rd` on((`rd`.`idRDV` = `i`.`idRDV`))) join `agenda` `a` on((`a`.`idAgenda` = `rd`.`idAgenda`))) where (`rd`.`idRDV` = `i`.`idRDV`);

-- --------------------------------------------------------

--
-- Structure de la vue `nbinscription`
--
DROP TABLE IF EXISTS `nbinscription`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `nbinscription` AS select `rd`.`idAgenda` AS `idAgenda`,`i`.`idRDV` AS `idRDV`,`rd`.`DateDebut` AS `DateDebut`,`rd`.`HeureDebut` AS `HeureDebut`,`rd`.`HeureFin` AS `HeureFin`,count(`i`.`idRDV`) AS `nbInscrits`,`a`.`inscriptionMax` AS `inscriptionMax` from ((`inscription` `i` join `rendez_vous` `rd` on((`rd`.`idRDV` = `i`.`idRDV`))) join `agenda` `a` on((`a`.`idAgenda` = `rd`.`idAgenda`))) group by `i`.`idRDV`;

--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `agenda`
--
ALTER TABLE `agenda`
  ADD CONSTRAINT `agenda_ibfk_1` FOREIGN KEY (`mail`) REFERENCES `personne` (`mail`);

--
-- Contraintes pour la table `gestionnaire_agendas`
--
ALTER TABLE `gestionnaire_agendas`
  ADD CONSTRAINT `gestionnaire_agendas_ibfk_1` FOREIGN KEY (`mail`) REFERENCES `personne` (`mail`),
  ADD CONSTRAINT `gestionnaire_agendas_ibfk_2` FOREIGN KEY (`idAgenda`) REFERENCES `agenda` (`idAgenda`);

--
-- Contraintes pour la table `inscription`
--
ALTER TABLE `inscription`
  ADD CONSTRAINT `inscription_ibfk_1` FOREIGN KEY (`mail`) REFERENCES `personne` (`mail`),
  ADD CONSTRAINT `inscription_ibfk_2` FOREIGN KEY (`idRDV`) REFERENCES `rendez_vous` (`idRDV`);

--
-- Contraintes pour la table `rendez_vous`
--
ALTER TABLE `rendez_vous`
  ADD CONSTRAINT `rendez_vous_ibfk_1` FOREIGN KEY (`idAgenda`) REFERENCES `agenda` (`idAgenda`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
