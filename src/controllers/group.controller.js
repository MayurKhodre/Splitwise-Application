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
    try {
        const { description, amount, paidBy, splitBetween } = req.body;
        if (
            [description, amount, paidBy, splitBetween].some(
                (field) => field?.trim() === ""
            )
        ) {
            throw new ApiError(400, "All fields are required");
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
    } catch (error) {
        console.log("Error in creating group expense");
        throw new ApiError(500, "Failed to create group expense");
    }
});

// Get all groups for a user
// router.get("/users/:userId/groups", async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const user = await User.findById(userId).populate("groups");
//         res.status(200).json(user.groups);
//     } catch (error) {
//         res.status(500).json({ error: "Unable to get groups" });
//     }
// });

// Get all expenses for a group
// router.get("/groups/:groupId/expenses", async (req, res) => {
//     try {
//         const { groupId } = req.params;
//         const expenses = await GroupExpense.find({ group: groupId });
//         res.status(200).json(expenses);
//     } catch (error) {
//         res.status(500).json({ error: "Unable to get expenses" });
//     }
// });

export { createNewGroup, addExpenseToGroup };
