const { NotFoundError } = require('../core/error.response');
const Comment = require('../models/comment.model');
const { convertToObjectIdMongodb } = require('../utils');
const ProductService = require('../services/product.service');

class CommentService {
  static async createComment({ productId, userId, content, parentCommentId }) {
    const foundProduct = await ProductService.findProductById({ productId });
    if (!foundProduct) throw new NotFoundError('Product not found!');
    const comment = new Comment({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: parentCommentId,
    });

    let rightValue;
    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) throw new NotFoundError('Parent comment not found');
      rightValue = parentComment.comment_right;

      await Comment.updateMany(
        {
          comment_productId: convertToObjectIdMongodb(productId),
          comment_right: { $gte: rightValue },
        },
        {
          $inc: { comment_right: 2 },
        },
      );

      await Comment.updateMany(
        {
          comment_productId: convertToObjectIdMongodb(productId),
          comment_left: { $gt: rightValue },
        },
        {
          $inc: { comment_left: 2 },
        },
      );
    } else {
      const maxRightValue = await Comment.findOne(
        {
          comment_parentId: convertToObjectIdMongodb(productId),
        },
        'comment_right',
        { sort: { comment_right: -1 } },
      );
      if (maxRightValue) {
        rightValue = maxRightValue.right + 1;
      } else {
        rightValue = 1;
      }
    }
    console.log({ rightValue });
    comment.comment_left = rightValue;
    comment.comment_right = rightValue + 1;
    await comment.save();
    return comment;
  }

  static async getCommentsByParentId({
    productId,
    parentCommentId,
    limit = 50,
    offset,
  }) {
    let comments;
    if (parentCommentId) {
      const parent = await Comment.findById(parentCommentId);
      if (!parent) throw new NotFoundError('Not found comment');
      comments = Comment.find({
        comment_productId: convertToObjectIdMongodb(productId),
        comment_left: { $gt: parent.comment_left },
        comment_right: { $lte: parent.comment_right },
      });
    } else {
      comments = Comment.find({
        comment_productId: convertToObjectIdMongodb(productId),
        comment_parentId: null,
      });
    }
    return await comments
      .select({
        comment_left: 1,
        comment_right: 1,
        comment_content: 1,
        comment_parentId: 1,
      })
      .sort({ comment_left: 1 });
  }

  static async deleteComment({ commentId, productId }) {
    const foundProduct = await ProductService.findProductById({ productId });
    if (!foundProduct) throw new NotFoundError('Product not found!');
    const foundComment = await Comment.findById(commentId);
    if (!foundComment) throw new NotFoundError('Comment not found!');

    const leftValue = foundComment.comment_left;
    const rightValue = foundComment.comment_right;
    const width = rightValue - leftValue + 1;
    await Comment.deleteMany({
      comment_productId: convertToObjectIdMongodb(productId),
      comment_left: { $gte: leftValue, $lte: rightValue },
    });

    await Comment.updateMany(
      {
        comment_productId: convertToObjectIdMongodb(productId),
        comment_right: { $gt: rightValue },
      },
      {
        $inc: { comment_right: -width },
      },
    );

    await Comment.updateMany(
      {
        comment_productId: convertToObjectIdMongodb(productId),
        comment_left: { $gt: rightValue },
      },
      {
        $inc: { comment_left: -width },
      },
    );
  }
}

module.exports = CommentService;
