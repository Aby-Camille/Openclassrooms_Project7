const User = require('./models/user');

//Signup
exports.userSignup = async(req, res) => {
    // hacher le mot de passe
    const password = req.body.password;
    const user = new User({ email: req.body.email, password });
  
    try {
      await user.save();
      res.sendStatus(200);
    } catch(error) {
      console.error(error);
      res.statusMessage(error);
      res.sendStatus(500);
    }
  };

//Login
exports.userLogin = async(req, res) => {
    
    const password = req.body.password;
    const user = await User.findOne({ email: req.body.email, password });
  
    if (user) {
      res.status(200).json({
         usrId: user._id, 
         token: 'jwt' });
      return;
    }
  
    res.sendStatus(404);
  };