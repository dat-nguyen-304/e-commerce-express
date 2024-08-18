const { OK } = require('../core/success.response');

const dataProfile = [
  {
    user_id: 1,
    user_name: 'user 1',
    user_avt: 'image.com/user/1',
  },
  {
    user_id: 2,
    user_name: 'user 2',
    user_avt: 'image.com/user/2',
  },
  {
    user_id: 3,
    user_name: 'user 3',
    user_avt: 'image.com/user/3',
  },
];

class ProfileController {
  profiles = async (req, res, next) => {
    new OK({
      message: 'Get all profiles successfully',
      metadata: dataProfile,
    }).send(res);
  };

  profile = async (req, res, next) => {
    new OK({
      message: 'Get one profile successfully',
      metadata: dataProfile[0],
    }).send(res);
  };
}

module.exports = new ProfileController();
