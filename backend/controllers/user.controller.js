// @desc    Get current logged in user
// @route   GET /api/users/me
// @access  Private
exports.getMe = async (req, res) => {
  const user = req.user; // req.user is already populated by the auth middleware

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  });
};
exports.getAllUsers = async (req, res) => {
  try {
    const users = await require('../models/user.model').find({}, 'name email _id');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};
