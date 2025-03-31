import mongoose from "mongoose";

const TheaterSchema = new mongoose.Schema({
  theaterId: {
    type: Number,
    required: true,
    unique: true,
  },
  location: {
    address: {
      street1: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipcode: { type: String, required: true },
    },
    geo: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: (arr: number[]) => arr.length === 2,
          message: "Coordinates must contain exactly two numbers",
        },
      },
    },
  },
});

TheaterSchema.index({ "location.geo": "2dsphere" });

export const Theater =
  mongoose.models.Theater || mongoose.model("Theater", TheaterSchema);