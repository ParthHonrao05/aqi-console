const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Create a new client user (Admin only)
// @route   POST /api/users
// @access  Private/Admin
const createClient = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'User with this email or username already exists',
      });
    }

    // Create client user (role is set to CLIENT by default in schema)
    const user = await User.create({
      username,
      email,
      password,
      role: 'CLIENT',
    });

    res.status(201).json({
      message: 'Client user created successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Create client error:', error);
    res.status(500).json({ message: 'Server error while creating client' });
  }
};

// @desc    Get all clients (Admin only)
// @route   GET /api/users/clients
// @access  Private/Admin
const getAllClients = async (req, res) => {
  try {
    const clients = await User.find({ role: 'CLIENT' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      count: clients.length,
      clients,
    });
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({ message: 'Server error while fetching clients' });
  }
};

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error while fetching user' });
  }
};
// @desc    Delete client (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteClient = async (req, res) => {
  try {
    const client = await User.findById(req.params.id);

    if (!client || client.role !== 'CLIENT') {
      return res.status(404).json({ message: 'Client not found' });
    }

    await client.deleteOne();

    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Delete client error:', error);
    res.status(500).json({ message: 'Server error while deleting client' });
  }
};


// @desc    Create new admin (Admin only)
// @route   POST /api/users/admin
// @access  Private/Admin
const createAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'User with this email or username already exists',
      });
    }

    const admin = await User.create({
      username,
      email,
      password,
      role: 'ADMIN',
    });

    res.status(201).json({
      message: 'Admin created successfully',
      user: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ message: 'Server error while creating admin' });
  }
};

// Update own profile (Admin / Client)
const updateMyProfile = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (username) user.username = username;
    if (password) user.password = password;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
// Get all admins (Admin only)
const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'ADMIN' }).select('-password');
    res.json({ admins });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createClient,
  getAllClients,
  getCurrentUser,
  deleteClient,
  createAdmin,
  updateMyProfile,
  getAllAdmins,
};