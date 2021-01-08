const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
const passport = require('passport');

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });


  app.get('/api/auth/signup', function(req, res){
      res.render('signup.ejs', { message: req.flash('signupMessage') });
  });
  app.post("/api/auth/signup",
    [
      verifySignUp.checkDuplicateEmail
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);
};