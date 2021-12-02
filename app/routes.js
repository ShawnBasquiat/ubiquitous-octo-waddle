const { ObjectId } = require('bson');

module.exports = function(app, passport, db) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('recipes').find({user: req.user.local.email}).toArray((err, result) => {
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user,
            posts: result
          })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// message board routes ===============================================================
app.get('https://api.edamam.com/search', isLoggedIn, function(req, res) {
  db.collection('posts').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {
      user : req.user,
      posts: result
    })
  })
});

app.get('/recipes', isLoggedIn, function(req, res) {
  db.collection('posts').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('recipes.ejs', {
      user : req.user,
      posts: result
    })
  })
});
// recipe-  key: f85d1a2472b0f4835ada53850740ab5f	—   id: 1e77532d
// anaylsis- key: 77fa76cd15e1911cfda979e6b134e224	—id:542df651
//https://api.edamam.com/api/recipes/v2?api_key=f85d1a2472b0f4835ada53850740ab5f&api_id=1e77532d&q=beef didnt work
//this works https://api.edamam.com/search?q=${search}&ingr=10&time=30&app_id=1e77532d&app_key=f85d1a2472b0f4835ada53850740ab5f



app.post('/addRecipe', (req, res) => {
  db.collection('recipes').findOneAndUpdate({...req.body, user: req.user.local.email},{
    $set: {
      ...req.body,
      user: req.user.local.email
    }
  },{
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.send("saved")
  })
})

    app.delete('/removeRecipe', (req, res) => {
      const ObjectID = require('mongodb').ObjectId
      db.collection('recipes').findOneAndDelete({_id: ObjectID(req.body.id)}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
