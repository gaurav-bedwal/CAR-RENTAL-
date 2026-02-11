<?php
include("config/db.php");
session_start();

if(!isset($_SESSION['user'])){
    header("Location: login.php");
}

$car_id = $_GET['id'];
$user_id = $_SESSION['user'];

$conn->query("INSERT INTO bookings (user_id, car_id, booking_date, return_date, total_amount)
VALUES ($user_id, $car_id, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 2 DAY), 4000)");

$conn->query("UPDATE cars SET availability=0 WHERE id=$car_id");

header("Location: dashboard.php");
?>
