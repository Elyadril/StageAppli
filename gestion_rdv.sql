-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Client :  127.0.0.1
-- Généré le :  Mar 12 Janvier 2016 à 10:47
-- Version du serveur :  5.6.17
-- Version de PHP :  5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données :  `gestion_rdv`
--

-- --------------------------------------------------------

--
-- Structure de la table `agenda`
--

CREATE TABLE IF NOT EXISTS `agenda` (
  `idAgenda` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identifiant de l''agenda',
  `libAgenda` varchar(30) COLLATE utf8_bin NOT NULL COMMENT 'Nom de l''agenda',
  `mail` varchar(50) COLLATE utf8_bin NOT NULL COMMENT 'Adresse mail du créateur de l''agenda',
  `nbJourOuvegrture` tinyint(4) NOT NULL COMMENT 'Nombre de jours avant l''ouverture aux inscriptions de l''agenda',
  `nbJourLimite` tinyint(4) NOT NULL COMMENT 'Nombre de jour avant fin de la possibilitée d''inscription et de modification ',
  `inscriptionMax` smallint(6) NOT NULL COMMENT 'Nombre maximum de personne pouvant s''inscrire par créneau horaire',
  `dateCreation` datetime NOT NULL COMMENT 'Date de création de l''agenda',
  PRIMARY KEY (`idAgenda`),
  KEY `mail` (`mail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Table gérant la création d''un agenda' AUTO_INCREMENT=1 ;

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

-- --------------------------------------------------------

--
-- Structure de la table `rendez-vous`
--

CREATE TABLE IF NOT EXISTS `rendez-vous` (
  `idRDV` int(11) NOT NULL COMMENT 'Identifiant du rendez-vous',
  `DateDebut` datetime NOT NULL COMMENT 'Date et heure de début du rendez-vous',
  `DateFin` datetime NOT NULL COMMENT 'Date et heure de fin du rendez-vous',
  `idAgenda` int(11) NOT NULL COMMENT 'Identifiant de l''agenda permettant d''associer le rendez-vous a un agenda',
  `DateCreation` datetime NOT NULL COMMENT 'Date de création de l''agenda',
  PRIMARY KEY (`idRDV`),
  KEY `idAgenda` (`idAgenda`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Table gérant la création d''un rendez-vous sur agenda';

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
  ADD CONSTRAINT `inscription_ibfk_2` FOREIGN KEY (`idRDV`) REFERENCES `rendez-vous` (`idRDV`);

--
-- Contraintes pour la table `rendez-vous`
--
ALTER TABLE `rendez-vous`
  ADD CONSTRAINT `rendez-vous_ibfk_1` FOREIGN KEY (`idAgenda`) REFERENCES `agenda` (`idAgenda`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
