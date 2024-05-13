import mongoose, { Schema } from "mongoose";

const chatMessageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true,
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true,
    },
    message: {
        type: String,
        required: true,
    }
},
{
	timestamps: true
});

export const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);
