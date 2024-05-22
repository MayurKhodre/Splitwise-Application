import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while creating access and refresh token");
    }
}

const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // validate all the input fields
    // check if user already exists (with username/email)
    // check for image/avatar files, weather they are present or not
    // upload the image files to cloudinary and get the url of uploaded file
    // create user object - create entry in db
    // remove password the refresh token from response
    // check for user creation+
    // return response
    
    const { fullName, email, userName, password } = req.body;
    
    if([fullName, email, userName, password].some((field) => field?.trim() === "")){
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ userName }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, "User with same email or username already exists");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if(!avatarLocalPath) {
        console.log('inside if avatarLocalPath: ', avatarLocalPath);
        throw new ApiError(400, "Avatar file is required ln 41");
    }
    
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    
    if(!avatar){
        throw new ApiError(400, "Avatar file is required ln 48");
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        userName: userName.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select( // to verify user is created or not
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    );
});

const loginUser = asyncHandler( async (req, res) => {
    // get the credentials from user
    // validate the fields
    // check the user present in db or not
    // if user not present throw error
    // match the password with stored user password
    // if password not match throw error
    // create access and refresh token and save refresh token on db
    // send accessToken and refresh token in cookie with user

    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Please provide both email and password");
    }
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    const loggedInUser = await user.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, {
                user: loggedInUser,
                accessToken,    // Sending both tokens in json, if user wants to store locally at their end.
                refreshToken
            },
            "User logged in Successfully"
        )
    )
});

const logoutUser = asyncHandler( async(req, res) => {
    // write logout functionality here
})

export {
    registerUser,
    loginUser,
    logoutUser
};