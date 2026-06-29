const Settings = require('../models/Settings');
const { logActivity } = require('../middleware/activityLogger');

// @desc    Get system settings (creates default if none exist)
// @route   GET /api/settings
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update system settings
// @route   PUT /api/settings
const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    await settings.save();

    await logActivity(
      {
        action: 'SETTINGS_UPDATED',
        entityType: 'system',
        description: 'System preferences and organization settings updated',
        performedBy: req.user?._id,
        icon: 'settings',
        iconBg: 'bg-primary-fixed-dim',
        iconColor: 'text-primary',
      },
      req.io
    );

    if (req.io) req.io.emit('stats_update'); // trigger refetches

    res.json({ success: true, data: settings, message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSettings, updateSettings };
