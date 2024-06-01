import mongoose, { Schema } from "mongoose";

const groupSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
});

export const Group = mongoose.model("Group", groupSchema);
