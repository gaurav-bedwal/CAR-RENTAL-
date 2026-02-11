<?php
include("config/db.php");
include("includes/header.php");

if(isset($_POST['login'])){
    $email = $_POST['email'];
    $password = $_POST['password'];

    $stmt = $conn->prepare("SELECT * FROM users WHERE email=?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if($user && password_verify($password, $user['password'])){
        $_SESSION['user'] = $user['id'];
        header("Location: dashboard.php");
    } else {
        echo "Invalid Credentials";
    }
}
?>

<form method="POST">
<input type="email" name="email" required>
<input type="password" name="password" required>
<button name="login">Login</button>
</form>

<?php include("includes/footer.php"); ?>
