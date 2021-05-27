const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');


const User = require('../../models/User');
const { route } = require('./profile');

// @route   api/user/test
// @desc    Tests user routes
// @access  public
router.get('/test', (req, res) => res.json({ success: 'User routes active!' }));


// @route   api/user/register
// @desc    Registers a user
// @access  public
router.post('/register', (req, res) => {
    const { body } = req;
    User.findOne({ email: body.email }).then(user => {
        if (user) {
            return res.status(400).json({ error: 'Email already exists' });
        } else {
            const user = new User({
                name: body.name,
                password: body.password,
                email: body.email,
                imageUrl: body.imageUrl,
            });
            // generate salt(buffer after/before password?). Store hash in DB(encrypted password)
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(user.password, salt, (err, hash) => {
                    if (err) throw err;
                    user.password = hash;
                    user.save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });
            });
        }
    })
});

// @route   api/user/login
// @desc    Validates a user and returns a jwt token
// @access  public
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email }).then(user => {
        if (!user) {
            return res.status(400).json({ error: 'User does not exist' });
        }
        bcrypt.compare(password, user.password).then(matched => {
            if (matched) {
                // return res.json({ msg: 'Success' });
                const userPayload = {
                    id: user.id,
                    name: user.name,
                    imageUrl: user.imageUrl
                };
                jwt.sign(
                    userPayload,
                    keys.authenticationKey,
                    { expiresIn: 3600 },
                    (err, token) => {
                        res.json({ token: `Bearer ${token}` });
                    }
                );
            } else {
                return res.status(400).json({ error: 'Password invalid' });
            }
        })
    })
});

//@route    /api/user/current
//@desc     Returns the logged user info
//@access   Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json(req.user);
})


// @route   api/user/getusers
// @desc    Returns the list of all users
// @access  public
router.get('/getusers', (req, res) => {
    User.find().then(users => {
        return res.json(users);
    });
});

module.exports = router;