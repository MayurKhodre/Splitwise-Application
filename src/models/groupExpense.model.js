import mongoose, { Schema } from "mongoose";

const groupExpenseSchema = new Schema({
    description: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    group: {
        type: Schema.Types.ObjectId,
        ref: "Group",
        required: true
    },
    paidBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    splitBetween: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }]
});

export const GroupExpense = mongoose.model("GroupExpense", groupExpenseSchema);
