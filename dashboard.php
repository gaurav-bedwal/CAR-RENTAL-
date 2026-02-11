<?php
include("config/db.php");
include("includes/header.php");

$user_id = $_SESSION['user'];

$result = $conn->query("SELECT cars.car_name, bookings.booking_date 
FROM bookings 
JOIN cars ON bookings.car_id = cars.id 
WHERE bookings.user_id = $user_id");

echo "<h2>Your Bookings</h2>";

while($row = $result->fetch_assoc()){
    echo "<p>".$row['car_name']." - ".$row['booking_date']."</p>";
}

include("includes/footer.php");
?>
