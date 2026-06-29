const Vendor = require('../models/Vendor');
const Quotation = require('../models/Quotation');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalVendors,
      activeVendors,
      totalQuotations,
      activeQuotations,
      pendingQuotations,
      approvedQuotations,
      draftQuotations,
      rejectedQuotations,
    ] = await Promise.all([
      Vendor.countDocuments(),
      Vendor.countDocuments({ status: 'active' }),
      Quotation.countDocuments(),
      Quotation.countDocuments({ status: 'active' }),
      Quotation.countDocuments({ status: 'pending' }),
      Quotation.countDocuments({ status: 'approved' }),
      Quotation.countDocuments({ status: 'draft' }),
      Quotation.countDocuments({ status: 'rejected' }),
    ]);

    // Monthly quotation data for chart (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyData = await Quotation.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          total: { $sum: 1 },
          approved: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
          totalAmount: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Priority quotations (latest active/pending, sorted by amount desc)
    const priorityQuotations = await Quotation.find({
      status: { $in: ['active', 'pending', 'in_review'] },
    })
      .populate('vendor', 'vendorName companyName')
      .sort({ amount: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        totalVendors,
        activeVendors,
        totalQuotations,
        activeQuotations,
        pendingQuotations,
        approvedQuotations,
        draftQuotations,
        rejectedQuotations,
        monthlyData,
        priorityQuotations,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboardStats };
