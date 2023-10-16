import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    location: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    likes: {
      type: Map,
      of: Boolean,
    },
    comments: {
      type: Array,
      default: [],
    },
  },
  { timestamp: true }
);

const Post = mongoose.model("Post", PostSchema);
export default Post;
