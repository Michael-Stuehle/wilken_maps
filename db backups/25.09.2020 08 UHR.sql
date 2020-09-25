-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 25. Sep 2020 um 08:56
-- Server-Version: 10.4.13-MariaDB
-- PHP-Version: 7.4.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `wilken_maps`
--

DELIMITER $$
--
-- Prozeduren
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `resetExpiredStuff` ()  BEGIN
update user set 1malPasswort=NULL, 1malPasswortAblauf=NULL where 1malPasswortAblauf < NOW();
update user set verificationToken="", verificationTokenExpires=NULL where verificationTokenExpires < NOW();
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `einstellungen`
--

CREATE TABLE `einstellungen` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `einstellungen`
--

INSERT INTO `einstellungen` (`id`, `user_id`) VALUES
(5, 43);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `mitarbeiter`
--

CREATE TABLE `mitarbeiter` (
  `id` int(11) NOT NULL,
  `name` varchar(100) CHARACTER SET utf8 NOT NULL,
  `raum_id` int(11) NOT NULL,
  `user_id` int(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `mitarbeiter`
--

INSERT INTO `mitarbeiter` (`id`, `name`, `raum_id`, `user_id`) VALUES
(47, 'Romahn Nicola', 183, NULL),
(48, 'Rudner Jochen', 183, NULL),
(49, 'Tomschi Christine', 184, NULL),
(50, 'Kümmel Mark', 185, NULL),
(51, 'Oczenaschek Gerd', 185, NULL),
(52, 'Petkov Momchil', 185, NULL),
(53, 'Reidel Siegfried', 185, NULL),
(54, 'Schwenkschuster Thomas', 185, NULL),
(55, 'Topar Benjamin', 185, NULL),
(56, 'Günzer Martin', 185, NULL),
(57, 'Kopanski Marek', 186, NULL),
(58, 'Schmidt Konstantin', 186, NULL),
(59, 'Süßenbach Klaus', 186, NULL),
(60, 'Pollak Julian', 186, NULL),
(61, 'Al Ozoun Mohammed', 186, NULL),
(62, 'Häußler Michael', 187, NULL),
(63, 'Gündüzer Emre', 187, NULL),
(64, 'Pohl Raimund', 187, NULL),
(65, 'Grimm Natascha', 187, NULL),
(66, 'Feil Andreas', 188, NULL),
(67, 'Schmidt Lukas', 188, NULL),
(68, 'Sehne Stefan', 188, NULL),
(69, 'Macke-Schurr Luca', 188, NULL),
(70, 'Weber Kai', 188, NULL),
(71, 'Azevedo-Braun Tanja', 189, NULL),
(72, 'Hergert Alina', 189, NULL),
(73, 'Koch Roswitha', 189, NULL),
(74, 'Schalk Renate', 189, NULL),
(75, 'Scheible Waltraud', 189, NULL),
(76, 'Vitek Kerstin', 189, NULL),
(77, 'Hinkelmann Rainer', 190, NULL),
(78, 'Köpf Harald', 190, NULL),
(79, 'Bohnacker Julia', 191, NULL),
(80, 'Schmutz Winfried', 191, NULL),
(81, 'Hense Christina', 191, NULL),
(82, 'Eisenlauer Phillip', 191, NULL),
(83, 'Hegele Florian', 191, NULL),
(84, 'Geiger Daniela', 191, NULL),
(85, 'Kempe Ebenhardt', 191, NULL),
(86, 'Booms Benjamin', 191, NULL),
(87, 'Loidold Dietmar', 192, NULL),
(88, 'Abazibra Senad', 192, NULL),
(89, 'Müller Dominik', 192, NULL),
(90, 'DRmic Ante', 193, NULL),
(91, 'Frey Simon', 193, NULL),
(92, 'Schott Carsten', 194, NULL),
(93, 'Fiedler Werner', 194, NULL),
(94, 'Sabella Daniela', 194, NULL),
(95, 'Peter Leon', 194, NULL),
(96, 'JaskulaSvetlana', 194, NULL),
(97, 'Pudrycki Thomas', 195, NULL),
(98, 'Schenk Andreas', 195, NULL),
(99, 'Böhme Wolfgang Kutsche Uwe', 195, NULL),
(100, 'Reinardt Michael', 195, NULL),
(101, 'Lichtblau Kirstin', 196, NULL),
(102, 'Reinold Christof', 196, NULL),
(103, 'Merl Witold', 197, NULL),
(104, 'Gruß Berthold', 197, NULL),
(105, 'Cosmai Francesca', 198, NULL),
(106, 'Hargesheimer Jessica', 198, NULL),
(107, 'Karger Jan', 198, NULL),
(108, 'Manke Tugba', 198, NULL),
(109, 'Simmendinger Vanessa', 198, NULL),
(110, 'Schießler Maximilian', 199, NULL),
(111, 'Konkel Tanja', 200, NULL),
(112, 'Schirmer Katrin', 200, NULL),
(113, 'Topar Maria', 200, NULL),
(114, 'Kalweit Viktoria', 201, NULL),
(115, 'Kenner Marina', 201, NULL),
(116, 'Kutzner Andrea', 201, NULL),
(117, 'Neher Olga', 201, NULL),
(118, 'Weber Katja', 201, NULL),
(119, 'Tvalavadze Tina', 202, NULL),
(120, 'Rienas Patrick', 202, NULL),
(121, 'Välilä Katinka', 202, NULL),
(122, 'FesselerMelanie', 203, NULL),
(123, 'Wachter Lisa', 203, NULL),
(124, 'Wolf Michaela', 203, NULL),
(125, 'Feil Claudia', 203, NULL),
(126, 'Bockstaller Jacqueline', 204, NULL),
(127, 'Mack Corina', 204, NULL),
(128, 'Müller Oliver', 204, NULL),
(129, 'Salzgeber Henrik', 204, NULL),
(130, 'Volk Anna', 204, NULL),
(131, 'Füller Birgit', 205, NULL),
(132, 'Brix Marcel', 205, NULL),
(133, 'Ding Charlotte', 205, NULL),
(134, 'Riedlinger Klaus', 205, NULL),
(135, 'Bartel Sandra', 206, NULL),
(136, 'Hollerbach Nicole', 206, NULL),
(137, 'Hopf Steve', 206, NULL),
(138, 'Maiser Melina', 206, NULL),
(139, 'Gorickic Mara', 206, NULL),
(140, 'Simon Larissa', 206, NULL),
(141, 'Schwärzel Dominik', 207, NULL),
(142, 'Klaus Busch', 208, NULL),
(143, 'Wolsky Andrea', 208, NULL),
(144, 'Raith Kathrin', 208, NULL),
(145, 'Schulte-Rentrop Peter', 209, NULL),
(146, 'von TomkewitschMichael', 209, NULL),
(147, 'Hirschkorn Dieter', 209, NULL),
(148, 'Maisinger Eduard', 209, NULL),
(149, 'HenkelThomas', 210, NULL),
(150, 'Reincke Björn', 210, NULL),
(151, 'Weber Marc', 210, NULL),
(152, 'Reimann Michael', 210, NULL),
(153, 'Unrau Christian', 210, NULL),
(154, 'WittlingerChristian', 210, NULL),
(155, 'Samatin Daniel', 211, NULL),
(156, 'Reinert Dominik', 211, NULL),
(157, 'Mann Tobias', 211, NULL),
(158, 'Gnann Yanick', 212, NULL),
(159, 'Klich Patrick', 212, NULL),
(160, 'Neß Patrick', 212, NULL),
(161, 'Oesterle Tobias', 212, NULL),
(162, 'Pohle Fabian', 212, NULL),
(163, 'Straub Thomas', 212, NULL),
(164, 'Dr. Radloff Sophia', 212, NULL),
(165, 'Viola Frank', 212, NULL),
(166, 'Brunner André', 213, NULL),
(167, 'Volz Andreas', 213, NULL),
(168, 'Dill Anna', 214, NULL),
(169, 'Lupascu Julia', 214, NULL),
(170, 'Fiedler Swen', 215, NULL),
(171, 'Gillich Gerd', 215, NULL),
(172, 'Büchele Nico', 216, NULL),
(173, 'Dil Anna', 216, NULL),
(174, 'Hertling Benjamin', 216, NULL),
(175, 'Lechner Frank', 216, NULL),
(176, 'von Linde-Suden Joachim Dr.', 216, NULL),
(177, 'Langer Roy', 216, NULL),
(178, 'Braun Kevin', 216, NULL),
(179, 'Haas Christin', 216, NULL),
(180, 'Granacher Stefan', 217, NULL),
(181, 'Steinkamp Kai', 217, NULL),
(182, 'Fritsche Martina', 218, NULL),
(183, 'Hoermann Friedrich', 218, NULL),
(184, 'Kröner Christine', 218, NULL),
(185, 'Pecher Tobias Dr.', 218, NULL),
(186, 'Runow Silvana', 218, NULL),
(187, 'Schäfer Alexander', 218, NULL),
(188, 'Weidle Helmut', 218, NULL),
(189, 'Maldfeld Michael', 219, NULL),
(190, 'Schustermann Elisaveta', 219, NULL),
(191, 'Fast Robert', 220, NULL),
(192, 'Weigand alexander', 220, NULL),
(193, 'Neher Christian', 221, NULL),
(194, 'Volz Edwin', 221, NULL),
(195, 'Deutzmann Ralf', 222, NULL),
(196, 'Griesinger Sandra', 222, NULL),
(197, 'Kirschmann Markus', 222, NULL),
(198, 'Bem Brook', 222, NULL),
(199, 'Stifter Tobias', 223, NULL),
(200, 'Kiedaisch Friedemann', 223, NULL),
(201, 'Sauter Martina', 223, NULL),
(202, 'Seyboth Simon', 223, NULL),
(203, 'Alzuabidi Mustafa', 223, NULL),
(204, 'Schrempp Michael', 223, NULL),
(205, 'Stuehle Michael', 223, 43),
(206, 'Hillmann Barbara', 224, NULL),
(207, 'Naß Sascha', 224, NULL),
(208, 'Rauh Martin', 224, NULL),
(209, 'Hewer Alexander', 224, NULL),
(210, 'Hausladen Andreas', 225, NULL),
(211, 'Miao Yi', 225, NULL),
(212, 'Simonsen Jan Peter', 225, NULL),
(213, 'Maile Tim', 225, NULL),
(214, 'Kirchner Klaus-Pete', 226, NULL),
(215, 'Stodko Rico', 226, NULL),
(216, 'Brugger Helmut', 227, NULL),
(217, 'Honold Annette', 227, NULL),
(218, 'Bartel Gordon', 228, NULL),
(219, 'Blessing', 228, NULL),
(220, 'Lambert Hartmut', 228, NULL),
(221, 'Eckstein Myrjam', 229, NULL),
(222, 'Kamp Manira', 229, NULL),
(223, 'Kienleitner Patrizia', 229, NULL),
(224, 'Mack Bernd', 229, NULL),
(225, 'Mödinger Marc', 229, NULL),
(226, 'Schnitzler Christof KorosZsolt', 229, NULL),
(227, 'Pflaum Alexander', 230, NULL),
(228, 'Schmuck Helmuth', 230, NULL),
(229, 'Blessing Michael', 230, NULL),
(230, 'Sommerfeld Merlin', 230, NULL),
(231, 'Nerbas Daniel', 230, NULL),
(232, 'Jankovics Helmut', 231, NULL),
(233, 'Offenloch Holger', 231, NULL),
(234, 'Szczesny Brigitte', 231, NULL),
(235, 'Weber Anja', 232, NULL),
(236, 'Raquet André', 232, NULL),
(237, 'Raubacher Roland', 232, NULL),
(238, 'Arnold Simon', 232, NULL),
(239, 'Grandjean Arntraut', 233, NULL),
(240, 'Hummel Peter', 233, NULL),
(241, 'Scharf René', 233, NULL),
(242, 'Schulze-Brüninghoff Halil', 233, NULL),
(243, 'Sieber Bernhard', 233, NULL),
(244, 'Ellroth Nadja', 233, NULL),
(245, 'Pourhassanyami Turan', 233, NULL),
(246, 'Anvari Saman', 234, NULL),
(247, 'Mayer Klaus', 234, NULL),
(248, 'Sailer Sabine', 234, NULL),
(249, 'Schenzle Hubert', 234, NULL),
(250, 'Schneider Stefan', 234, NULL),
(251, 'Yousefian Faramarz', 235, NULL),
(252, 'Schmid Tobias', 236, NULL),
(253, 'Vollmer Andreas', 236, NULL),
(254, 'Reichherzer Andreas', 236, NULL),
(255, 'Wende Phillip', 236, NULL),
(256, 'Olborth Reinhard', 237, NULL),
(257, 'Retzlaff Oliver', 237, NULL),
(258, 'Weiß Martin', 237, NULL),
(259, 'Gewald Jan', 237, NULL),
(260, 'Rignanese Rocco', 237, NULL),
(261, 'Wilzeck Thomas', 238, NULL),
(262, 'Deininger Ralf', 239, NULL),
(263, 'Hörsch Julian', 239, NULL),
(264, 'Gebhardt Tobias', 239, NULL),
(265, 'Alrefai Ahmad', 239, NULL),
(266, 'Liebl Uli', 240, NULL),
(267, 'Schaich Udo', 240, NULL),
(268, 'Vogt Michael', 240, NULL),
(269, 'Nuñez Mencias Javier', 240, NULL),
(270, 'Kundinger Björn', 241, NULL),
(271, 'Palm Samuel', 241, NULL),
(272, 'Reif Denis', 241, NULL),
(273, 'Reinbold Sten', 241, NULL),
(274, 'Rau Hans', 242, NULL),
(275, 'Herkle Thomas', 243, NULL),
(276, 'Lasi Michael', 243, NULL),
(277, 'Lutz Stefan', 243, NULL),
(278, 'PieprzytzaKarl-Heinz', 243, NULL),
(279, 'Schätz Simon', 243, NULL),
(280, 'Burger Andreas', 243, NULL),
(281, 'Hirsch Norbert', 244, NULL),
(282, 'Kocarjan Andrej', 244, NULL),
(283, 'Aman Alex', 245, NULL),
(284, 'Hampp Christian', 245, NULL),
(285, 'Häuseler Rolf', 245, NULL),
(286, 'Martin Jürgen', 245, NULL),
(287, 'Schmutz Sonja', 245, NULL),
(288, 'Zettler Martina', 245, NULL),
(289, 'Bauer Peter', 246, NULL),
(290, 'Lepple Wolfgang', 246, NULL),
(291, 'Orttmann Björn', 247, NULL),
(292, 'Thiemann Frank', 247, NULL),
(293, 'Gruber Hubert', 248, NULL),
(294, 'Mußotter Lara', 248, NULL),
(295, 'Holzapfel Lars', 249, NULL),
(296, 'Frey Nadine', 249, NULL),
(297, 'Rief Lisa', 249, NULL),
(298, 'Vertrieb Kirche', 249, NULL),
(299, 'Vertriebsleiter Kirchen', 249, NULL),
(300, 'Endreß Jochen', 250, NULL),
(301, 'Barthold Reiner', 251, NULL),
(302, 'Buschhaus Ulric', 251, NULL),
(303, 'Tipp Carina', 252, NULL),
(304, 'Grescher Jochen', 252, NULL),
(305, 'Abaigar Patrick', 252, NULL),
(306, 'Frank Mathias', 253, NULL),
(307, 'Schaffer Tobias', 253, NULL),
(308, 'Volkmann Carsten', 253, NULL),
(309, 'Raufer Patrick', 253, NULL),
(310, 'Greschner Jochen', 253, NULL),
(311, 'Mahle Andreas', 253, NULL),
(312, 'Hegele Florian', 253, NULL),
(313, 'Rusch Andre', 253, NULL),
(314, 'Boehnke Sebastian', 254, NULL),
(315, 'Miller Elke', 254, NULL),
(316, 'Wilken Andrea', 255, NULL),
(317, 'Miller Elke', 255, NULL),
(318, 'Rizzo Maria', 256, NULL),
(319, 'Fibian-Azarbakhsh Monique', 256, NULL),
(320, 'Enhas Duran', 256, NULL),
(321, 'Schardt Michael', 257, NULL),
(322, 'Wölfli Markus', 257, NULL),
(323, 'Ickler Dirk', 257, NULL),
(324, 'Bulang Thomas', 257, NULL),
(325, 'Rust Linda Sofie', 257, NULL),
(326, 'Lutz Reinhold', 258, NULL),
(327, 'Bodenmüller Anja', 259, NULL),
(328, 'Möller Martin', 259, NULL),
(329, 'Urban Holger', 259, NULL),
(330, 'Horic Anela', 259, NULL),
(331, 'Böhm Kurt', 260, NULL),
(332, 'Millan David', 260, NULL),
(333, 'Rothe Micheal', 260, NULL),
(334, 'Wittmann Marcel', 260, NULL),
(335, 'Heinz Gernot', 261, NULL),
(336, 'Mattl Sylvia', 261, NULL),
(337, 'Wünschmann Günther', 261, NULL),
(338, 'Brachmann Mario', 261, NULL),
(339, 'Jäschke Olivia', 262, NULL),
(340, 'Haase Sabine', 262, NULL),
(341, 'Wiescholek Karolina', 263, NULL),
(342, 'Sickor Melanie', 263, NULL),
(343, 'Baumbast Christian', 263, NULL),
(344, 'Vögele Petra', 263, NULL),
(345, 'Bauer Oana', 264, NULL),
(346, 'Sfärlea Alice', 264, NULL),
(347, 'Schindler Christine', 265, NULL),
(348, 'Apprich Melanie', 265, NULL),
(349, 'Sezairi Adis', 266, NULL),
(350, 'Mailach Volker', 266, NULL),
(351, 'Rose Peter', 267, NULL),
(352, 'Weber Peter', 267, NULL),
(353, 'Pascal Kirschbaum', 267, NULL),
(354, 'Maibach Monika', 268, NULL),
(355, 'Knappe Birgit', 268, NULL),
(356, 'Hesser Mike', 269, NULL),
(357, 'Lutzenberger Lukas', 269, NULL),
(358, 'Werner Benjamin', 269, NULL),
(359, 'Bulmahn Mark', 270, NULL),
(360, 'Struck Jörn', 270, NULL),
(361, 'Menendez Jesus', 271, NULL),
(362, 'Heinz Peter', 272, NULL),
(363, 'Paulmaier Daniel', 272, NULL),
(364, 'Nagi Steffen', 272, NULL),
(365, 'Werz Christian', 273, NULL),
(366, 'Zanker Jochen', 273, NULL),
(367, 'Zilles Timon', 273, NULL),
(368, 'Hoffmann Jakob', 274, NULL),
(369, 'Horrer Hartmut', 274, NULL),
(370, 'Mohr Marco', 274, NULL),
(371, 'Strohm Kevin', 274, NULL),
(372, 'Knappe Martin', 274, NULL),
(373, 'Kutsche Jutta', 275, NULL),
(374, 'Wilken Folkert', 276, NULL),
(375, 'Chandran Meera', 277, NULL),
(376, 'Huber Valerie', 277, NULL),
(377, 'Lemmle Thomas', 277, NULL),
(378, 'Menz Patric', 277, NULL),
(379, 'Metin Gökhan', 277, NULL),
(380, 'Fernando Fabiane', 277, NULL),
(381, 'Lettner Dennis', 277, NULL),
(382, 'Loth Felix', 277, NULL),
(383, 'Rein Johannes', 277, NULL),
(384, 'Spann Andreas', 277, NULL),
(385, 'Stark Manuel', 277, NULL),
(386, 'Häfele Sandra', 277, NULL),
(387, 'Mayer Patricia', 277, NULL),
(388, 'Rau Nico', 277, NULL),
(389, 'Keil Maurice', 277, NULL),
(390, 'Spister Natalie', 277, NULL),
(391, 'Hosak Miriam', 277, NULL),
(392, 'Hiebeler Vanessa', 277, NULL),
(393, 'Jenkle Frank', 278, NULL),
(394, 'Gütinger Liane', 279, NULL),
(395, 'Kisselmann Oliver', 279, NULL),
(396, 'Kneißle Claudia', 279, NULL),
(397, 'Berg Denise', 279, NULL),
(398, 'Hanisch Nataly', 279, NULL),
(399, 'Dr. Vogt Jörg', 280, NULL),
(400, 'Hiller Silke', 281, NULL),
(401, 'Mohr Kristina', 281, NULL),
(402, 'Weltle Robert', 281, NULL),
(403, 'Anhorn Reiner', 281, NULL),
(404, 'Straub Beatrix', 282, NULL),
(405, 'Sommer Jessica', 283, NULL),
(406, 'Bonrnemann Pia', 283, NULL),
(407, 'Aich Silke', 284, NULL),
(408, 'Hess Tonio', 285, NULL);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `rank`
--

CREATE TABLE `rank` (
  `name` varchar(100) CHARACTER SET utf8 NOT NULL,
  `permissions` varchar(500) CHARACTER SET utf8 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `rank`
--

INSERT INTO `rank` (`name`, `permissions`) VALUES
('developer', '*'),
('sql', 'sql;*'),
('user', NULL);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `raum`
--

CREATE TABLE `raum` (
  `id` int(11) NOT NULL,
  `name` varchar(100) CHARACTER SET utf8 NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `raum`
--

INSERT INTO `raum` (`id`, `name`) VALUES
(183, '033'),
(184, '034'),
(185, '037'),
(186, '038'),
(187, '039'),
(188, '044'),
(189, '126'),
(190, '140'),
(191, '141'),
(192, '142'),
(193, '144'),
(194, '145'),
(195, '147'),
(196, '149'),
(197, '155'),
(198, '156'),
(199, '158'),
(200, '159'),
(201, '160'),
(202, '160a'),
(203, '164a'),
(204, '166'),
(205, '203'),
(206, '204'),
(207, '205'),
(208, '208'),
(209, '210'),
(210, '211'),
(211, '212'),
(212, '213'),
(213, '214'),
(214, '216'),
(215, '217'),
(216, '218'),
(217, '219'),
(218, '220'),
(219, '221'),
(220, '222'),
(221, '223'),
(222, '227'),
(223, '228'),
(224, '230'),
(225, '231'),
(226, '234'),
(227, '235'),
(228, '236'),
(229, '237'),
(230, '238'),
(231, '239'),
(232, '240'),
(233, '241'),
(234, '242'),
(235, '243'),
(236, '244'),
(237, '245'),
(238, '248'),
(239, '249'),
(240, '250'),
(241, '255'),
(242, '256'),
(243, '258'),
(244, '259'),
(245, '260'),
(246, '261'),
(247, '262'),
(248, '264'),
(249, '268'),
(250, '269a'),
(251, '269b'),
(252, '328'),
(253, '329'),
(254, '330'),
(255, '331'),
(256, '332'),
(257, '333'),
(258, '335'),
(259, '336'),
(261, '337'),
(260, '337a'),
(262, '339'),
(263, '342'),
(264, '343'),
(265, '345'),
(266, '346'),
(267, '347'),
(268, '348'),
(269, '349'),
(270, '350'),
(271, '351'),
(272, '354'),
(273, '355'),
(274, '356'),
(275, '358'),
(276, '359'),
(277, '402'),
(278, '404'),
(279, '405'),
(280, '406'),
(281, '407'),
(282, '408'),
(283, '409'),
(285, '410\n'),
(284, '410');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(100) CHARACTER SET utf8 NOT NULL,
  `password` varchar(1000) CHARACTER SET utf8 NOT NULL,
  `rank` varchar(500) CHARACTER SET utf8 NOT NULL DEFAULT 'user',
  `1malPasswort` varchar(1000) CHARACTER SET utf8 DEFAULT NULL,
  `1malPasswortAblauf` datetime DEFAULT NULL,
  `salt` varchar(1000) CHARACTER SET utf8 NOT NULL,
  `isVerified` int(1) NOT NULL DEFAULT 0,
  `verificationToken` varchar(500) CHARACTER SET utf8 DEFAULT NULL,
  `verificationTokenExpires` datetime DEFAULT NULL,
  `einstellungen_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `user`
--

INSERT INTO `user` (`id`, `name`, `password`, `rank`, `1malPasswort`, `1malPasswortAblauf`, `salt`, `isVerified`, `verificationToken`, `verificationTokenExpires`, `einstellungen_id`) VALUES
(38, 'sql', '08698896e3139ca73dc7844802dd53f4a8cbd74cbf3eed21da14252f6d4849bfedc50ac45cf0c2a6e7825631e6cd07b204d801517f0034557cb30063005bdb7277b500427623085d686c6efd009825bbb57f254d39617d6275cd50e101e46be0c2c9879f9f515538be62599af7ee5172b8dcb7ef8ef438bd3282feb493d55b809096b099dd24486730852607e3781ec36a66ef05e568177708114866c5b1cf1c686da48562b4f121e32131cd5d3d44238966aec4ce44f87a1654eec4918d1316ff826d3485fab398d338d9a2de8ec4f84b1cc5c36bcc329fbf00a7c98dd499f2855903d1d418232c3e947086e3f219b42ab119ee8d076850d4902203a7cf5e63892946abb2a25906218c6368a1392430e013f97152c3ce5ef0a057961082b6c500dc7116dedfba1d73f032dc0fb4294860158839e0602c285ff3ab637588f3dfd9c13d0bd0f57e7154f26c901f2fed4ed69635d6dc8af557c52f7901adc3d1a5262edcc2b72032fdd193d3192c8b1be0f793d48e6064c73c4f0c131a6dc6cba76f13b466c4152a8f92f3611f9acbc5330cd0314bb5959a4621d31b006af73c88670f1ad645af046ee4f474a6071ba7bc8d29a19f5867f9423ee1c2c7cd8987e3f1fa5497771c6e51f0d1f72bfc6a1c173e9500f4d24c737255aa3b4e0e9885de84fd459b012f8bfccf9ee858c3de6d5ddce53154', 'sql', NULL, NULL, ':GS($tpJfZAs->4jr_MfKOf6Hj;<3.Z6K477TwhoU^7C/R!SMc[r,7zN=g.°My!GGYpI²XOn)m2/R<_psIR8(>J9c^)dwueB37Q!)0B&c§B:y7.)uVtDP)RlAF5S3zE<', 1, '', NULL, 0),
(40, 'Benjamin.Werner@wilken.de', '3cea6c3f64e1df0588973f07fa0ea27955fe15665f9cd51decbc3d8bee40774271e1322fce33db5eeeab9612f708408e5a136463241af350f5343cba42100bdc7f4cb048345d153d3c2e8ea4ffb0dfe9fcc6c8ac4d43f9e93b95f37da21b4c75490e50edfb1829189628835933af25abfc5ad439cb5d2037d01e89b7ab6c86768b70ef122f42276dd3fd7e093461d88cd8bb0b2f46cb49b578c682e8beb92af6ac17d460f35ac68dbb41037a7aa06dbcdc4b620e27aa5afd759f02b3960b2794170b73ffaa572a821f8b879036b3fe71e4779af009f371a138d63f28a807d36baf95a1541a6344238c1adc2fb246b3f967de92315008758ee8385f599ade117d23116683fccdfa50ade114b1253e575e823beec325ecb34f84aeae5960a9f27bce36763ab28bd537eba52dc99e68a1982bda8ff0e093efe17df382c3321585639687e642ad7408a5bf20fcbf04b2875199172d0148fa136486f873b9bf4663c97ba273838f5216a464389c9193d2aec1f72d9515813266f7766b47ce1134cc967fa75b36ebf0b3c936cb25e73a8cf2efd2109eed7c0ac0e28508a3748accd78ee6bf00bb8b99c8ce7641d3933112082ca5a6610cc1701f05c617094f999b56914700c1540c5729c929d2c7945b4e7e965f21b3e1be4d01dd84b8414be74028ff284a61a1a8a568b890698a2ede95967c8c896094', 'developer', NULL, NULL, 'MThTZ(i0JM=txwMI%L.9[^%-5>K_vNnHZ,xUkTv.swv=k6>&9ytGxy2pNQw:)Eu5$yEZb1Bdp?(V³)5A°/x4r³1V=-eswY,QRv?)5m³§l:lsoGmVgFunqxJt³P(MPEBc', 1, '', '2020-09-23 15:34:20', 0),
(43, 'Michael.stuehle@wilken.de', 'a01e830dfbf3cb7e2d8201021036a738401b3dc755bd35c15c0fa4afd6b6882113401e6a44b1254512acd277b544b4e5b388aca6fce373af51af6ccb796c7fb17da047e32ee8be6e4e4a51962d5a39c0f649d78b187a4b825520099e35700c70d756cb6a6c02133f576ae3ef2d57471370380dad8aad6a3f2d8b5a281b4dcf9af00a751eced7448951eb21f06a691a2749cfbeccc9e438672e7325c19beb0376375f9c4488ef5f40936806485455556171e4d058208d7f9f819bf23e1c6970507342b9eeef5686e0b2513dd3fa889203a8c749cdcd132a5e51a4bad4e05488f627ac608da4dd51a171df5752aa3c60486c6ddc8f0b4c07ad47f0a03e584904e0467f3589a3a949bc85b486ba2232dff4f547bb7a74a233b97a0dc7913a646072c09d60cc43512fd9e6c2bf0520d7b1bff04ce5979b7558cd47d3adc7974739bce472b69816af520dc130e86f4d63890cc8c841e61d1b258332bea4f078841fa5b01ccf5b291f54d3be753e8dee51280bd85b689d2ebc3d166a45608f9096ee5bbfd40b74e1c75b52ae2921c0652b54635bdf1ba1f891a42c4352af193f798ceb82bd0e60c8bfbc9318731661344ecd647e143a377a140e9b593a98032d3cffe4a9e916df0a4adb883ed8787c3f2fa303e890a13e452b63b4b43e2d02adba42afba5f5bfdade017233a8f0c35da793af79d1ecd0d', 'user', NULL, NULL, 'AQcJ°_I4R-lQg:HYo1$t<F,qj,i$dDZcYXO[p5o8RKt9W:z§NmmrP<B,3EDh,R9r)|6/su1^oV,Ou:c³65PY$/IJQmH4U]/86DY_<l³/8lrw³§0>4GyZU§6LCfD,<Ny8', 1, 'U8YHJd9BUeBzsUIv8veI', '2020-09-26 08:20:18', 0);

--
-- Trigger `user`
--
DELIMITER $$
CREATE TRIGGER `verificationTokenExpireDateTrigger` BEFORE INSERT ON `user` FOR EACH ROW SET
    NEW.verificationTokenExpires = DATE_ADD(NOW() ,INTERVAL 1 DAY)
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `verificationTokenExpireDateUpdateTrigger` BEFORE UPDATE ON `user` FOR EACH ROW Begin 
    IF !(NEW.verificationToken <=> OLD.verificationToken) THEN
    	Set NEW.verificationTokenExpires = DATE_ADD(NOW(), INTERVAL 1 DAY);
    END IF;
END
$$
DELIMITER ;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `einstellungen`
--
ALTER TABLE `einstellungen`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_einstellungen` (`user_id`);

--
-- Indizes für die Tabelle `mitarbeiter`
--
ALTER TABLE `mitarbeiter`
  ADD PRIMARY KEY (`id`),
  ADD KEY `raum_id` (`raum_id`);

--
-- Indizes für die Tabelle `rank`
--
ALTER TABLE `rank`
  ADD PRIMARY KEY (`name`);

--
-- Indizes für die Tabelle `raum`
--
ALTER TABLE `raum`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indizes für die Tabelle `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rank_name` (`rank`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `einstellungen`
--
ALTER TABLE `einstellungen`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT für Tabelle `mitarbeiter`
--
ALTER TABLE `mitarbeiter`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=409;

--
-- AUTO_INCREMENT für Tabelle `raum`
--
ALTER TABLE `raum`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=286;

--
-- AUTO_INCREMENT für Tabelle `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `einstellungen`
--
ALTER TABLE `einstellungen`
  ADD CONSTRAINT `user_einstellungen` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints der Tabelle `mitarbeiter`
--
ALTER TABLE `mitarbeiter`
  ADD CONSTRAINT `raum_id` FOREIGN KEY (`raum_id`) REFERENCES `raum` (`id`);

--
-- Constraints der Tabelle `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `rank_name` FOREIGN KEY (`rank`) REFERENCES `rank` (`name`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
