const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: "Projects route funcionando"
  });
});

module.exports = router;


const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: "AI route funcionando"
  });
});

module.exports = router;


const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: "Templates route funcionando"
  });
});

module.exports = router;


const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: "Deploy route funcionando"
  });
});

module.exports = router;
