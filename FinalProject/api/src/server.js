const express = require('express');

const app = express();
const PORT = process.env.PORT;

// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));

const router = express.Router();

app.use("/api", router);

// custom routes
const loginRouter = require('./login/loginRouter');
const usersRouter = require('./users/usersRouter');

// use custom routes
app.use('/login', loginRouter);
app.use('/users', usersRouter);

module.exports = router;