const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: "Templates route funcionando"
  });
});

module.exports = router;