var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:id', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/mails', (req, res ) => {
  res.json({})
})

module.exports = router;
