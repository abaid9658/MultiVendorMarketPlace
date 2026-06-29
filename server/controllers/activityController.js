const Activity = require('../models/Activity');

// @desc    Get recent activities
// @route   GET /api/activities
const getActivities = async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const activities = await Activity.find()
      .populate('performedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json({ success: true, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getActivities };
