const Activity = require('../models/Activity');

/**
 * Log an activity to the database and emit via socket
 */
const logActivity = async (data, io = null) => {
  try {
    const activity = await Activity.create(data);
    if (io) {
      io.emit('new_activity', activity);
    }
    return activity;
  } catch (err) {
    console.error('Activity log error:', err.message);
  }
};

module.exports = { logActivity };
