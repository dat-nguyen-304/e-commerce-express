const { UnauthorizedError } = require('../core/error.response');
const rbac = require('./role.middleware');

const grantAccess = (action, resource) => {
  return async (req, res, next) => {
    try {
      const role_name = req.query.role;
      const permission = rbac.can(role_name)[action](resource);
      if (!permission.granted) {
        throw new UnauthorizedError('You do not have permission');
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  grantAccess,
};
