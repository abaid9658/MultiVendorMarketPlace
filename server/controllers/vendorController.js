const Vendor = require('../models/Vendor');
const { logActivity } = require('../middleware/activityLogger');

// @desc    Get all vendors (with search + filter)
// @route   GET /api/vendors
const getVendors = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;

    const query = {};
    if (status && status !== 'all') query.status = status;
    if (search) {
      query.$or = [
        { vendorName: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { contactNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Vendor.countDocuments(query);
    const vendors = await Vendor.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      data: vendors,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single vendor
// @route   GET /api/vendors/:id
const getVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }
    res.json({ success: true, data: vendor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create vendor
// @route   POST /api/vendors
const createVendor = async (req, res) => {
  try {
    const vendor = await Vendor.create(req.body);

    await logActivity(
      {
        action: 'VENDOR_CREATED',
        entityType: 'vendor',
        entityId: vendor._id,
        entityName: vendor.companyName,
        description: `New vendor "${vendor.companyName}" registered`,
        performedBy: req.user?._id,
        icon: 'person_add',
        iconBg: 'bg-tertiary-fixed',
        iconColor: 'text-on-tertiary-fixed',
      },
      req.io
    );

    res.status(201).json({ success: true, data: vendor, message: 'Vendor created successfully' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update vendor
// @route   PUT /api/vendors/:id
const updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    await logActivity(
      {
        action: 'VENDOR_UPDATED',
        entityType: 'vendor',
        entityId: vendor._id,
        entityName: vendor.companyName,
        description: `Vendor "${vendor.companyName}" information updated`,
        performedBy: req.user?._id,
        icon: 'edit',
        iconBg: 'bg-primary-fixed',
        iconColor: 'text-on-primary-fixed',
      },
      req.io
    );

    res.json({ success: true, data: vendor, message: 'Vendor updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete vendor
// @route   DELETE /api/vendors/:id
const deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    await logActivity(
      {
        action: 'VENDOR_DELETED',
        entityType: 'vendor',
        entityId: vendor._id,
        entityName: vendor.companyName,
        description: `Vendor "${vendor.companyName}" removed from system`,
        performedBy: req.user?._id,
        icon: 'delete',
        iconBg: 'bg-error-container',
        iconColor: 'text-error',
      },
      req.io
    );

    res.json({ success: true, message: 'Vendor deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getVendors, getVendor, createVendor, updateVendor, deleteVendor };
