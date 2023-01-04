import mongoose from "mongoose";
import { Comment, Post } from "./models";

interface Pagination {
  limit: string;
  offset: string;
}

interface CommentInput {
  input: {
    name: string;
    email: string;
    body: string;
    postId: string;
  };
}

interface PostInput {
  input: {
    title: string;
    body: string;
    comments?: CommentInput[];
  };
}

// TODO: improve with error codes
function rejectIf(condition: boolean) {
  if (condition) {
    throw new Error("Missing data or not found");
  }
}

export const resolvers = {
  Query: {
    post: async (_root: any, { title }: { title: string }) => {
      return await Post.find({ title: title });
    },
    posts: async (_root: any, { limit, offset }: Pagination) => {
      return await Post.find({}).limit(parseInt(limit)).skip(parseInt(offset));
    },
  },

  Mutation: {
    createPost: (_root: any, { input }: PostInput) => {
      rejectIf(!input);
      return Post.create({ ...input });
    },
    createComment: async (_root: any, { input }: CommentInput) => {
      rejectIf(!input || !input.postId);
      const newComment = new Comment({
        name: input.name,
        email: input.email,
        body: input.body,
        post: input.postId,
      });
      const createdComment = await newComment.save();
      const post = await Post.findById({
        _id: new mongoose.Types.ObjectId(input.postId),
      });
      rejectIf(!post);

      if (post) {
        post.comments.push(createdComment._id);
        await post.save();
      }

      return createdComment.populate("post", ["title", "body"]);
    },
  },

  Post: {
    async comments(parent: { _id: any }) {
      return await Comment.find({ post: parent._id });
    },
  },

  Comment: {
    async post(parent: { post: any }) {
      return await Post.findById(parent.post);
    },
  },
};
