import Post from "../models/Post.js";
import User from "../models/User.js";

/** CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: {},
    });

    await newPost.save();

    // grab all the posts
    const post = await Post.find();

    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/** READ */
export const getFeedPosts = async (req, res) => {
  try {
    // grab all the posts
    const post = await Post.find();

    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    // fetch the post info
    const post = await Post.findById(id);
    // fetch whether user liked it
    const isLiked = post.likes.get(userId);
    if (isLiked) {
      // is already liked, so delete the user like
      post.likes.delete(userId);
    } else {
      // not yet liked, so add the user like
      post.likes.set(userId, true);
    }

    // lastly, update the post
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );
    //  return the updated post to the client
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};
