const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const db = require('./db'); // Importér forbindelsen

app.use(cors());
app.use("/static", express.static("public"));
app.use((req, res, next) => {
    console.log("----- HTTP Request -----");
    console.log(`Method: ${req.method}`); // HTTP Method
    console.log(`URL: ${req.originalUrl}`); // Requested URL
    console.log("Headers:", req.headers); // Request Headers
    console.log(`IP: ${req.ip}`); // IP Address
    console.log("------------------------");
    next();
});

// Angiv EJS som templating engine
app.set('view engine', 'ejs');

// Opret en route
app.get('/', (req, res) => {
    res.render('index', { title: 'Velkommen til EJS', message: 'Hej fra EJS!' });
});

// Start serveren
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveren kører på http://localhost:${PORT}`);
});
