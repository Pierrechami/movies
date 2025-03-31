import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
  name: String,
  email: String,
  movie_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
  },
  text: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

export const Comment =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema, "comments");
