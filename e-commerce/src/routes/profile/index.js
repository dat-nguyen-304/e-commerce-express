const express = require('express');
const profileController = require('../../controllers/profile.controller.js');
const { grantAccess } = require('../../middleware/rbac.js');
const router = express.Router();

router.get(
  '/view-any',
  grantAccess('readAny', 'profile'),
  profileController.profiles,
);
router.get(
  '/view-own',
  grantAccess('readOwn', 'profile'),
  profileController.profile,
);

module.exports = router;
