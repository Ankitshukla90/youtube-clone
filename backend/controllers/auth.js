import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    let user = await User.findOne({ email });
    
    if (!user) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            username: username || email.split('@')[0], 
            email: email,
            password: hashedPassword,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username || email}`
        });
        user = await newUser.save();
    } else {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret');
    const { password: _, ...userInfo } = user._doc;
    res.status(200).json({ token, ...userInfo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { userId, username, avatar, channelBanner } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { username, avatar, channelBanner } },
        { new: true }
    );
    const { password: _, ...userInfo } = updatedUser._doc;
    res.status(200).json(userInfo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// NEW: Get User by ID (Fixes the "Loading..." bug on empty channels)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
};