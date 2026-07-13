require('dotenv').config({ path: '.env.local' });
console.log("Email:", process.env.SHIPROCKET_EMAIL);
console.log("Password:", process.env.SHIPROCKET_PASSWORD);
console.log("Pickup:", process.env.SHIPROCKET_PICKUP_LOCATION);
