const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');
const cors = require('cors');


// Database
const configDB = require('./app/config/database.js');
mongoose.connect(configDB.url, {useNewUrlParser: true, useUnifiedTopology: true});
require('./app/config/passport')(passport);

var corsOptions = {
    origin: "http://localhost:8081"
};
app.use(cors(corsOptions));

app.use(morgan('dev'));
app.use(cookieParser());
// parse requests of content-type - application/x-www-form-urlencoded
// might need to change false to true
app.use(bodyParser.urlencoded({extended: false}));
// parse requests of content-type - application/json
app.use(bodyParser.json());
app.use(session({secret: 'anystringoftext',
                saveUninitialized: true,
                resave: true
            }));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.set('view engine', 'ejs');


const db = require('./app/models');
const Role = db.role;
db.sequelize.sync();

// db.sequelize.sync({force: true}).then(() => {
//     console.log('Drop and Resync Db');
//     initial();
// });

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/routes.js')(app, passport);

app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});
