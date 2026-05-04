const run = async () => {
    try {
        const loginRes = await fetch("http://localhost:3000/api/user/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: "gauravbedwal1105@gmail.com",
                password: "G@urav1234"
            })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log("Logged in:", loginData.success);

        if (!token) return console.log("Login failed");

        // get a car to book
        const carsRes = await fetch("http://localhost:3000/api/user/cars");
        const carsData = await carsRes.json();
        const car = carsData.cars[0];

        // create order
        const orderRes = await fetch("http://localhost:3000/api/bookings/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                car: car._id,
                pickupDate: new Date().toISOString(),
                returnDate: new Date(Date.now() + 86400000).toISOString(),
                bookingMode: "daily"
            })
        });
        const orderData = await orderRes.json();
        console.log("Order created:", orderRes.status, orderData);

        const bookingsRes = await fetch("http://localhost:3000/api/bookings/user", {
            headers: { Authorization: `Bearer ${token}` }
        });

        const status = bookingsRes.status;
        const data = await bookingsRes.text();
        console.log("Bookings fetched:", status, data);
    } catch (e) {
        console.error("Error occurred:", e.message);
    }
}
run();
