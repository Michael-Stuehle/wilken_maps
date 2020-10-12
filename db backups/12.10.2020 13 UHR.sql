-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 12. Okt 2020 um 13:32
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
  `bool` tinyint(1) NOT NULL DEFAULT 0,
  `string` varchar(100) NOT NULL DEFAULT '',
  `integerValue` int(10) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `einstellungen`
--

INSERT INTO `einstellungen` (`id`, `bool`, `string`, `integerValue`) VALUES
(5, 0, 'test3', 323),
(6, 0, '', 1),
(15, 0, '', 0);

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
(51, 'Oczenaschek Gerd', 185),
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
(205, 'Stuehle Michael', 223),
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
(408, 'Hess Tonio', 285);

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
  `einstellungen_id` int(11) NOT NULL,
  `mitarbeiter_id` int(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `user`
--

INSERT INTO `user` (`id`, `name`, `password`, `rank`, `1malPasswort`, `1malPasswortAblauf`, `salt`, `isVerified`, `verificationToken`, `verificationTokenExpires`, `einstellungen_id`, `mitarbeiter_id`) VALUES
(38, 'sql', '08698896e3139ca73dc7844802dd53f4a8cbd74cbf3eed21da14252f6d4849bfedc50ac45cf0c2a6e7825631e6cd07b204d801517f0034557cb30063005bdb7277b500427623085d686c6efd009825bbb57f254d39617d6275cd50e101e46be0c2c9879f9f515538be62599af7ee5172b8dcb7ef8ef438bd3282feb493d55b809096b099dd24486730852607e3781ec36a66ef05e568177708114866c5b1cf1c686da48562b4f121e32131cd5d3d44238966aec4ce44f87a1654eec4918d1316ff826d3485fab398d338d9a2de8ec4f84b1cc5c36bcc329fbf00a7c98dd499f2855903d1d418232c3e947086e3f219b42ab119ee8d076850d4902203a7cf5e63892946abb2a25906218c6368a1392430e013f97152c3ce5ef0a057961082b6c500dc7116dedfba1d73f032dc0fb4294860158839e0602c285ff3ab637588f3dfd9c13d0bd0f57e7154f26c901f2fed4ed69635d6dc8af557c52f7901adc3d1a5262edcc2b72032fdd193d3192c8b1be0f793d48e6064c73c4f0c131a6dc6cba76f13b466c4152a8f92f3611f9acbc5330cd0314bb5959a4621d31b006af73c88670f1ad645af046ee4f474a6071ba7bc8d29a19f5867f9423ee1c2c7cd8987e3f1fa5497771c6e51f0d1f72bfc6a1c173e9500f4d24c737255aa3b4e0e9885de84fd459b012f8bfccf9ee858c3de6d5ddce53154', 'sql', NULL, NULL, ':GS($tpJfZAs->4jr_MfKOf6Hj;<3.Z6K477TwhoU^7C/R!SMc[r,7zN=g.°My!GGYpI²XOn)m2/R<_psIR8(>J9c^)dwueB37Q!)0B&c§B:y7.)uVtDP)RlAF5S3zE<', 1, '', NULL, 5, NULL),
(40, 'Benjamin.Werner@wilken.de', '3cea6c3f64e1df0588973f07fa0ea27955fe15665f9cd51decbc3d8bee40774271e1322fce33db5eeeab9612f708408e5a136463241af350f5343cba42100bdc7f4cb048345d153d3c2e8ea4ffb0dfe9fcc6c8ac4d43f9e93b95f37da21b4c75490e50edfb1829189628835933af25abfc5ad439cb5d2037d01e89b7ab6c86768b70ef122f42276dd3fd7e093461d88cd8bb0b2f46cb49b578c682e8beb92af6ac17d460f35ac68dbb41037a7aa06dbcdc4b620e27aa5afd759f02b3960b2794170b73ffaa572a821f8b879036b3fe71e4779af009f371a138d63f28a807d36baf95a1541a6344238c1adc2fb246b3f967de92315008758ee8385f599ade117d23116683fccdfa50ade114b1253e575e823beec325ecb34f84aeae5960a9f27bce36763ab28bd537eba52dc99e68a1982bda8ff0e093efe17df382c3321585639687e642ad7408a5bf20fcbf04b2875199172d0148fa136486f873b9bf4663c97ba273838f5216a464389c9193d2aec1f72d9515813266f7766b47ce1134cc967fa75b36ebf0b3c936cb25e73a8cf2efd2109eed7c0ac0e28508a3748accd78ee6bf00bb8b99c8ce7641d3933112082ca5a6610cc1701f05c617094f999b56914700c1540c5729c929d2c7945b4e7e965f21b3e1be4d01dd84b8414be74028ff284a61a1a8a568b890698a2ede95967c8c896094', 'developer', NULL, NULL, 'MThTZ(i0JM=txwMI%L.9[^%-5>K_vNnHZ,xUkTv.swv=k6>&9ytGxy2pNQw:)Eu5$yEZb1Bdp?(V³)5A°/x4r³1V=-eswY,QRv?)5m³§l:lsoGmVgFunqxJt³P(MPEBc', 1, '', NULL, 6, 358),
(45, 'Michael.stuehle@wilken.de', 'b8dbe633922d618c27a7359452880b1434a77e01802305cfd4dbce5d1869f1a3426d4c643c4db02c8d4f650c13584e6c99c1f0483a32d8634eb0be78775332fd546e7b168a0d47c8739932398e8d6dbff5e18caf6c42821c7233a42a053b9e0681140fc0baa5a9480d8ea570e1f4c29648bfa2ed102419c4dc8d44112f91e5cf7649bbfdb1d5723df289dbb9a9b75d59c51ab72ec5acc317db2024bcb6741fd74bbcb0e56c2a16f86be5d3532fc0a5950474438a3fb32deee819a398286f3228d9cb1767254d797eea5348acfa61a34357110ae6d3ac9a2b7024a070bb53e287d368798a7cb9dba153f25827cae1166215118ce4a13ba922394041b8f26c640aacd74ed6b844f3eda4357a519dce2d5de0597329ffcf6fe3c9379e0a31cff5f063932d1ffcb6a1cba57996b9c377e7905899ec68ecb3d6f23d90111da6b0db8de1d3e59023344798ed540048f999e95af3e0d28b99c61227da130c01e5faabd9bf2d11f9669a2cc8fb2c2b83df9a3290c3d2f7f94488b88758f8cd90fe64979a08cc0153133690805830eec0842c8b015ba4159c2f9d718e63d1aea19754214e09dee21d7c2ec1cccc088f97349315766f9a11c24b00048b5c4bc115ede15bdb0b3c3a666a0bb343f3bf3556dd93c806b10317bec93fe8bc3573bdb446a9ac44b6b580e6974726787194c00d79a3920ea4e94114', 'user', NULL, NULL, 'jXur4exVi72eq°C?Vk³Kk(:zEb7sALg0E48°7M4LOP/$?9|Ck^D-c3TL3oI<oB%|D|Z=sz:³²Z§Vy,vr:2Xu2jO7v§^[r:pfbuUgndYs8IBDQ?Hzghh9_.|W°gW!9<sl', 1, '', NULL, 15, 205);

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
-- Indizes für die Tabelle `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_rank` (`rank`),
  ADD KEY `user_einstellungen` (`einstellungen_id`),
  ADD KEY `user_mitarbeiter` (`mitarbeiter_id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `einstellungen`
--
ALTER TABLE `einstellungen`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

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
