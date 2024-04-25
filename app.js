const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());
const hallRoute = require("./routes/rooms")

app.get('/', (req, res) => res.send('<h1>HALL BOOKING API<h1>'));
app.use('/rooms',hallRoute);
app.listen(port, () => console.log(`Example app listening on port ${port}! http://localhost:${port}/`));