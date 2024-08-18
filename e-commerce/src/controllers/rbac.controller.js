const { OK } = require('../core/success.response');
const {
  createResource,
  createRole,
  resourceList,
  roleList,
} = require('../services/rbac.service');

const newResource = async (req, res, next) => {
  new OK({
    message: 'Create resource successfully',
    metadata: await createResource(req.body),
  }).send(res);
};

const newRole = async (req, res, next) => {
  new OK({
    message: 'Create role successfully',
    metadata: await createRole(req.body),
  }).send(res);
};

const roles = async (req, res, next) => {
  new OK({
    message: 'Get list role',
    metadata: await roleList(req.query),
  }).send(res);
};

const resources = async (req, res, next) => {
  new OK({
    message: 'Get list role',
    metadata: await resourceList(req.query),
  }).send(res);
};

module.exports = {
  newResource,
  newRole,
  roles,
  resources,
};
