const User = require('../models/User');
const Scan = require('../models/Scan');

const getProfile = async (req, res) => {
  try {
    const totalScans = await Scan.countDocuments({ userId: req.user._id });
    res.json({ user: req.user, totalScans });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProfile = async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim())
    return res.status(400).json({ error: 'Name is required' });

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: name.trim() },
      { new: true }
    );
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getProfile, updateProfile };
