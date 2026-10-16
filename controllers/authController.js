import bcrypt from "bcryptjs";
import User from "../models/Users.js";
import generateToken from "server/utils/generateToken.js";


// Register a new dokandar or stuff 
// POST  /api/auth/register
export const registerUser = async (req, res) => {
    try {
        const { name, ownerName, shopName, phone, address, password, role } = req.body;

        // check all fields exist or not 
        if (!name || !ownerName || !shopName || !phone || !password) {
            return res.status(400).json({
                message: "Please Provide all the fields"
            });
        }

        if (password.length < 6) {
            return res.status(404).json({
                message: "Password must be at least 6 characters long"
            });
        }

        if (!/^\d{11}$/.test(phone.trim())) {
            return res.status(400).json({
                message: "Phone number must be 11 digit only",
            })
        }
        // check if user already exists 
        const existingUser = await User.findOne({ phone: phone.trim() });
        if (existingUser) {
            return res.status(404).json({
                message: "User Already Exist",
            });
        }


        // Hash the password 
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // create user 
        const user = await User.create({
            name,
            ownerName,
            shopName,
            phone,
            address: address || "",
            password: hashPassword,
            role: role || "owner",
        });

        // response back with token and user 
        res.status(201).json({
            success: true,
            token: generateToken(user._id, user.role),
            user: {
                id: user._id,
                name: user.name,
                ownerName: user.ownerName,
                shopName: user.shopName,
                phone: user.phone,
                address: user.address,
                role: user.role,
            }
        })

    } catch (error) {
        console.error("Regiister Error: ", error);
        res.status(500).json({ message: "Server error registration time", error: error.message })
    }
}



// login as dokandar or stuff and get token 
// POST  /api/auth/login

export const loginUser = async (req, res) => {
    try {
        const { phone, password } = req.body;
        if (!phone || !password) {
            return res.status(400).json({ message: "Please enter phn and password" });
        }


        // check if user exist 
        const user = await User.findOne({ phone: phone.trim() });
        if (!user) {
            return res.status(401).json({ message: "Invalid Credential" });
        }

        // verify password 
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // 3. Send response
        res.json({
            success: true,
            token: generateToken(user._id, user.role),
            user: {
                id: user._id,
                name: user.name,
                ownerName: user.ownerName,
                shopName: user.shopName,
                phone: user.phone,
                address: user.address,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error during login", error: error.message });
    }
}


// Get current logged in user
// GET  /api/auth/me
export const getMe = async (req, res) =>{
    res.json({
        success: true,
        user: req.user,
    })
}