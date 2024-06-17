import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Group } from "../models/group.model.js";
import { User } from "../models/user.model.js";
import { GroupExpense } from "../models/groupExpense.model.js";

// const calculateSplit = (amount, members) => {
//     const share = amount / members.length;
//     return members.map((member) => ({
//         member,
//         share,
//     }));
// };

const createNewGroup = asyncHandler(async (req, res) => {
    // get the name and expense participants from request
    // validate both fields
    // validate all the user IDs present in db
    // create an object to store in db
    // save the group to db
    // update the joined group to each member(user)
    // return success and group info
    try {
        const { name, memberIds } = req.body;

        if (!name || !memberIds) {
            throw new ApiError(401, "Name and member IDs are required");
        }

        const members = await User.find({ _id: { $in: memberIds } });

        if (members.length !== memberIds.length || !members) {
            throw new ApiError(404, "Some members not found");
        }

        const group = new Group({ name, members });
        await group.save();

        const createdGroup = await Group.findById(group._id);
        if (!createdGroup) {
            throw new ApiError(500, "Failed to create group");
        }

        await User.updateMany(
            { _id: { $in: memberIds } },
            { $push: { groups: group._id } }
        );

        return res
            .status(200)
            .json(
                new ApiResponse(200, createdGroup, "Group created successfully")
            );
    } catch (error) {
        console.log("Error in creating group: ", error);
        throw new ApiError(401, "Failed to create group");
    }
});

const addExpenseToGroup = asyncHandler(async (req, res) => {
    // get the group ID and expense details from request
    // validate both fields
    // validate the group ID present in db
    // create an object to store in db
    // save the expense to db
    // update the expense to each member(user)
    // return success and expense info

    const { description, amount, paidBy, splitBetween } = req.body;
    if (
        !description?.trim() || typeof amount !== "number" || isNaN(amount) || amount <= 0 ||
        !paidBy?.trim() || !Array.isArray(splitBetween) || splitBetween.length === 0) {
        throw new ApiError(400, "All fields are required and must be valid");
    }

    const { groupId } = req.params;

    if (!groupId) {
        throw new ApiError(400, "Group ID is required");
    }

    const groupExpense = new GroupExpense({
        description,
        amount,
        group: groupId,
        paidBy,
        splitBetween,
    });

    // const split = calculateSplit(amount, splitBetween);
    // expense.splitDetails = split; // Assume you add a splitDetails field to GroupExpense model

    await groupExpense.save();

    const createdGroupExpense = await GroupExpense.findById(
        groupExpense._id
    );
    if (!createdGroupExpense) {
        throw new ApiError(500, "Failed to create group expense");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                createdGroupExpense,
                "Group expense created successfully"
            )
        );
});

const getGroupExpense = asyncHandler(async (req, res) => {
    try {
        const { groupId } = req.params;
        if(!groupId){
            throw new ApiError(401, "Group ID is required");
        }

        const expenses = await GroupExpense.find({ group: groupId });
        if(!expenses){
            throw new ApiError(401, "Group not found");
        }

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                expenses,
                "Groups expenses sended successfully"
            )
        );

    } catch (error) {
        console.log('Error while fetching group expenses: ', error);
        throw new ApiError(500, "Unable to get group expenses");
    }
});

const getUserGroups = asyncHandler(async (req, res) => {
    // get userId from req.params
    // validated user exists or not
    // if user exists get the list of groups from user schema
    // send the group list as response
    try {
        const { userId } = req.params;

        if (!userId) {
            throw new ApiError(401, "User ID is required");
        }

        const user = await User.findById(userId).populate('groups');

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200, user.groups, "Groups retrieved successfully")
            );
    } catch (error) {
        console.log("Error in retrieving groups: ", error);
        throw new ApiError(401, "Failed to retrieve groups");
    }
});


export {
    createNewGroup,
    addExpenseToGroup,
    getGroupExpense,
    getUserGroups
};
