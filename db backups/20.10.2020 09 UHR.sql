-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 20. Okt 2020 um 09:47
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
  `dark_mode` tinyint(1) NOT NULL DEFAULT 0,
  `raum_id` int(100) NOT NULL,
  `string` varchar(100) NOT NULL DEFAULT '',
  `integerValue` int(10) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `einstellungen`
--

INSERT INTO `einstellungen` (`id`, `dark_mode`, `raum_id`, `string`, `integerValue`) VALUES
(5, 0, 183, 'test3', 321),
(6, 0, 183, '', 1),
(58, 0, 183, '', 0);

--
-- Trigger `einstellungen`
--
DELIMITER $$
CREATE TRIGGER `mitarbeiter_user_raumSync` BEFORE UPDATE ON `einstellungen` FOR EACH ROW BEGIN
IF !(OLD.raum_id <=> NEW.raum_id) Then 
    Update mitarbeiter set raum_id =			NEW.raum_id where mitarbeiter.id = 
    (select	mitarbeiter_id from user where einstellungen_id = NEW.id);
END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `mitarbeiter`
--

CREATE TABLE `mitarbeiter` (
  `id` int(11) NOT NULL,
  `name` varchar(100) CHARACTER SET utf8 NOT NULL,
  `raum_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `mitarbeiter`
--

INSERT INTO `mitarbeiter` (`id`, `name`, `raum_id`) VALUES
(47, 'Romahn Nicola', 183),
(48, 'Rudner Jochen', 183),
(49, 'Tomschi Christine', 184),
(50, 'Kümmel Mark', 185),
(51, 'Oczenaschek Gerd', 184),
(52, 'Petkov Momchil', 185),
(53, 'Reidel Siegfried', 185),
(54, 'Schwenkschuster Thomas', 185),
(55, 'Topar Benjamin', 185),
(56, 'Günzer Martin', 185),
(57, 'Kopanski Marek', 186),
(58, 'Schmidt Konstantin', 186),
(59, 'Süßenbach Klaus', 186),
(60, 'Pollak Julian', 186),
(61, 'Al Ozoun Mohammed', 186),
(62, 'Häußler Michael', 187),
(63, 'Gündüzer Emre', 187),
(64, 'Pohl Raimund', 187),
(65, 'Grimm Natascha', 187),
(66, 'Feil Andreas', 188),
(67, 'Schmidt Lukas', 188),
(68, 'Sehne Stefan', 188),
(69, 'Macke-Schurr Luca', 188),
(70, 'Weber Kai', 188),
(71, 'Azevedo-Braun Tanja', 189),
(72, 'Hergert Alina', 189),
(73, 'Koch Roswitha', 189),
(74, 'Schalk Renate', 189),
(75, 'Scheible Waltraud', 189),
(76, 'Vitek Kerstin', 189),
(77, 'Hinkelmann Rainer', 190),
(78, 'Köpf Harald', 190),
(79, 'Bohnacker Julia', 191),
(80, 'Schmutz Winfried', 191),
(81, 'Hense Christina', 191),
(82, 'Eisenlauer Phillip', 191),
(83, 'Hegele Florian', 191),
(84, 'Geiger Daniela', 191),
(85, 'Kempe Ebenhardt', 191),
(86, 'Booms Benjamin', 191),
(87, 'Loidold Dietmar', 192),
(88, 'Abazibra Senad', 192),
(89, 'Müller Dominik', 192),
(90, 'DRmic Ante', 193),
(91, 'Frey Simon', 193),
(92, 'Schott Carsten', 194),
(93, 'Fiedler Werner', 194),
(94, 'Sabella Daniela', 194),
(95, 'Peter Leon', 194),
(96, 'JaskulaSvetlana', 194),
(97, 'Pudrycki Thomas', 195),
(98, 'Schenk Andreas', 195),
(99, 'Böhme Wolfgang Kutsche Uwe', 195),
(100, 'Reinardt Michael', 195),
(101, 'Lichtblau Kirstin', 196),
(102, 'Reinold Christof', 196),
(103, 'Merl Witold', 197),
(104, 'Gruß Berthold', 197),
(105, 'Cosmai Francesca', 198),
(106, 'Hargesheimer Jessica', 198),
(107, 'Karger Jan', 198),
(108, 'Manke Tugba', 198),
(109, 'Simmendinger Vanessa', 198),
(110, 'Schießler Maximilian', 199),
(111, 'Konkel Tanja', 200),
(112, 'Schirmer Katrin', 200),
(113, 'Topar Maria', 200),
(114, 'Kalweit Viktoria', 201),
(115, 'Kenner Marina', 201),
(116, 'Kutzner Andrea', 201),
(117, 'Neher Olga', 201),
(118, 'Weber Katja', 201),
(119, 'Tvalavadze Tina', 202),
(120, 'Rienas Patrick', 202),
(121, 'Välilä Katinka', 202),
(122, 'FesselerMelanie', 203),
(123, 'Wachter Lisa', 203),
(124, 'Wolf Michaela', 203),
(125, 'Feil Claudia', 203),
(126, 'Bockstaller Jacqueline', 204),
(127, 'Mack Corina', 204),
(128, 'Müller Oliver', 204),
(129, 'Salzgeber Henrik', 204),
(130, 'Volk Anna', 204),
(131, 'Füller Birgit', 205),
(132, 'Brix Marcel', 205),
(133, 'Ding Charlotte', 205),
(134, 'Riedlinger Klaus', 205),
(135, 'Bartel Sandra', 206),
(136, 'Hollerbach Nicole', 206),
(137, 'Hopf Steve', 206),
(138, 'Maiser Melina', 206),
(139, 'Gorickic Mara', 206),
(140, 'Simon Larissa', 206),
(141, 'Schwärzel Dominik', 207),
(142, 'Klaus Busch', 208),
(143, 'Wolsky Andrea', 208),
(144, 'Raith Kathrin', 208),
(145, 'Schulte-Rentrop Peter', 209),
(146, 'von TomkewitschMichael', 209),
(147, 'Hirschkorn Dieter', 209),
(148, 'Maisinger Eduard', 209),
(149, 'HenkelThomas', 210),
(150, 'Reincke Björn', 210),
(151, 'Weber Marc', 210),
(152, 'Reimann Michael', 210),
(153, 'Unrau Christian', 210),
(154, 'WittlingerChristian', 210),
(155, 'Samatin Daniel', 211),
(156, 'Reinert Dominik', 211),
(157, 'Mann Tobias', 211),
(158, 'Gnann Yanick', 212),
(159, 'Klich Patrick', 212),
(160, 'Neß Patrick', 212),
(161, 'Oesterle Tobias', 212),
(162, 'Pohle Fabian', 212),
(163, 'Straub Thomas', 212),
(164, 'Dr. Radloff Sophia', 212),
(165, 'Viola Frank', 212),
(166, 'Brunner André', 213),
(167, 'Volz Andreas', 213),
(168, 'Dill Anna', 214),
(169, 'Lupascu Julia', 214),
(170, 'Fiedler Swen', 215),
(171, 'Gillich Gerd', 215),
(172, 'Büchele Nico', 216),
(173, 'Dil Anna', 216),
(174, 'Hertling Benjamin', 216),
(175, 'Lechner Frank', 216),
(176, 'von Linde-Suden Joachim Dr.', 216),
(177, 'Langer Roy', 216),
(178, 'Braun Kevin', 216),
(179, 'Haas Christin', 216),
(180, 'Granacher Stefan', 217),
(181, 'Steinkamp Kai', 217),
(182, 'Fritsche Martina', 218),
(183, 'Hoermann Friedrich', 218),
(184, 'Kröner Christine', 218),
(185, 'Pecher Tobias Dr.', 218),
(186, 'Runow Silvana', 218),
(187, 'Schäfer Alexander', 218),
(188, 'Weidle Helmut', 218),
(189, 'Maldfeld Michael', 219),
(190, 'Schustermann Elisaveta', 219),
(191, 'Fast Robert', 220),
(192, 'Weigand alexander', 220),
(193, 'Neher Christian', 221),
(194, 'Volz Edwin', 221),
(195, 'Deutzmann Ralf', 222),
(196, 'Griesinger Sandra', 222),
(197, 'Kirschmann Markus', 222),
(198, 'Bem Brook', 222),
(199, 'Stifter Tobias', 223),
(200, 'Kiedaisch Friedemann', 223),
(201, 'Sauter Martina', 223),
(202, 'Seyboth Simon', 223),
(203, 'Alzuabidi Mustafa', 223),
(204, 'Schrempp Michael', 223),
(206, 'Hillmann Barbara', 224),
(207, 'Naß Sascha', 224),
(208, 'Rauh Martin', 224),
(209, 'Hewer Alexander', 224),
(210, 'Hausladen Andreas', 225),
(211, 'Miao Yi', 225),
(212, 'Simonsen Jan Peter', 225),
(213, 'Maile Tim', 225),
(214, 'Kirchner Klaus-Pete', 226),
(215, 'Stodko Rico', 226),
(216, 'Brugger Helmut', 227),
(217, 'Honold Annette', 227),
(218, 'Bartel Gordon', 228),
(219, 'Blessing', 228),
(220, 'Lambert Hartmut', 228),
(221, 'Eckstein Myrjam', 229),
(222, 'Kamp Manira', 229),
(223, 'Kienleitner Patrizia', 229),
(224, 'Mack Bernd', 229),
(225, 'Mödinger Marc', 229),
(226, 'Schnitzler Christof KorosZsolt', 229),
(227, 'Pflaum Alexander', 230),
(228, 'Schmuck Helmuth', 230),
(229, 'Blessing Michael', 230),
(230, 'Sommerfeld Merlin', 230),
(231, 'Nerbas Daniel', 230),
(232, 'Jankovics Helmut', 231),
(233, 'Offenloch Holger', 231),
(234, 'Szczesny Brigitte', 231),
(235, 'Weber Anja', 232),
(236, 'Raquet André', 232),
(237, 'Raubacher Roland', 232),
(238, 'Arnold Simon', 232),
(239, 'Grandjean Arntraut', 233),
(240, 'Hummel Peter', 233),
(241, 'Scharf René', 233),
(242, 'Schulze-Brüninghoff Halil', 233),
(243, 'Sieber Bernhard', 233),
(244, 'Ellroth Nadja', 233),
(245, 'Pourhassanyami Turan', 233),
(246, 'Anvari Saman', 234),
(247, 'Mayer Klaus', 234),
(248, 'Sailer Sabine', 234),
(249, 'Schenzle Hubert', 234),
(250, 'Schneider Stefan', 234),
(251, 'Yousefian Faramarz', 235),
(252, 'Schmid Tobias', 236),
(253, 'Vollmer Andreas', 236),
(254, 'Reichherzer Andreas', 236),
(255, 'Wende Phillip', 236),
(256, 'Olborth Reinhard', 237),
(257, 'Retzlaff Oliver', 237),
(258, 'Weiß Martin', 237),
(259, 'Gewald Jan', 237),
(260, 'Rignanese Rocco', 237),
(261, 'Wilzeck Thomas', 238),
(262, 'Deininger Ralf', 239),
(263, 'Hörsch Julian', 239),
(264, 'Gebhardt Tobias', 239),
(265, 'Alrefai Ahmad', 239),
(266, 'Liebl Uli', 240),
(267, 'Schaich Udo', 240),
(268, 'Vogt Michael', 240),
(269, 'Nuñez Mencias Javier', 240),
(270, 'Kundinger Björn', 241),
(271, 'Palm Samuel', 241),
(272, 'Reif Denis', 241),
(273, 'Reinbold Sten', 241),
(274, 'Rau Hans', 242),
(275, 'Herkle Thomas', 243),
(276, 'Lasi Michael', 243),
(277, 'Lutz Stefan', 243),
(278, 'PieprzytzaKarl-Heinz', 243),
(279, 'Schätz Simon', 243),
(280, 'Burger Andreas', 243),
(281, 'Hirsch Norbert', 244),
(282, 'Kocarjan Andrej', 244),
(283, 'Aman Alex', 245),
(284, 'Hampp Christian', 245),
(285, 'Häuseler Rolf', 245),
(286, 'Martin Jürgen', 245),
(287, 'Schmutz Sonja', 245),
(288, 'Zettler Martina', 245),
(289, 'Bauer Peter', 246),
(290, 'Lepple Wolfgang', 246),
(291, 'Orttmann Björn', 247),
(292, 'Thiemann Frank', 247),
(293, 'Gruber Hubert', 248),
(294, 'Mußotter Lara', 248),
(295, 'Holzapfel Lars', 249),
(296, 'Frey Nadine', 249),
(297, 'Rief Lisa', 249),
(298, 'Vertrieb Kirche', 249),
(299, 'Vertriebsleiter Kirchen', 249),
(300, 'Endreß Jochen', 250),
(301, 'Barthold Reiner', 251),
(302, 'Buschhaus Ulric', 251),
(303, 'Tipp Carina', 252),
(304, 'Grescher Jochen', 252),
(305, 'Abaigar Patrick', 252),
(306, 'Frank Mathias', 253),
(307, 'Schaffer Tobias', 253),
(308, 'Volkmann Carsten', 253),
(309, 'Raufer Patrick', 253),
(310, 'Greschner Jochen', 253),
(311, 'Mahle Andreas', 253),
(312, 'Hegele Florian', 253),
(313, 'Rusch Andre', 253),
(314, 'Boehnke Sebastian', 254),
(315, 'Miller Elke', 254),
(316, 'Wilken Andrea', 255),
(317, 'Miller Elke', 255),
(318, 'Rizzo Maria', 256),
(319, 'Fibian-Azarbakhsh Monique', 256),
(320, 'Enhas Duran', 256),
(321, 'Schardt Michael', 257),
(322, 'Wölfli Markus', 257),
(323, 'Ickler Dirk', 257),
(324, 'Bulang Thomas', 257),
(325, 'Rust Linda Sofie', 257),
(326, 'Lutz Reinhold', 258),
(327, 'Bodenmüller Anja', 259),
(328, 'Möller Martin', 259),
(329, 'Urban Holger', 259),
(330, 'Horic Anela', 259),
(331, 'Böhm Kurt', 260),
(332, 'Millan David', 260),
(333, 'Rothe Micheal', 260),
(334, 'Wittmann Marcel', 260),
(335, 'Heinz Gernot', 261),
(336, 'Mattl Sylvia', 261),
(337, 'Wünschmann Günther', 261),
(338, 'Brachmann Mario', 261),
(339, 'Jäschke Olivia', 262),
(340, 'Haase Sabine', 262),
(341, 'Wiescholek Karolina', 263),
(342, 'Sickor Melanie', 263),
(343, 'Baumbast Christian', 263),
(344, 'Vögele Petra', 263),
(345, 'Bauer Oana', 264),
(346, 'Sfärlea Alice', 264),
(347, 'Schindler Christine', 265),
(348, 'Apprich Melanie', 265),
(349, 'Sezairi Adis', 266),
(350, 'Mailach Volker', 266),
(351, 'Rose Peter', 267),
(352, 'Weber Peter', 267),
(353, 'Pascal Kirschbaum', 267),
(354, 'Maibach Monika', 268),
(355, 'Knappe Birgit', 268),
(356, 'Hesser Mike', 269),
(357, 'Lutzenberger Lukas', 269),
(358, 'Werner Benjamin', 269),
(359, 'Bulmahn Mark', 270),
(360, 'Struck Jörn', 270),
(361, 'Menendez Jesus', 271),
(362, 'Heinz Peter', 272),
(363, 'Paulmaier Daniel', 272),
(364, 'Nagi Steffen', 272),
(365, 'Werz Christian', 273),
(366, 'Zanker Jochen', 273),
(367, 'Zilles Timon', 273),
(368, 'Hoffmann Jakob', 274),
(369, 'Horrer Hartmut', 274),
(370, 'Mohr Marco', 274),
(371, 'Strohm Kevin', 274),
(372, 'Knappe Martin', 274),
(373, 'Kutsche Jutta', 275),
(374, 'Wilken Folkert', 276),
(375, 'Chandran Meera', 277),
(376, 'Huber Valerie', 277),
(377, 'Lemmle Thomas', 277),
(378, 'Menz Patric', 277),
(379, 'Metin Gökhan', 277),
(380, 'Fernando Fabiane', 277),
(381, 'Lettner Dennis', 277),
(382, 'Loth Felix', 277),
(383, 'Rein Johannes', 277),
(384, 'Spann Andreas', 277),
(385, 'Stark Manuel', 277),
(386, 'Häfele Sandra', 277),
(387, 'Mayer Patricia', 277),
(388, 'Rau Nico', 277),
(389, 'Keil Maurice', 277),
(390, 'Spister Natalie', 277),
(391, 'Hosak Miriam', 277),
(392, 'Hiebeler Vanessa', 277),
(393, 'Jenkle Frank', 278),
(394, 'Gütinger Liane', 279),
(395, 'Kisselmann Oliver', 279),
(396, 'Kneißle Claudia', 279),
(397, 'Berg Denise', 279),
(398, 'Hanisch Nataly', 279),
(399, 'Dr. Vogt Jörg', 280),
(400, 'Hiller Silke', 281),
(401, 'Mohr Kristina', 281),
(402, 'Weltle Robert', 281),
(403, 'Anhorn Reiner', 281),
(404, 'Straub Beatrix', 282),
(405, 'Sommer Jessica', 283),
(406, 'Bonrnemann Pia', 283),
(407, 'Aich Silke', 284),
(408, 'Hess Tonio', 284),
(440, 'stuehle michael', 183);

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
(284, '410');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `serverlog`
--

CREATE TABLE `serverlog` (
  `id` int(11) NOT NULL,
  `aktionstyp` varchar(100) CHARACTER SET utf8 NOT NULL,
  `info` varchar(1000) CHARACTER SET utf8 NOT NULL,
  `ip` varchar(20) CHARACTER SET utf8 DEFAULT NULL,
  `timestamp` timestamp(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `serverlog`
--

INSERT INTO `serverlog` (`id`, `aktionstyp`, `info`, `ip`, `timestamp`) VALUES
(1, 'anmeldung', 'user: sql hat sich angemeldet', NULL, '2020-10-15 12:51:52.370513'),
(2, 'anmeldung', 'user: sql hat sich angemeldet', NULL, '2020-10-15 12:52:21.208785'),
(3, 'anmeldung', 'user: sql hat sich angemeldet', NULL, '2020-10-15 12:58:09.155376'),
(4, 'abmeldung', 'user: sql hat sich abgemeldet', NULL, '2020-10-15 12:58:10.701028'),
(5, 'anmeldung', 'user: sql hat sich angemeldet', NULL, '2020-10-15 13:03:03.225632'),
(6, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-15 13:03:56.030659'),
(7, 'abmeldung', 'user: sql hat sich abgemeldet', '::ffff:10.1.11.104', '2020-10-15 13:03:57.350645'),
(8, 'fehler', 'user: Michael.stuehle@wilken.de konnte nicht angelegt werden', NULL, '2020-10-16 05:56:22.575543'),
(9, 'fehler', 'user: Michael.stuehle@wilken.de konnte nicht angelegt werden\r\nError: ER_PARSE_ERROR: You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near \'\' at line 1', NULL, '2020-10-16 05:58:14.893516'),
(10, 'fehler', 'null\r\nundefined', NULL, '2020-10-16 05:58:14.972901'),
(11, 'registrierung', 'user: Michael.stuehle@wilken.de wurde erfolgreich regsitriert!', '::ffff:10.1.11.104', '2020-10-16 06:03:00.395751'),
(12, 'registrierung', 'user: michael.stuehle@wilken.de wurde erfolgreich regsitriert!', '::ffff:10.1.11.104', '2020-10-16 06:04:52.682047'),
(13, 'verifizierung', 'michael.stuehle@wilken.de wurde verifiziert', '::ffff:10.1.11.104', '2020-10-16 06:06:03.868880'),
(14, 'fehler', 'user: michael.stuehle@wilken.de konnte nicht angelegt werden\r\nError: ER_CANT_UPDATE_USED_TABLE_IN_SF_OR_TRG: Can\'t update table \'mitarbeiter\' in stored function/trigger because it is already used by statement which invoked this stored function/trigger', NULL, '2020-10-16 06:47:49.325330'),
(15, 'fehler', 'null\r\nundefined', NULL, '2020-10-16 06:47:49.378192'),
(16, 'fehler', 'user: Michael.stuehle@wilken.de konnte nicht angelegt werden\r\nError: ER_CANT_UPDATE_USED_TABLE_IN_SF_OR_TRG: Can\'t update table \'mitarbeiter\' in stored function/trigger because it is already used by statement which invoked this stored function/trigger', NULL, '2020-10-16 06:49:00.901679'),
(17, 'fehler', 'null\r\nundefined', NULL, '2020-10-16 06:49:00.922045'),
(18, 'fehler', 'user: Michael.stuehle@wilken.de konnte nicht angelegt werden\r\nError: ER_CANT_UPDATE_USED_TABLE_IN_SF_OR_TRG: Can\'t update table \'mitarbeiter\' in stored function/trigger because it is already used by statement which invoked this stored function/trigger', NULL, '2020-10-16 06:51:43.520426'),
(19, 'fehler', 'null\r\nundefined', NULL, '2020-10-16 06:51:43.535607'),
(20, 'registrierung', 'user: Michael.stuehle@wilken.de wurde erfolgreich regsitriert!', '::ffff:10.1.11.104', '2020-10-16 06:53:17.410629'),
(21, 'fehler', 'user: Michael.stuehle@wilken.de konnte nicht angelegt werden\r\nError: ER_CANT_UPDATE_USED_TABLE_IN_SF_OR_TRG: Can\'t update table \'mitarbeiter\' in stored function/trigger because it is already used by statement which invoked this stored function/trigger', NULL, '2020-10-16 06:55:29.758400'),
(22, 'fehler', 'null\r\nundefined', NULL, '2020-10-16 06:55:29.776241'),
(23, 'fehler', 'user: michael.stuehle@wilken.de konnte nicht angelegt werden\r\nError: ER_CANT_UPDATE_USED_TABLE_IN_SF_OR_TRG: Can\'t update table \'mitarbeiter\' in stored function/trigger because it is already used by statement which invoked this stored function/trigger', NULL, '2020-10-16 07:01:51.414801'),
(24, 'fehler', 'null\r\nundefined', NULL, '2020-10-16 07:01:51.431483'),
(25, 'fehler', 'user: michael.stuehle@wilken.de konnte nicht angelegt werden\r\nError: ER_LOCK_WAIT_TIMEOUT: Lock wait timeout exceeded; try restarting transaction', NULL, '2020-10-16 07:17:45.136473'),
(26, 'fehler', 'user: michael.stuehle@wilken.de konnte nicht angelegt werden\r\nError: ER_LOCK_WAIT_TIMEOUT: Lock wait timeout exceeded; try restarting transaction', NULL, '2020-10-16 07:17:45.147683'),
(27, 'fehler', 'null\r\nundefined', NULL, '2020-10-16 07:17:45.148235'),
(28, 'fehler', 'null\r\nundefined', NULL, '2020-10-16 07:17:45.151148'),
(29, 'fehler', 'null\r\nundefined', NULL, '2020-10-16 07:17:45.148040'),
(30, 'fehler', 'user: michael.stuehle@wilken.de konnte nicht angelegt werden\r\nError: ER_LOCK_WAIT_TIMEOUT: Lock wait timeout exceeded; try restarting transaction', NULL, '2020-10-16 07:17:45.150760'),
(31, 'fehler', 'user: michael.stuehle@wilken.de konnte nicht angelegt werden\r\nError: ER_CANT_UPDATE_USED_TABLE_IN_SF_OR_TRG: Can\'t update table \'mitarbeiter\' in stored function/trigger because it is already used by statement which invoked this stored function/trigger', NULL, '2020-10-16 07:26:28.161285'),
(32, 'fehler', 'null\r\nundefined', NULL, '2020-10-16 07:26:28.238818'),
(33, 'fehler', 'user: Michael.stuehle@wilken.de konnte nicht angelegt werden\r\nError: ER_CANT_UPDATE_USED_TABLE_IN_SF_OR_TRG: Can\'t update table \'mitarbeiter\' in stored function/trigger because it is already used by statement which invoked this stored function/trigger', NULL, '2020-10-16 07:27:55.882542'),
(34, 'fehler', 'null\r\nundefined', NULL, '2020-10-16 07:27:55.924911'),
(35, 'fehler', 'user: Michael.stuehle@wilken.de konnte nicht angelegt werden\r\nError: ER_CANT_UPDATE_USED_TABLE_IN_SF_OR_TRG: Can\'t update table \'mitarbeiter\' in stored function/trigger because it is already used by statement which invoked this stored function/trigger', NULL, '2020-10-16 07:37:44.346424'),
(36, 'fehler', 'null\r\nundefined', NULL, '2020-10-16 07:37:44.384162'),
(37, 'fehler', 'Error: ER_NO_REFERENCED_ROW_2: Cannot add or update a child row: a foreign key constraint fails (`wilken_maps`.`mitarbeiter`, CONSTRAINT `mitarbeiter_raum` FOREIGN KEY (`raum_id`) REFERENCES `raum` (`id`))\r\nundefined', NULL, '2020-10-16 07:47:29.858609'),
(38, 'fehler', 'Error: ER_NO_REFERENCED_ROW_2: Cannot add or update a child row: a foreign key constraint fails (`wilken_maps`.`mitarbeiter`, CONSTRAINT `mitarbeiter_raum` FOREIGN KEY (`raum_id`) REFERENCES `raum` (`id`))\r\nundefined', NULL, '2020-10-16 07:49:54.390505'),
(39, 'fehler', 'Error: ER_NO_REFERENCED_ROW_2: Cannot add or update a child row: a foreign key constraint fails (`wilken_maps`.`mitarbeiter`, CONSTRAINT `mitarbeiter_raum` FOREIGN KEY (`raum_id`) REFERENCES `raum` (`id`))\r\nundefined', NULL, '2020-10-16 07:50:23.689491'),
(40, 'registrierung', 'user: michael.stuehle@wilken.de wurde erfolgreich regsitriert!', '::ffff:10.1.11.104', '2020-10-16 07:50:53.111308'),
(41, '???', 'verifizierungs-mail gesendet!', NULL, '2020-10-16 07:51:01.589324'),
(42, 'verifizierung', 'michael.stuehle@wilken.de wurde verifiziert', '::ffff:10.1.11.104', '2020-10-16 07:51:27.550020'),
(43, 'anmeldung', 'user: michael.stuehle@wilken.de hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-16 07:52:18.170797'),
(44, 'anmeldung', 'user: michael.stuehle@wilken.de hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-16 07:53:15.040098'),
(45, 'registrierung', 'user: michael.stuehle@wilken.de wurde erfolgreich regsitriert!', '::ffff:10.1.11.104', '2020-10-16 07:56:11.671610'),
(46, '???', 'verifizierungs-mail gesendet!', NULL, '2020-10-16 07:56:12.291143'),
(47, 'verifizierung', 'michael.stuehle@wilken.de wurde verifiziert', '::ffff:10.1.11.104', '2020-10-16 07:56:36.189592'),
(48, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-16 07:58:07.139176'),
(49, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-16 07:59:26.949439'),
(50, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-16 08:43:43.713438'),
(51, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-16 08:44:37.962172'),
(52, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-16 08:52:35.213573'),
(53, 'abmeldung', 'user: sql hat sich abgemeldet', '::ffff:10.1.11.104', '2020-10-16 08:52:36.255415'),
(54, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-16 09:04:49.247033'),
(55, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-16 09:05:43.263238'),
(56, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-16 09:06:26.507340'),
(57, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-16 09:08:10.022422'),
(58, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-16 09:09:17.481469'),
(59, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-16 09:09:54.158427'),
(60, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-16 09:15:35.381617'),
(61, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-16 09:19:28.893656'),
(62, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-16 09:20:06.543799'),
(63, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-16 09:20:57.833125'),
(64, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-16 09:21:55.823890'),
(65, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-16 09:27:03.054242'),
(66, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-16 09:27:42.245372'),
(67, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-16 10:29:45.343448'),
(68, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-16 10:58:29.950528'),
(69, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-16 11:04:04.388127'),
(70, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-16 11:04:46.888714'),
(71, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-16 11:11:28.853694'),
(72, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-16 11:13:14.103836'),
(73, 'abmeldung', 'user: sql hat sich abgemeldet', '::ffff:10.1.11.104', '2020-10-16 11:13:22.475671'),
(74, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-16 11:23:17.076445'),
(75, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-16 11:25:44.135359'),
(76, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-16 11:26:57.810834'),
(77, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-16 11:27:58.266950'),
(78, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-16 11:37:02.719979'),
(79, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-16 11:48:46.953000'),
(80, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-16 11:54:38.080164'),
(81, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-16 11:55:20.638495'),
(82, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-16 11:57:49.301137'),
(83, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-16 11:59:19.104817'),
(84, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-16 12:28:36.871735'),
(85, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-19 06:47:03.112618'),
(86, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-19 06:50:19.793019'),
(87, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-19 08:10:34.518477'),
(88, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-19 08:11:09.938640'),
(89, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-19 08:11:25.086334'),
(90, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-19 09:14:54.721085'),
(91, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-19 09:19:23.459672'),
(92, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-19 09:19:54.748445'),
(93, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-19 09:23:20.162068'),
(94, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-19 12:14:28.563615'),
(95, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 05:57:55.547199'),
(96, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 06:05:32.216152'),
(97, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 06:10:18.612420'),
(98, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 06:11:03.899860'),
(99, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 06:13:59.029299'),
(100, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 06:15:35.584597'),
(101, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 06:50:56.473821');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `email` varchar(100) CHARACTER SET utf8 NOT NULL,
  `password` varchar(1000) CHARACTER SET utf8 NOT NULL,
  `rank` varchar(500) CHARACTER SET utf8 NOT NULL DEFAULT 'user',
  `1malPasswort` varchar(1000) CHARACTER SET utf8 DEFAULT NULL,
  `1malPasswortAblauf` datetime DEFAULT NULL,
  `salt` varchar(1000) CHARACTER SET utf8 NOT NULL,
  `isVerified` int(1) NOT NULL DEFAULT 0,
  `verificationToken` varchar(500) CHARACTER SET utf8 DEFAULT NULL,
  `verificationTokenExpires` datetime DEFAULT NULL,
  `einstellungen_id` int(11) NOT NULL,
  `mitarbeiter_id` int(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `user`
--

INSERT INTO `user` (`id`, `email`, `password`, `rank`, `1malPasswort`, `1malPasswortAblauf`, `salt`, `isVerified`, `verificationToken`, `verificationTokenExpires`, `einstellungen_id`, `mitarbeiter_id`) VALUES
(38, 'sql', '08698896e3139ca73dc7844802dd53f4a8cbd74cbf3eed21da14252f6d4849bfedc50ac45cf0c2a6e7825631e6cd07b204d801517f0034557cb30063005bdb7277b500427623085d686c6efd009825bbb57f254d39617d6275cd50e101e46be0c2c9879f9f515538be62599af7ee5172b8dcb7ef8ef438bd3282feb493d55b809096b099dd24486730852607e3781ec36a66ef05e568177708114866c5b1cf1c686da48562b4f121e32131cd5d3d44238966aec4ce44f87a1654eec4918d1316ff826d3485fab398d338d9a2de8ec4f84b1cc5c36bcc329fbf00a7c98dd499f2855903d1d418232c3e947086e3f219b42ab119ee8d076850d4902203a7cf5e63892946abb2a25906218c6368a1392430e013f97152c3ce5ef0a057961082b6c500dc7116dedfba1d73f032dc0fb4294860158839e0602c285ff3ab637588f3dfd9c13d0bd0f57e7154f26c901f2fed4ed69635d6dc8af557c52f7901adc3d1a5262edcc2b72032fdd193d3192c8b1be0f793d48e6064c73c4f0c131a6dc6cba76f13b466c4152a8f92f3611f9acbc5330cd0314bb5959a4621d31b006af73c88670f1ad645af046ee4f474a6071ba7bc8d29a19f5867f9423ee1c2c7cd8987e3f1fa5497771c6e51f0d1f72bfc6a1c173e9500f4d24c737255aa3b4e0e9885de84fd459b012f8bfccf9ee858c3de6d5ddce53154', 'sql', NULL, NULL, ':GS($tpJfZAs->4jr_MfKOf6Hj;<3.Z6K477TwhoU^7C/R!SMc[r,7zN=g.°My!GGYpI²XOn)m2/R<_psIR8(>J9c^)dwueB37Q!)0B&c§B:y7.)uVtDP)RlAF5S3zE<', 1, '', NULL, 5, NULL),
(40, 'Benjamin.Werner@wilken.de', '3cea6c3f64e1df0588973f07fa0ea27955fe15665f9cd51decbc3d8bee40774271e1322fce33db5eeeab9612f708408e5a136463241af350f5343cba42100bdc7f4cb048345d153d3c2e8ea4ffb0dfe9fcc6c8ac4d43f9e93b95f37da21b4c75490e50edfb1829189628835933af25abfc5ad439cb5d2037d01e89b7ab6c86768b70ef122f42276dd3fd7e093461d88cd8bb0b2f46cb49b578c682e8beb92af6ac17d460f35ac68dbb41037a7aa06dbcdc4b620e27aa5afd759f02b3960b2794170b73ffaa572a821f8b879036b3fe71e4779af009f371a138d63f28a807d36baf95a1541a6344238c1adc2fb246b3f967de92315008758ee8385f599ade117d23116683fccdfa50ade114b1253e575e823beec325ecb34f84aeae5960a9f27bce36763ab28bd537eba52dc99e68a1982bda8ff0e093efe17df382c3321585639687e642ad7408a5bf20fcbf04b2875199172d0148fa136486f873b9bf4663c97ba273838f5216a464389c9193d2aec1f72d9515813266f7766b47ce1134cc967fa75b36ebf0b3c936cb25e73a8cf2efd2109eed7c0ac0e28508a3748accd78ee6bf00bb8b99c8ce7641d3933112082ca5a6610cc1701f05c617094f999b56914700c1540c5729c929d2c7945b4e7e965f21b3e1be4d01dd84b8414be74028ff284a61a1a8a568b890698a2ede95967c8c896094', 'developer', NULL, NULL, 'MThTZ(i0JM=txwMI%L.9[^%-5>K_vNnHZ,xUkTv.swv=k6>&9ytGxy2pNQw:)Eu5$yEZb1Bdp?(V³)5A°/x4r³1V=-eswY,QRv?)5m³§l:lsoGmVgFunqxJt³P(MPEBc', 1, '', NULL, 6, 358),
(83, 'michael.stuehle@wilken.de', '5a594ea2215a5f96d1544e660eab402d7f2ee2f0fa63b2087209209ccfe418d5392be37e99bd40e0d361c4195516bc17085824913aa7a26081fb40550c74f6f2d0494bac7fede500126305c7a92692c054f62235f9a2ff4f80f239783b00cd448c9d1dfa85a2c67b2e13b4c810b8d74d5fabdae2a9a012ddb84cfcb529a84200ba3418f6989a5e8510d4cb58bab611fe3b6c89024f6cd04dd1d8f3d8737c12ec5de57623dd6d780fd0fff91903cd3ad5b9a3aa98595e35ff4c57db301337471a871d09cb45a37ad2ae1224940a69a51438e2985460a59139152c9de62e5f46483821a236b3b0e9a785bbad4f16dd20454864f10e1a47830895087c78e00ab8a0725903bcd7b64c6011764b1218e09743855fa7604b4941f0341c51524423f0279e764f698a453c246fb0384a41ade366073d989dec2cfbc613fb145648a42535a8dbb946cc289ed92dc477e67b8b77062530a542af36600b15105c8e8edcd7142ba0718587d13e253ab7e9a2b5f315b2fe98edb7932b6f5670d2adbda38a86ac18c46b3a5d421919db7bdd0c233d252cd55fcf2c1e434e8dd3101f0498547d5e03ac16e38450dbaf8221155eabbcf5e3e2204468241a21d0c57fdbbe10e16fa64feefcdd235a8d120b120db7ded0bf030cfd76ba130b94594a7b09db49b7d9c4a7f0e68ca76e71eb163afc9cf9435462a1ed44a9', 'user', NULL, NULL, '!P4XGXxU0=SGqRFsrVD§r/MUPIB/!2wA>n5t.cV;6-L],fe§3l=(7G°&ggax5Fb$O8ln°7QVW[/§²OgL.K,1aih!g:Jn49|t&?V2EehhA=2mZLGYFOxee!470Mnhvl3y', 1, 'ubrr9Jg5dKZNW5TxBOoV', '2020-10-17 09:56:11', 58, 440);

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
  ADD KEY `einstellungen_raum` (`raum_id`);

--
-- Indizes für die Tabelle `mitarbeiter`
--
ALTER TABLE `mitarbeiter`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mitarbeiter_raum` (`raum_id`);

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
-- Indizes für die Tabelle `serverlog`
--
ALTER TABLE `serverlog`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `einstellungen_id` (`einstellungen_id`),
  ADD UNIQUE KEY `mitarbeiter_id` (`mitarbeiter_id`),
  ADD KEY `user_rank` (`rank`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `einstellungen`
--
ALTER TABLE `einstellungen`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT für Tabelle `mitarbeiter`
--
ALTER TABLE `mitarbeiter`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=441;

--
-- AUTO_INCREMENT für Tabelle `raum`
--
ALTER TABLE `raum`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=286;

--
-- AUTO_INCREMENT für Tabelle `serverlog`
--
ALTER TABLE `serverlog`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=102;

--
-- AUTO_INCREMENT für Tabelle `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=84;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `mitarbeiter`
--
ALTER TABLE `mitarbeiter`
  ADD CONSTRAINT `mitarbeiter_raum` FOREIGN KEY (`raum_id`) REFERENCES `raum` (`id`);

--
-- Constraints der Tabelle `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_einstellungen` FOREIGN KEY (`einstellungen_id`) REFERENCES `einstellungen` (`id`),
  ADD CONSTRAINT `user_mitarbeiter` FOREIGN KEY (`mitarbeiter_id`) REFERENCES `mitarbeiter` (`id`),
  ADD CONSTRAINT `user_rank` FOREIGN KEY (`rank`) REFERENCES `rank` (`name`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
