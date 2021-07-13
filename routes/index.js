const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const { v4: uuidV4 } = require('uuid')



/////////////////////////////////////////////////////////////
// HOME ROUTE
/////////////////////////////////////////////////////////////
router.get('/' , ensureGuest, (req, res) => {
    res.render('home')
})


router.get('/dashboard' , ensureAuth, (req, res) => {
    res.render('dashboard')
})

router.get('/login' , ensureGuest, (req, res) => {
    res.render('login')
})

router.get("/join", ensureAuth, function (req, res) {
  res.render("join");
})
router.post("/join", ensureAuth, function (req, res) {
  const Meeting_link = req.body.link;
  console.log(req.body);
  console.log(Meeting_link);
  res.redirect(Meeting_link.toString());
});

router.get("/meeting", ensureAuth, async (req, res) => {
  try {
    res.redirect(`/${uuidV4()}`);
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

router.get('/:room', ensureAuth, (req, res) => {
  res.render('room', { roomId: req.params.room , displayName: req.user.displayName})
})

module.exports =router