import mongoose, { Schema } from "mongoose";

export const movieSchema = new Schema({
  title: { type: String, default: null },
  plot: { type: String, default: null },
  genres: [String],
  runtime: Number,
  cast: [String],
  poster: { type: String, default: null },
  fullplot: { type: String, default: null },
  languages: [String],
  released: Date,
  directors: [String],
  rated: String,
  awards: {
    wins: Number,
    nominations: Number,
    text: String,
  },
  lastupdated: String,
  year: Number,
  imdb: {
    rating: Number,
    votes: Number,
    id: Number,
  },
  countries: [String],
  type: { type: String, default: null },
  tomatoes: {
    viewer: {
      rating: Number,
      numReviews: Number,
      meter: Number,
    },
    fresh: Number,
    critic: {
      rating: Number,
      numReviews: Number,
      meter: Number,
    },
    rotten: Number,
    lastUpdated: String,
  },
  num_mflix_comments: Number,
  writers: [String],
}, { collection: "movies" });

export const Movie = mongoose.models.Movie || mongoose.model("Movie", movieSchema);
