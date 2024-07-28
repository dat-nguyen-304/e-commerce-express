const CommentService = require('../services/comment.service');
const { OK } = require('../core/success.response');

class CommentController {
  createComment = async (req, res, next) => {
    new OK({
      message: 'create new comment',
      metadata: await CommentService.createComment(req.body),
    }).send(res);
  };

  getCommentsByParentId = async (req, res, next) => {
    new OK({
      message: 'get comment(s)',
      metadata: await CommentService.getCommentsByParentId(req.query),
    }).send(res);
  };
}

module.exports = new CommentController();
