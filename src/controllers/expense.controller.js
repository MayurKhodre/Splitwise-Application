import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Expense } from "../models/expense.model.js";

// addExpense
// editExpense
// getExpense
// deleteExpense

const addExpense = asyncHandler( async (req, res) => {
    // get the amount & description from req.body
    // get the user details from req
    // create an object with given details
    // save the object in the database
    // return the status to the frontend

    const { amount, description } = req.body;

    if(!amount || !description) {
        throw new ApiError(401, "Amount and description should required");
    }
    
    console.log('add expense req.user', req.user);
    const user = req.user;

    if(!user) {
        throw new ApiError(401, "User not found");
    }

    const expense = await Expense.create({
        amount,
        description,
        paidBy: user._id
    });

    const createdExpense = await Expense.findById(expense._id);

    if (!createdExpense) {
        throw new ApiError(
            500,
            "Something went wrong while creating new expense"
        );
    }

    return res
        .status(201)
        .json(
            new ApiResponse(200, createdExpense, "Expense created successfully")
        );
});

export {
    addExpense
};
