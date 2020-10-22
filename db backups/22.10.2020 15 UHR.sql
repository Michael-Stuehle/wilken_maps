-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 22. Okt 2020 um 15:09
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
  `string` varchar(100) NOT NULL DEFAULT '',
  `integerValue` int(10) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `einstellungen`
--

INSERT INTO `einstellungen` (`id`, `dark_mode`, `string`, `integerValue`) VALUES
(5, 1, 'test3', 321),
(6, 0, '', 1),
(58, 1, '', 0),
(60, 0, '', 0),
(61, 1, '', 0),
(62, 0, '', 0);

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
(446, 'stuehle michael', 183);

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
('administrator', 'admin'),
('developer', '*;admin'),
('sql', '*;sql;admin'),
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
(101, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 06:50:56.473821'),
(102, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 08:15:21.874864'),
(103, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 08:16:01.257849'),
(104, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 08:16:41.832470'),
(105, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 08:17:45.319319'),
(106, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 08:18:31.958591'),
(107, 'anmeldung', 'user: sql hat sich angemeldet', '::1', '2020-10-20 08:18:56.029897'),
(108, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.2.116', '2020-10-20 08:19:45.135874'),
(109, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 08:21:22.374033'),
(110, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 08:21:46.714891'),
(111, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 08:22:11.360736'),
(112, 'anmeldung', 'user: michael.stuehle@wilken.de hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 08:24:00.851848'),
(113, 'fehler', 'Error: ER_NO_REFERENCED_ROW_2: Cannot add or update a child row: a foreign key constraint fails (`wilken_maps`.`mitarbeiter`, CONSTRAINT `mitarbeiter_raum` FOREIGN KEY (`raum_id`) REFERENCES `raum` (`id`))\r\nundefined', NULL, '2020-10-20 08:24:18.771380'),
(114, 'fehler', 'null\r\nundefined', NULL, '2020-10-20 08:24:18.772514'),
(115, 'anmeldung', 'user: Michael.stuehle@wilken.de hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 08:26:36.727842'),
(116, 'anmeldung', 'user: Michael.stuehle@wilken.de hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 08:28:25.879429'),
(117, 'anmeldung', 'user: Michael.stuehle@wilken.de hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 08:29:23.341638'),
(118, 'anmeldung', 'user: Michael.stuehle@wilken.de hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 08:34:14.024008'),
(119, 'fehler', 'Error: ER_BAD_FIELD_ERROR: Unknown column \'mitarbeiter_id\' in \'field list\'\r\nundefined', NULL, '2020-10-20 08:34:18.963893'),
(120, 'fehler', 'null\r\nundefined', NULL, '2020-10-20 08:34:18.965027'),
(121, 'anmeldung', 'user: Michael.stuehle@wilken.de hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 08:36:04.238046'),
(122, 'fehler', 'Error: ER_BAD_FIELD_ERROR: Unknown column \'mitarbeiter_id\' in \'field list\'\r\nundefined', NULL, '2020-10-20 08:36:09.808632'),
(123, 'fehler', 'null\r\nundefined', NULL, '2020-10-20 08:36:09.810873'),
(124, 'anmeldung', 'user: michael.stuehle@wilken.de hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 08:38:47.143369'),
(125, 'fehler', 'Error: ER_BAD_FIELD_ERROR: Unknown column \'mitarbeiter_id\' in \'field list\'\r\nundefined', NULL, '2020-10-20 08:38:53.874553'),
(126, 'fehler', 'null\r\nundefined', NULL, '2020-10-20 08:38:53.874706'),
(127, 'anmeldung', 'user: Michael.stuehle@wilken.de hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 08:40:52.050157'),
(128, 'fehler', 'null\r\nundefined', NULL, '2020-10-20 08:40:57.925958'),
(129, 'fehler', 'Error: ER_BAD_FIELD_ERROR: Unknown column \'mitarbeiter_id\' in \'field list\'\r\nundefined', NULL, '2020-10-20 08:40:57.926894'),
(130, 'anmeldung', 'user: michael.stuehle@wilken.de hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 08:45:01.920803'),
(131, 'anmeldung', 'user: michael.stuehle@wilken.de hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 08:46:10.060065'),
(132, 'anmeldung', 'user: michael.stuehle@wilken.de hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 08:50:52.781455'),
(133, 'abmeldung', 'user: michael.stuehle@wilken.de hat sich abgemeldet', '::ffff:10.1.11.104', '2020-10-20 08:51:21.779093'),
(134, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 08:51:25.383306'),
(135, 'fehler', 'Error: ER_BAD_FIELD_ERROR: Unknown column \'undefined\' in \'field list\'\r\nundefined', NULL, '2020-10-20 08:51:38.151185'),
(136, 'fehler', 'null\r\nundefined', NULL, '2020-10-20 08:51:38.152206'),
(137, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 08:53:19.366985'),
(138, 'fehler', 'null\r\nundefined', NULL, '2020-10-20 08:53:23.065472'),
(139, 'fehler', 'Error: ER_BAD_FIELD_ERROR: Unknown column \'undefined\' in \'field list\'\r\nundefined', NULL, '2020-10-20 08:53:23.070019'),
(140, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 08:53:45.979588'),
(141, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 08:55:15.293909'),
(142, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 08:56:53.942528'),
(143, 'fehler', 'Error: ER_BAD_FIELD_ERROR: Unknown column \'undefined\' in \'field list\'\r\nundefined', NULL, '2020-10-20 08:56:58.283192'),
(144, 'fehler', 'null\r\nundefined', NULL, '2020-10-20 08:56:58.285853'),
(145, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 08:57:53.581464'),
(146, 'fehler', 'null\r\nundefined', NULL, '2020-10-20 08:57:58.888669'),
(147, 'fehler', 'Error: ER_BAD_FIELD_ERROR: Unknown column \'undefined\' in \'field list\'\r\nundefined', NULL, '2020-10-20 08:57:58.898642'),
(148, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 08:59:08.228745'),
(149, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 09:02:58.956616'),
(150, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 09:03:45.304180'),
(151, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 09:04:07.061389'),
(152, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 09:04:39.045698'),
(153, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 09:05:25.829595'),
(154, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 09:14:19.207234'),
(155, 'abmeldung', 'user: sql hat sich abgemeldet', '::ffff:10.1.11.104', '2020-10-20 09:15:57.138009'),
(156, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 09:16:00.840241'),
(157, 'fehler', 'Error: ER_BAD_FIELD_ERROR: Unknown column \'raum_id\' in \'field list\'\r\nundefined', NULL, '2020-10-20 09:20:31.434009'),
(158, 'registrierung', 'user: aaaaaaaaaa@wilken.de wurde erfolgreich regsitriert!', '::ffff:10.1.11.104', '2020-10-20 09:22:10.872509'),
(159, '???', 'verifizierungs-mail gesendet!', NULL, '2020-10-20 09:22:11.305373'),
(160, 'anmeldung', 'user: administrator hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 09:22:52.764040'),
(161, 'anmeldung', 'user: administrator hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 09:28:42.247232'),
(162, 'registrierung', 'user: aaaaaaaaa@wilken.de wurde erfolgreich regsitriert!', '::ffff:10.1.11.104', '2020-10-20 09:33:50.544230'),
(163, '???', 'verifizierungs-mail gesendet!', NULL, '2020-10-20 09:33:50.929368'),
(164, 'anmeldung', 'user: admin hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 09:35:46.894501'),
(165, 'anmeldung', 'user: admin hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 10:39:23.659078'),
(166, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 10:43:00.640470'),
(167, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 11:18:03.571611'),
(168, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 11:29:22.421258'),
(169, 'anmeldung', 'user: Michael.stuehle@wilken.de hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 11:29:35.132097'),
(170, 'abmeldung', 'user: Michael.stuehle@wilken.de hat sich abgemeldet', '::ffff:10.1.11.104', '2020-10-20 11:33:20.664225'),
(171, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 11:33:28.451961'),
(172, 'anmeldung', 'user: Michael.stuehle@wilken.de hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 11:40:28.331621'),
(173, 'abmeldung', 'user: Michael.stuehle@wilken.de hat sich abgemeldet', '::ffff:10.1.11.104', '2020-10-20 11:40:35.019562'),
(174, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 11:40:42.307868'),
(175, 'abmeldung', 'user: sql hat sich abgemeldet', '::ffff:10.1.11.104', '2020-10-20 11:40:53.276970'),
(176, 'anmeldung', 'user: admin hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 11:41:00.484103'),
(177, 'anmeldung', 'user: admin hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 11:42:11.512508'),
(178, 'anmeldung', 'user: admin hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 11:42:36.726813'),
(179, 'abmeldung', 'user: admin hat sich abgemeldet', '::ffff:10.1.11.104', '2020-10-20 11:42:59.873054'),
(180, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 11:45:38.454273'),
(181, 'abmeldung', 'user: sql hat sich abgemeldet', '::ffff:10.1.11.104', '2020-10-20 11:45:43.501474'),
(182, 'anmeldung', 'user: Michael.stuehle@wilken.de hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 11:45:49.837845'),
(183, 'abmeldung', 'user: Michael.stuehle@wilken.de hat sich abgemeldet', '::ffff:10.1.11.104', '2020-10-20 11:46:02.149390'),
(184, 'anmeldung', 'user: admin hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 11:46:08.298057'),
(185, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 11:55:04.299223'),
(186, 'abmeldung', 'user: sql hat sich abgemeldet', '::ffff:10.1.11.104', '2020-10-20 11:56:47.881580'),
(187, 'anmeldung', 'user: michael.stuehle@wilken.de hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 11:56:52.245987'),
(188, 'abmeldung', 'user: michael.stuehle@wilken.de hat sich abgemeldet', '::ffff:10.1.11.104', '2020-10-20 11:57:48.667883'),
(189, 'anmeldung', 'user: michael.stuehle@wilken.de hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 11:57:53.515301'),
(190, 'anmeldung', 'user: michael.stuehle@wilken.de hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 12:00:10.895127'),
(191, 'anmeldung', 'user: michael.stuehle@wilken.de hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 12:01:30.991829'),
(192, 'anmeldung', 'user: Michael.stuehle@wilken.de hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 12:01:57.104016'),
(193, 'anmeldung', 'user: michael.stuehle@wilken.de hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 12:02:56.411264'),
(194, 'anmeldung', 'user: michael.stuehle@wilken.de hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 12:04:24.949225'),
(195, 'anmeldung', 'user: michael.stuehle@wilken.de hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 12:05:54.941318'),
(196, 'anmeldung', 'user: Michael.stuehle@wilken.de hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 12:06:28.677198'),
(197, 'anmeldung', 'user: michael.stuehle@wilken.de hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 12:47:22.093859'),
(198, 'anmeldung', 'user: michael.stuehle@wilken.de hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 12:50:19.955523'),
(199, 'anmeldung', 'user: Michael.stuehle@wilken.de hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 12:52:25.412664'),
(200, 'anmeldung', 'user: Michael.stuehle@wilken.de hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 12:53:49.926728'),
(201, 'anmeldung', 'user: michael.stuehle@wilken.de hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 12:54:20.846436'),
(202, 'anmeldung', 'user: michael.stuehle@wilken.de hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 12:58:30.065735'),
(203, 'anmeldung', 'user: michael.stuehle@wilken.de hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 13:11:30.781350'),
(204, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.2.116', '2020-10-20 13:11:49.213694'),
(205, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.2.116', '2020-10-20 13:12:10.033951'),
(206, 'abmeldung', 'user: michael.stuehle@wilken.de hat sich abgemeldet', '::ffff:10.1.11.104', '2020-10-20 13:25:45.859941'),
(207, 'anmeldung', 'user: michael.stuehle@wilken.de hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 13:26:03.277713'),
(208, 'abmeldung', 'user: michael.stuehle@wilken.de hat sich abgemeldet', '::ffff:10.1.11.104', '2020-10-20 13:28:18.922988'),
(209, 'anmeldung', 'user: Michael.stuehle@wilken.de hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 13:41:30.494378'),
(210, 'abmeldung', 'user: Michael.stuehle@wilken.de hat sich abgemeldet', '::ffff:10.1.11.104', '2020-10-20 13:42:57.014694'),
(211, 'anmeldung', 'user: Michael.stuehle@wilken.de hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 13:44:44.793270'),
(212, 'abmeldung', 'user: Michael.stuehle@wilken.de hat sich abgemeldet', '::ffff:10.1.11.104', '2020-10-20 13:45:01.215714'),
(213, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 13:45:05.525630'),
(214, 'abmeldung', 'user: sql hat sich abgemeldet', '::ffff:10.1.11.104', '2020-10-20 13:48:02.295838'),
(215, 'anmeldung', 'user: Michael.stuehle@wilken.de hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 13:48:07.207747'),
(216, 'abmeldung', 'user: Michael.stuehle@wilken.de hat sich abgemeldet', '::ffff:10.1.11.104', '2020-10-20 13:48:23.887972'),
(217, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 13:48:26.731314'),
(218, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-20 13:52:50.304763'),
(219, 'abmeldung', 'user: sql hat sich abgemeldet', '::ffff:10.1.11.104', '2020-10-20 13:53:07.561642'),
(220, 'anmeldung', 'user: admin hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-22 06:22:37.175955'),
(221, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-22 08:02:51.785146'),
(222, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-22 11:58:27.790735'),
(223, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-22 12:08:27.156921'),
(224, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-22 12:17:02.501982'),
(225, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-22 12:17:40.715939'),
(226, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-22 12:22:42.490547'),
(227, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-22 12:25:24.419081'),
(228, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-22 12:28:14.665983'),
(229, 'registrierung', 'user: Michael.stuehle@wilken.de wurde erfolgreich regsitriert!', '::ffff:10.1.11.104', '2020-10-22 12:29:09.198431'),
(230, '???', 'verifizierungs-mail gesendet!', NULL, '2020-10-22 12:29:09.915612'),
(231, 'verifizierung', 'Michael.stuehle@wilken.de wurde verifiziert', '::ffff:10.1.11.104', '2020-10-22 12:29:16.037446'),
(232, 'anmeldung', 'user: Michael.stuehle@wilken.de hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-22 12:29:22.474045'),
(233, 'abmeldung', 'user: Michael.stuehle@wilken.de hat sich abgemeldet', '::ffff:10.1.11.104', '2020-10-22 12:29:26.908590'),
(234, 'anmeldung', 'user: sql hat sich angemeldet', '::ffff:10.1.11.104', '2020-10-22 12:29:29.826194');

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
(85, 'administrator', '7534f247f1be562d65a6746ac0b107871a55ba5c79491d76d53f0ac7ae6eac6df754e6dd36fd37340cd93e18e98b09ded90e2695271a5fc54a38a5e40e33d76ded3c52ac0dcb27e5cc7d26e000a949e9f04d31ddfd2b18c8b288820dff9ff6f3ec3e10016d4949925e274238f1e41b952d136a05addd7326cbcddf269ea7f3fc90dc42eeaaae2cb4d18c952f6cdb3c83630e02c5e16708871d6fb67dd76143da71a9f0e03b2ea6afae4660569de96acd7f55de7d4874ffbc35e10412a2f93aaf3fa839ca15f63fa80a25ab1ea31f542cf5de78d1c98ce40707d4a0a4afdc98321e323b1cc7aec64ffcaa82de6504861554c5725bb37d94fec5a08cfe28becb5f7076dbbcf96e5fc573255b1d0facc6d13edcbbf3b9abc571054bca0bfe1bdddf433585b534970132d70a54858055f5a7c5e30eedb1e39faac1ec5faf341711ff4e738f487c3a005b344912a5cbe08e22e2778e9607b22b14445e08380635a155f77b4db6d90732d7c746f1bbb631ce87d29a3f5ae712e59d205bc9ff25e660274974e5e294421c64eb9ec0242fa4be073c0e54f0f56ebd379fbb9a06ba4014f4f131170ca98af7c4d616e1ff515a9691a03e86acbfcd128dc639f841f96de137babda2a7d058f81698ce493d513f8f7232dcf4c54416f317fc3c91f9319f9fb7f9b2c6486473542c91e05ef09237ac7115363f7c', 'administrator', NULL, NULL, '?]x1Z[$³[jepP-YIxjqD§/7D°q³kY-XZ|z.aG?AV§_UE>rFpt%tzn<edD$qfD§$aJ[J³|A88§cR|7M:x8qW-B§%5-E§Y)jkMv|U6X9GScNNY&8:l[3°tFp§L$R)gXW4t', 1, 'BTDI3j0I8LfYaxU3ZufW', '2020-10-21 11:22:10', 60, NULL),
(86, 'admin', '21c8ed16b7c1d05cc57e32baa424238602f796c642c3aaecca55aaafd9c1fb5cc0fc36b4caa8d7bbde95abb7bc5357f3c8406cacd706a77036c7efa9c66d2f1bb3fe02280cef98b0071ebea68024fdece5a0595f18fc16b5c286d8970f047a0e7a239038bcf6e9b585018e058e536fae2e6099bcb2d487092fd03f5bace6be56de8182067fedcbfebd01cada8aaa839191b40d62fb4515994b943dcd915d4314e9c22fdcc014473a80b5e3b4d01869619488acb4524cdd47e18af4d762af2b74c6cfb3c92e006ed48d2481994a88d5ea70bd9c10f9d48984ada7d558ba0ded7c13c5c8972a2fe42dbd0fb077bff77af4be5a4c3047479880f67b2ebdb7b1ef20211dc9320fccf540f868b4a9550f2cab14e8259668749b3ec6a85201092c97c70c71a60bdc17ee0ddeef90b3b183333d6ebd6551b8f33c9762c3a6ae4a7de339b86a3289cc2156ef620f84e65cfb8b4cd6da8ba59fdfe1dd946634abbbf911fa2b7c8946e601e998d44cdfdcbb07f1ba6fe3f3d98374d0c16acc45545f27273f3097a88de90a571f9f7565ccf066ffb41710e0c538ff953f606a8a896af4ca5fa57c192e7492cda4b99a35ca96972e89e3213e8fc5e90bece0887ef01de22819d67ae91d3315a4290542553da8ee099d2beb7a0c986dc8736cb9d234f8f0674f21dfc169e9163af34baaa266943a5524b59bf2b1', 'administrator', NULL, NULL, 'R9gP!=]mYU3MBS9s6[bQ)|eg|oa98p??4M,d1%X§e;MUyJ9rM-zZ_XNs[mlMWF)x,U2=O_=!/5q(SL(&³d[²/K.[Bm1I§keYqG]8.1$ElR7;e°N5f)N§BqgF&&0Hk0>F', 1, '4F3uNTJKFtmnp4XAnPxf', '2020-10-21 11:33:50', 61, NULL),
(87, 'Michael.stuehle@wilken.de', 'de2334bc3a1bc341fd981f3a7c2f67f51d0b45d54beb9a22dc7380f6144e8481e27e189ca8619d8ad9d11414cfcb60ba1a6c4f126cdc5c726cbe79de627e7a9845341e82752ddaa4257c4f4c5f0f97586cca29ef8601ca948c93d164d804dc5f660c52a7b34e2f5f44b0d078a9b674501d418334da2f43eec1412f5a231f73be4a69b863b897b57a8818dcdfdb70dc17d829d82789628391a3ee1c30ec6a1030035c5819c1c2e4eb21b1b2ac4c130fee73386635aa0e0fcf9a819d1389abe3439e031f00ef15a1ef3351193106de2a0fa3ed223495c05b00ddbb421ff91b03e592fb18b79a34866e260701cbf9f3ffcf244f3990c72be0bb3708c716b969e8e41e1507c2f9298b764e86ad2ae53d8d23c816fbd960ed312d0aa9a2b97e1dff8c1f690e5e11d681502c861eb216d92792647926e1bcf2845d2e9c4691df7ea5068ffabdbba7f9d97851fad572881790c8ef65ec1d3b7f605ec8d4bb47a7ff71c80548888ec59919ea3a07fe0fc76f19e7ede38db1fcc7dc94a5699d9510ca241d5c67787d0e7a7bae33b1942ee61ababc491f2cda4c62dacfe514bd10d2ab9e0695d75944702c571500824906510d4a676cff2ebf863a894bbd3d3307d07937538ecdcc03a26f7381304a9bbe25ef559cc1b2f21e9b288a315dd523d179cc24308569310b107d0fae53a676c6ca73967327f8086c', 'user', NULL, NULL, '9PWT82JJWoDxW°UzQ§d6)P^]d&a|n.o°v%)(²x$]_Ka=L/zOT0Rl%1v:qt7ab3;R°IP²$Awt.H^GT:8vDK=;b&IFGrclTjbQhyYWyF>NC2KsALd°O:!^,i/KZZT(Mnl2', 1, 'at4PueZaXkbgRiBKPZxg', '2020-10-23 14:29:09', 62, 446);

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
  ADD PRIMARY KEY (`id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT für Tabelle `mitarbeiter`
--
ALTER TABLE `mitarbeiter`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=448;

--
-- AUTO_INCREMENT für Tabelle `raum`
--
ALTER TABLE `raum`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=286;

--
-- AUTO_INCREMENT für Tabelle `serverlog`
--
ALTER TABLE `serverlog`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=235;

--
-- AUTO_INCREMENT für Tabelle `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=88;

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
