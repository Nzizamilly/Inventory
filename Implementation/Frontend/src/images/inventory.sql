-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 29, 2024 at 09:30 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `inventory`
--

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `category_name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `category_name`, `description`) VALUES
(1, 'Devices', 'Electronics and related'),
(2, 'Computers', 'PC related stuff'),
(5, 'Furniture', 'Furniture related ');

-- --------------------------------------------------------

--
-- Table structure for table `department`
--

CREATE TABLE `department` (
  `id` int(11) NOT NULL,
  `department_name` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `department`
--

INSERT INTO `department` (`id`, `department_name`, `status`) VALUES
(1, 'Transport', 'ACTIVE'),
(2, 'Call center', 'ACTIVE'),
(3, 'Administration', 'ACTIVE'),
(4, 'Operations', 'ACTIVE');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
  `username` text NOT NULL,
  `password` varchar(255) NOT NULL,
  `profile_picture` longblob NOT NULL,
  `roleID` int(11) NOT NULL,
  `departmentID` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `username`, `password`, `profile_picture`, `roleID`, `departmentID`, `createdAt`, `status`, `email`) VALUES
(31, 'Super', '5555', '', 5, 3, '2024-02-29 16:58:11', 'ACTIVE', 'super@centrika.rw'),
(35, '0000', '0000', '', 3, 3, '2024-02-29 16:59:53', 'ACTIVE', '0000@centrika.rw'),
(37, 'HR', '1111', '', 6, 3, '2024-02-29 17:08:17', 'ACTIVE', 'hr@centrika.rw'),
(38, 'Super2', '5555', '', 5, 3, '2024-03-14 10:51:27', 'ACTIVE', 'super2@centrika.rw'),
(39, 'Nshuti', '09876', '', 2, 2, '2024-04-02 12:06:04', 'ACTIVE', 'snshuti@centrika.rw'),
(40, 'Estella', '0000', '', 3, 3, '2024-04-04 11:06:48', 'ACTIVE', 'eniyonkuru@centrika.rw'),
(41, 'Emelyne', '5555', '', 5, 3, '2024-04-02 12:10:07', 'ACTIVE', 'eumutoniwase@centrika.rw'),
(42, 'Mwiza', '09876', '', 2, 2, '2024-04-02 12:20:27', 'ACTIVE', 'cmwiza@centrika.rw'),
(43, 'Milly', '09876', '', 4, 4, '2024-04-04 14:31:15', 'ACTIVE', 'christianflex700@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `employee_supervisor_purchase`
--

CREATE TABLE `employee_supervisor_purchase` (
  `id` int(11) NOT NULL,
  `expenditure_line` varchar(255) NOT NULL,
  `amount` varchar(255) NOT NULL,
  `cost_method` varchar(255) NOT NULL,
  `supervisor` int(11) NOT NULL,
  `end_goal` varchar(255) NOT NULL,
  `quotation` blob NOT NULL,
  `priority` varchar(255) NOT NULL,
  `employeeID` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `email` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee_supervisor_purchase`
--

INSERT INTO `employee_supervisor_purchase` (`id`, `expenditure_line`, `amount`, `cost_method`, `supervisor`, `end_goal`, `quotation`, `priority`, `employeeID`, `date`, `email`, `status`) VALUES
(0, 'PDF Trial', '20,000', 'once-off', 31, 'PDF Trial', '', 'green', 31, '2024-04-25 14:55:31', 'super@centrika.rw', 'Pending'),
(1, 'Kiosk', '100,000', 'once-off', 31, 'For money transfer', '', 'cyan', 43, '2024-04-12 13:31:43', 'christianflex700@gmail.com', 'Approved'),
(2, 'Air Conditioner', '20,000', 'once-off', 38, 'Temperature', '', 'cyan', 43, '2024-04-12 14:52:26', 'christianflex700@gmail.com', 'Approved By Supervisor'),
(3, 'Bottle', '1,000', 'once-off', 31, 'For field work', '', 'cyan', 43, '2024-04-12 15:17:23', 'christianflex700@gmail.com', 'Denied'),
(4, 'Tape', '1,000', 'once-off', 31, 'For utility Inspection', '', 'green', 43, '2024-04-15 07:14:38', 'christianflex700@gmail.com', 'Approved'),
(5, 'Stapler', '2,000', 'once-off', 31, 'For office use', '', 'green', 31, '2024-04-15 08:04:34', 'super@centrika.rw', 'Denied By Supervisor');

-- --------------------------------------------------------

--
-- Table structure for table `employee_supervisor_request`
--

CREATE TABLE `employee_supervisor_request` (
  `id` int(11) NOT NULL,
  `categoryID` int(11) NOT NULL,
  `itemID` int(11) NOT NULL,
  `employeeID` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `date_of_request` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `amount` varchar(255) NOT NULL,
  `priority` varchar(255) NOT NULL,
  `supervisor_concerned` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee_supervisor_request`
--

INSERT INTO `employee_supervisor_request` (`id`, `categoryID`, `itemID`, `employeeID`, `description`, `date_of_request`, `email`, `status`, `amount`, `priority`, `supervisor_concerned`) VALUES
(1, 1, 46, 43, 'Office Use', 'Apr 11, 2024', 'christianflex700@gmail.com', 'Approved', '2', 'cyan', 31),
(2, 1, 42, 43, 'For office use', 'Apr 15, 2024', 'christianflex700@gmail.com', 'Approved', '1', 'green', 31);

-- --------------------------------------------------------

--
-- Table structure for table `hr_admin_request`
--

CREATE TABLE `hr_admin_request` (
  `id` int(11) NOT NULL,
  `categoryID` int(11) NOT NULL,
  `itemID` int(11) NOT NULL,
  `amount` varchar(255) NOT NULL,
  `supervisorID` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `employeeID` int(11) NOT NULL,
  `email` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hr_admin_request`
--

INSERT INTO `hr_admin_request` (`id`, `categoryID`, `itemID`, `amount`, `supervisorID`, `description`, `status`, `employeeID`, `email`) VALUES
(1, 1, 46, '2', 31, 'Office Use', '', 43, 0),
(2, 1, 42, '1', 31, 'For office use', '', 43, 0);

-- --------------------------------------------------------

--
-- Table structure for table `item`
--

CREATE TABLE `item` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `supplierID` int(11) NOT NULL,
  `categoryID` int(11) NOT NULL,
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updatedtime` varchar(255) NOT NULL,
  `nameUpdated` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `item`
--

INSERT INTO `item` (`id`, `name`, `supplierID`, `categoryID`, `createdAt`, `updatedtime`, `nameUpdated`, `status`) VALUES
(1, 'POS Android', 1, 1, '2024-03-01 12:55:42', '18/03/2024', '0000', ''),
(5, 'POS Exciton', 1, 1, '2024-03-01 12:55:42', '18/03/2024', '0000', ''),
(19, 'HP', 4, 2, '2024-03-01 12:55:42', '18/03/2024', '0000', ''),
(38, 'MAC BOOK PRO', 4, 2, '2024-03-04 07:57:42', '', '', ''),
(41, 'Table', 4, 5, '2024-03-11 12:37:09', '', '', ''),
(42, 'Cup board', 2, 5, '2024-03-18 08:56:05', '', '', ''),
(43, 'Chair', 3, 5, '2024-03-18 09:00:45', '', '', ''),
(44, 'POS Bi', 1, 1, '2024-03-18 09:09:16', '', '', ''),
(45, 'Mobile Phone', 4, 1, '2024-03-18 12:01:34', '', '', ''),
(46, 'Dell', 4, 2, '2024-04-04 11:11:12', '', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `item_deletion_or_updation`
--

CREATE TABLE `item_deletion_or_updation` (
  `id` int(11) NOT NULL,
  `itemID` int(11) NOT NULL,
  `employeeID` int(11) NOT NULL,
  `action` varchar(225) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `item_deletion_or_updation`
--

INSERT INTO `item_deletion_or_updation` (`id`, `itemID`, `employeeID`, `action`) VALUES
(1, 36, 35, 'Updated'),
(2, 36, 35, 'Updated'),
(3, 4, 35, 'Updated'),
(4, 4, 35, 'Updated'),
(5, 19, 35, 'Updated'),
(6, 19, 35, 'Updated'),
(7, 36, 35, 'Deleted'),
(8, 37, 35, 'Deleted'),
(9, 39, 35, 'Updated'),
(10, 39, 35, 'Updated'),
(11, 1, 35, 'Updated'),
(12, 5, 35, 'Updated'),
(13, 11, 35, 'Deleted'),
(14, 12, 35, 'Deleted'),
(15, 13, 35, 'Deleted'),
(16, 40, 35, 'Deleted'),
(17, 19, 35, 'Updated'),
(18, 5, 35, 'Updated');

-- --------------------------------------------------------

--
-- Table structure for table `item_quantities`
--

CREATE TABLE `item_quantities` (
  `itemID` int(11) NOT NULL,
  `quantity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `id` int(11) NOT NULL,
  `role_name` varchar(255) NOT NULL,
  `departmentID` int(11) NOT NULL,
  `status` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`id`, `role_name`, `departmentID`, `status`) VALUES
(1, 'Driver', 1, 'ACTIVE'),
(2, 'Agent', 2, 'ACTIVE'),
(3, 'Admin', 3, 'ACTIVE'),
(4, 'Operator', 4, 'ACTIVE'),
(5, 'supervisor', 3, 'ACTIVE'),
(6, 'Human Resource', 3, 'ACTIVE');

-- --------------------------------------------------------

--
-- Table structure for table `serial_number`
--

CREATE TABLE `serial_number` (
  `id` int(11) NOT NULL,
  `serial_number` varchar(255) NOT NULL,
  `state_of_item` varchar(255) NOT NULL,
  `depreciation_rate` varchar(255) NOT NULL,
  `itemID` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` varchar(255) NOT NULL,
  `taker` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `serial_number`
--

INSERT INTO `serial_number` (`id`, `serial_number`, `state_of_item`, `depreciation_rate`, `itemID`, `date`, `status`, `taker`, `quantity`) VALUES
(4, 'N860W0B9750', 'New', '90%', 1, '2024-03-18 08:36:56', 'In', NULL, 0),
(30, 'CKA/FF/19/053', 'New', '90%', 41, '2024-03-18 08:54:21', 'In', NULL, 1),
(31, 'N860W0B9751', 'New ', '90%', 1, '2024-03-18 08:38:25', 'In', NULL, 1),
(33, 'N860W0B9752', 'New', '90%', 1, '2024-03-18 08:40:26', 'In', NULL, 1),
(34, 'N860W0B9753', 'New', '90%', 1, '2024-03-28 14:12:42', 'In', NULL, 0),
(35, '81805130', 'New', '90%', 5, '2024-03-18 08:43:10', 'In', NULL, 1),
(36, '81462069', 'New', '90%', 5, '2024-03-18 08:43:32', 'In', NULL, 1),
(37, '81356030', 'New', '90%', 5, '2024-03-18 08:43:52', 'In', NULL, 1),
(38, '81917721', 'New', '90%', 5, '2024-03-18 08:44:15', 'In', NULL, 1),
(39, 'CDN2044PMN', 'New', '90%', 19, '2024-03-18 08:50:02', 'In', NULL, 1),
(40, 'CDN2044PP8', 'New', '90%', 19, '2024-03-18 08:50:24', 'In', NULL, 1),
(41, '5CG84977ZD', 'New', '90%', 19, '2024-03-18 08:50:47', 'In', NULL, 1),
(42, 'CO2YXAAALVCF', 'New', '90%', 38, '2024-03-18 08:51:18', 'In', NULL, 1),
(43, 'CKA/FF/19/044', 'New', '90%', 41, '2024-03-18 08:54:51', 'In', NULL, 1),
(44, 'CKA/FF/19/050', 'New', '90%', 42, '2024-03-18 08:56:46', 'In', NULL, 1),
(45, 'CKA/FF/19/051', 'New', '90%', 42, '2024-03-18 08:59:32', 'In', NULL, 1),
(46, 'CKA/FF/19/043', 'New', '90%', 41, '2024-03-18 09:00:18', 'In', NULL, 1),
(47, 'CKA/FF/18/004', 'New', '90%', 43, '2024-03-18 09:02:23', 'In', NULL, 1),
(48, 'CKA/FF/19/031', 'New', '90%', 43, '2024-03-18 09:02:59', 'In', NULL, 1),
(49, 'CKA/FF/18/005', 'New', '90%', 43, '2024-03-18 09:03:40', 'In', NULL, 1),
(50, 'Bi300701374', 'New', '90%', 44, '2024-03-18 09:09:47', 'In', NULL, 1),
(51, 'Bi300701371', 'New', '90%', 44, '2024-03-18 09:10:14', 'In', NULL, 1),
(52, 'CKA/IT/17/069', 'Old', '23%', 45, '2024-03-28 14:35:18', 'In', NULL, 0),
(57, 'CKA/ IT/ 19/077', 'New', '90%', 46, '2024-04-04 11:11:55', 'In', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `supervisor_hr_purchase`
--

CREATE TABLE `supervisor_hr_purchase` (
  `id` int(11) NOT NULL,
  `expenditure_line` varchar(255) NOT NULL,
  `amount` varchar(255) NOT NULL,
  `cost_method` varchar(255) NOT NULL,
  `supervisor` int(11) NOT NULL,
  `end_goal` varchar(255) NOT NULL,
  `quotation` blob NOT NULL,
  `status` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `priority` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `employeeID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `supervisor_hr_purchase`
--

INSERT INTO `supervisor_hr_purchase` (`id`, `expenditure_line`, `amount`, `cost_method`, `supervisor`, `end_goal`, `quotation`, `status`, `email`, `priority`, `date`, `employeeID`) VALUES
(1, 'Kiosk', '100,000', 'once-off', 31, 'For money transfer', '', 'Approved', 'christianflex700@gmail.com', 'cyan', '0000-00-00', 43),
(2, 'Air Conditioner', '20,000', 'once-off', 38, 'Temperature', '', 'Approved', 'christianflex700@gmail.com', 'cyan', '0000-00-00', 43),
(3, 'Bottle', '1,000', 'once-off', 31, 'For field work', '', 'Denied', 'christianflex700@gmail.com', 'cyan', '0000-00-00', 43),
(4, 'Tape', '1,000', 'once-off', 31, 'For utility Inspection', '', 'Approved', 'christianflex700@gmail.com', 'green', '0000-00-00', 43);

-- --------------------------------------------------------

--
-- Table structure for table `supervisor_hr_request`
--

CREATE TABLE `supervisor_hr_request` (
  `id` int(11) NOT NULL,
  `supervisorID` int(11) NOT NULL,
  `employeeID` int(11) NOT NULL,
  `itemID` int(11) NOT NULL,
  `categoryID` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `date_approved` varchar(255) NOT NULL,
  `amount` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `priority` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `supervisor_hr_request`
--

INSERT INTO `supervisor_hr_request` (`id`, `supervisorID`, `employeeID`, `itemID`, `categoryID`, `description`, `date_approved`, `amount`, `email`, `status`, `priority`) VALUES
(1, 31, 43, 46, 1, 'Office Use', 'Apr 11, 2024', '2', 'christianflex700@gmail.com', 'Approved', 'cyan'),
(2, 31, 43, 42, 1, 'For office use', 'Apr 15, 2024', '1', 'christianflex700@gmail.com', 'Approved', 'green');

-- --------------------------------------------------------

--
-- Table structure for table `supplier`
--

CREATE TABLE `supplier` (
  `id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `supplier`
--

INSERT INTO `supplier` (`id`, `first_name`, `address`, `phone`, `email`, `createdAt`, `status`) VALUES
(1, 'Dongguan Youli Electronic Technology', 'China', '+423233425234', 'technology@gmail.com', '2024-03-28 12:57:18', 'ACTIVE'),
(2, 'China', 'China', '02390234123', 'china@gmail.com', '2024-01-09 14:11:42', 'ACTIVE'),
(3, 'Great', 'Kigali-CHIC', '0788888888', 'greatstore250@gmail.com', '2024-01-12 09:28:38', 'ACTIVE'),
(4, 'Ihaha', 'Kigali-2000-hotel', '07888987723', 'ihahastore@gmail.com', '2024-02-20 07:19:17', 'ACTIVE'),
(5, 'Inyange', 'Kigali-chic', '0789879869', 'inyangeindustries@gmail.com', '2024-02-20 07:22:12', 'ACTIVE');

-- --------------------------------------------------------

--
-- Table structure for table `trustedsupplier`
--

CREATE TABLE `trustedsupplier` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `date_entered` varchar(255) NOT NULL,
  `end_of_contract` varchar(255) NOT NULL,
  `product` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trustedsupplier`
--

INSERT INTO `trustedsupplier` (`id`, `name`, `date_entered`, `end_of_contract`, `product`, `email`, `address`) VALUES
(1, 'NexGo', '2024-04-01', '2024-04-26', 'POS', 'nexgo@gmail.com', 'China'),
(2, 'Bi', '2024-04-01', '2024-04-26', 'POS', 'bi@gmail.com', 'China'),
(3, 'NFC', '2024-04-01', '2024-04-26', 'POS', 'nfc@gmail.com', 'China');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `department`
--
ALTER TABLE `department`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD KEY `roleID` (`roleID`),
  ADD KEY `departmentID` (`departmentID`);

--
-- Indexes for table `employee_supervisor_purchase`
--
ALTER TABLE `employee_supervisor_purchase`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employee_supervisor_request`
--
ALTER TABLE `employee_supervisor_request`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categoryID_FK` (`categoryID`),
  ADD KEY `itemID_FK` (`itemID`),
  ADD KEY `employeeName` (`employeeID`),
  ADD KEY `supervisorFK` (`supervisor_concerned`);

--
-- Indexes for table `hr_admin_request`
--
ALTER TABLE `hr_admin_request`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `item`
--
ALTER TABLE `item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `supplierID` (`supplierID`),
  ADD KEY `categoryID` (`categoryID`);

--
-- Indexes for table `item_deletion_or_updation`
--
ALTER TABLE `item_deletion_or_updation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_FK` (`employeeID`),
  ADD KEY `item_FK` (`itemID`);

--
-- Indexes for table `item_quantities`
--
ALTER TABLE `item_quantities`
  ADD PRIMARY KEY (`itemID`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `trustedsupplier`
--
ALTER TABLE `trustedsupplier`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `trustedsupplier`
--
ALTER TABLE `trustedsupplier`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
