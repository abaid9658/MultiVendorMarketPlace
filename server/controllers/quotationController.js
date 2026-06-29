const Quotation = require('../models/Quotation');
const { logActivity } = require('../middleware/activityLogger');

// @desc    Get all quotations
// @route   GET /api/quotations
const getQuotations = async (req, res) => {
  try {
    const { search, status, vendor, page = 1, limit = 10 } = req.query;

    const query = {};
    if (status && status !== 'all') query.status = status;
    if (vendor) query.vendor = vendor;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { rfqId: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Quotation.countDocuments(query);
    const quotations = await Quotation.find(query)
      .populate('vendor', 'vendorName companyName email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      data: quotations,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single quotation
// @route   GET /api/quotations/:id
const getQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id)
      .populate('vendor', 'vendorName companyName email contactNumber businessAddress')
      .populate('createdBy', 'name email');

    if (!quotation) {
      return res.status(404).json({ success: false, message: 'Quotation not found' });
    }
    res.json({ success: true, data: quotation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create quotation
// @route   POST /api/quotations
const createQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.create({ ...req.body, createdBy: req.user?._id });
    const populated = await quotation.populate('vendor', 'vendorName companyName');

    await logActivity(
      {
        action: 'QUOTATION_CREATED',
        entityType: 'quotation',
        entityId: quotation._id,
        entityName: quotation.rfqId,
        description: `New quotation "${quotation.title}" created (${quotation.rfqId})`,
        performedBy: req.user?._id,
        icon: 'post_add',
        iconBg: 'bg-secondary-fixed',
        iconColor: 'text-secondary',
      },
      req.io
    );

    // Emit dashboard stats update
    if (req.io) req.io.emit('stats_update');

    res.status(201).json({ success: true, data: populated, message: 'Quotation created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update quotation
// @route   PUT /api/quotations/:id
const updateQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('vendor', 'vendorName companyName');

    if (!quotation) {
      return res.status(404).json({ success: false, message: 'Quotation not found' });
    }

    const statusLabels = {
      approved: { icon: 'check_circle', iconBg: 'bg-green-100', iconColor: 'text-green-700', desc: `Quotation "${quotation.rfqId}" approved` },
      rejected: { icon: 'cancel', iconBg: 'bg-error-container', iconColor: 'text-error', desc: `Quotation "${quotation.rfqId}" rejected` },
      pending: { icon: 'hourglass_empty', iconBg: 'bg-secondary-fixed', iconColor: 'text-secondary', desc: `Quotation "${quotation.rfqId}" moved to pending` },
      in_review: { icon: 'rate_review', iconBg: 'bg-primary-fixed', iconColor: 'text-on-primary-fixed', desc: `Quotation "${quotation.rfqId}" is under review` },
      active: { icon: 'play_circle', iconBg: 'bg-tertiary-fixed', iconColor: 'text-on-tertiary-fixed', desc: `Quotation "${quotation.rfqId}" activated` },
    };
    const logInfo = statusLabels[req.body.status] || {
      icon: 'edit',
      iconBg: 'bg-primary-fixed',
      iconColor: 'text-on-primary-fixed',
      desc: `Quotation "${quotation.rfqId}" updated`,
    };

    await logActivity(
      {
        action: `QUOTATION_${(req.body.status || 'UPDATED').toUpperCase()}`,
        entityType: 'quotation',
        entityId: quotation._id,
        entityName: quotation.rfqId,
        description: logInfo.desc,
        performedBy: req.user?._id,
        icon: logInfo.icon,
        iconBg: logInfo.iconBg,
        iconColor: logInfo.iconColor,
      },
      req.io
    );

    if (req.io) req.io.emit('stats_update');

    res.json({ success: true, data: quotation, message: 'Quotation updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete quotation
// @route   DELETE /api/quotations/:id
const deleteQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findByIdAndDelete(req.params.id);
    if (!quotation) {
      return res.status(404).json({ success: false, message: 'Quotation not found' });
    }

    await logActivity(
      {
        action: 'QUOTATION_DELETED',
        entityType: 'quotation',
        entityId: quotation._id,
        entityName: quotation.rfqId,
        description: `Quotation "${quotation.rfqId}" deleted`,
        performedBy: req.user?._id,
        icon: 'delete',
        iconBg: 'bg-error-container',
        iconColor: 'text-error',
      },
      req.io
    );

    if (req.io) req.io.emit('stats_update');

    res.json({ success: true, message: 'Quotation deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Compare quotations by title (same project, multiple vendors)
// @route   GET /api/quotations/compare
const compareQuotations = async (req, res) => {
  try {
    const { title } = req.query;
    const query = {};
    if (title) query.title = { $regex: title, $options: 'i' };

    const quotations = await Quotation.find(query)
      .populate('vendor', 'vendorName companyName email contactNumber businessAddress')
      .sort({ amount: 1 });

    // Mark the lowest amount
    const withFlags = quotations.map((q, index) => ({
      ...q.toObject(),
      isCheapest: index === 0 && quotations.length > 1,
    }));

    res.json({ success: true, data: withFlags });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getQuotations, getQuotation, createQuotation, updateQuotation, deleteQuotation, compareQuotations };
