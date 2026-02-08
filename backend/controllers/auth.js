import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    let user = await User.findOne({ email });
    
    // AUTO-REGISTER if not found (Fixes "User not found" error)
    if (!user) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = new User({
            username: email.split('@')[0], 
            email: email,
            password: hashedPassword,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
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