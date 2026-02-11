<?php
include("config/db.php");
include("includes/header.php");
?>

<h2>Available Cars</h2>
<input type="text" id="searchCar" placeholder="Search Car">

<?php
$result = $conn->query("SELECT * FROM cars WHERE availability=1");
while($row = $result->fetch_assoc()){
?>
<div class="car-card">
    <h3><?php echo $row['car_name']; ?></h3>
    <p>₹<?php echo $row['price_per_day']; ?>/day</p>
    <?php if(isset($_SESSION['user'])): ?>
        <a href="book.php?id=<?php echo $row['id']; ?>">Book Now</a>
    <?php else: ?>
        <a href="login.php">Login to Book</a>
    <?php endif; ?>
</div>
<?php } ?>

<?php include("includes/footer.php"); ?>
