require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

require('./Databaseconnections/conn');

const gymroute = require('./Routes/gymroute');
const membershipRoute = require('./Routes/membershipRoute');
const memberRoute = require('./Routes/memberRoute');

app.use("/auth", gymroute);
app.use("/membership", membershipRoute);
app.use("/member", memberRoute);

app.listen(PORT, () => {
  console.log(`GymEase Backend listening at http://localhost:${PORT}`);
});