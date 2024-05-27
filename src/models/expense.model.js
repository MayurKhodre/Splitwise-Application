import mongoose, { Schema } from "mongoose";

const expenseSchema = new Schema({
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    paidBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
    // participants: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'User'
    // }]
},
{
	timestamps: true
});

export const Expense = mongoose.model("Expense", expenseSchema);
