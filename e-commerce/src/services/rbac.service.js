const Resource = require('../models/resource.model');
const Role = require('../models/role.model');

const createResource = async ({
  name = 'profile',
  slug = 'p001',
  description = '',
}) => {
  try {
    const resource = await Resource.create({
      src_name: name,
      src_slug: slug,
      src_description: description,
    });

    return resource;
  } catch (error) {
    return error;
  }
};

const resourceList = async () => {
  try {
    const resource = await Resource.aggregate([
      {
        $project: {
          name: '$src_name',
          slug: '$src_slug',
          description: '$src_description',
          resourceId: '$_id',
          createdAt: 1,
        },
      },
    ]);
    return resource;
  } catch (error) {
    return [];
  }
};

const createRole = async ({
  name = 'shop',
  slug = 's0001',
  description = 'extend from shop or user',
  grants = [],
}) => {
  try {
    const role = await Role.create({
      role_name: name,
      role_slug: slug,
      role_description: description,
      role_grants: grants,
    });
    return role;
  } catch (error) {}
};

const roleList = async () => {
  try {
    const roles = await Role.aggregate([
      {
        $unwind: '$role_grants',
      },
      {
        $lookup: {
          from: 'Resources',
          localField: 'role_grants.resource',
          foreignField: '_id',
          as: 'resource',
        },
      },
      {
        $unwind: '$resource',
      },
      {
        $project: {
          role: '$role_name',
          resource: '$resource.src_name',
          action: '$role_grants.actions',
          attributes: '$role_grants.attributes',
        },
      },
      {
        $unwind: '$action',
      },
      {
        $project: {
          role: 1,
          resource: 1,
          action: 1,
          attributes: 1,
          _id: 0,
        },
      },
    ]);
    return roles;
  } catch (error) {}
};

module.exports = {
  createResource,
  resourceList,
  createRole,
  roleList,
};
