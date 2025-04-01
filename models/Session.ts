import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
    {
        user_id: {
            type: String,
            required: true,
        },
        jwt: {
            type: String,
            require: true,
        },
    },
    { timestamps: true }
);

export const Session = mongoose.models.Session || mongoose.model("Session", sessionSchema);
