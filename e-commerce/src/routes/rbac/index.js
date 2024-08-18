const express = require('express');
const {
  newResource,
  newRole,
  resources,
  roles,
} = require('../../controllers/rbac.controller.js');
const asyncHandler = require('../../helpers/asyncHandler');
const router = express.Router();

router.post('/role', asyncHandler(newRole));
router.get('/roles', asyncHandler(roles));

router.post('/resource', asyncHandler(newResource));
router.get('/resources', asyncHandler(resources));

module.exports = router;
