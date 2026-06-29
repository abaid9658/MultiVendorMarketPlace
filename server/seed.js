require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Vendor = require('./models/Vendor');
const Quotation = require('./models/Quotation');
const Settings = require('./models/Settings');
const Activity = require('./models/Activity');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Vendor.deleteMany();
    await Quotation.deleteMany();
    await Settings.deleteMany();
    await Activity.deleteMany();
    console.log('🧹 Cleared existing database collections...');

    // 1. Create Default Users
    const admin = await User.create({
      name: 'Alex Sterling',
      email: 'admin@vendorpro.com',
      password: 'admin123',
      role: 'admin',
    });

    const user = await User.create({
      name: 'John Doe',
      email: 'user@vendorpro.com',
      password: 'user123',
      role: 'user',
    });
    console.log('👤 Created seed users (admin@vendorpro.com / user@vendorpro.com)');

    // 2. Create Default Vendors
    const vendors = await Vendor.insertMany([
      {
        vendorName: 'Sarah Jenkins',
        companyName: 'SteelCore Solutions',
        email: 'sales@steelcore.com',
        contactNumber: '+1 (555) 120-4930',
        businessAddress: '488 Metalworks Blvd, Pittsburgh, PA',
        status: 'active',
        notes: 'Primary steel and raw structural material supplier.',
      },
      {
        vendorName: 'David Chen',
        companyName: 'NextGen Tech',
        email: 'partners@nextgentech.io',
        contactNumber: '+1 (555) 890-2139',
        businessAddress: '90 Valley Loop, San Jose, CA',
        status: 'active',
        notes: 'Provides IT hardware, networking, and system upgrades.',
      },
      {
        vendorName: 'Robert Vance',
        companyName: 'Bulk Assets LLC',
        email: 'orders@bulkassets.com',
        contactNumber: '+1 (555) 349-8012',
        businessAddress: '172 Industrial Way, Scranton, PA',
        status: 'active',
        notes: 'Office furniture and asset logistics vendor.',
      },
      {
        vendorName: 'Maria Rodriguez',
        companyName: 'Apex Logistics Corp',
        email: 'maria.r@apexlogistics.com',
        contactNumber: '+1 (555) 762-9011',
        businessAddress: '23 Route 66, Chicago, IL',
        status: 'inactive',
        notes: 'Backup logistics and shipping carrier.',
      }
    ]);
    console.log('🏭 Seeded 4 vendors...');

    // 3. Create Quotations (for comparison & dashboard flow)
    const now = new Date();
    
    // RFQ-2026-001 (SteelCore - Approved)
    await Quotation.create({
      title: 'Structural Steel Delta Project',
      description: 'Heavy duty steel beams, plates, and fasteners for building foundation.',
      vendor: vendors[0]._id,
      amount: 124500,
      submissionDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5),
      expirationDate: new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()),
      status: 'approved',
      createdBy: admin._id,
      notes: 'Lowest price matching construction specifications.',
    });

    // RFQ-2026-002 (NextGen Tech - In Review)
    await Quotation.create({
      title: 'Office Server Hardware Upgrades',
      description: 'Server racks, 64GB RAM modules, 10TB SSD storage arrays, and network switches.',
      vendor: vendors[1]._id,
      amount: 89200,
      submissionDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2),
      expirationDate: new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()),
      status: 'in_review',
      createdBy: admin._id,
    });

    // RFQ-2026-003 (Bulk Assets - Draft)
    await Quotation.create({
      title: 'Q3 Office Furniture Supply',
      description: 'Ergonomic task chairs, dual-motor standing desks, and conference tables.',
      vendor: vendors[2]._id,
      amount: 45000,
      submissionDate: new Date(),
      status: 'draft',
      createdBy: admin._id,
    });

    // RFQ-2026-004 (NextGen Tech - Rejected)
    await Quotation.create({
      title: 'Structural Steel Delta Project', // same project title for comparison
      description: 'Steel core pillars and supports for building foundation (Alternative Proposal).',
      vendor: vendors[1]._id,
      amount: 145000,
      submissionDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 4),
      expirationDate: new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()),
      status: 'rejected',
      createdBy: admin._id,
      notes: 'Price exceeds budget limit.',
    });

    console.log('📄 Seeded 4 quotation records...');

    // 4. System Settings
    await Settings.create({
      organizationName: 'VendorPro Enterprise',
      contactEmail: 'procurement@vendorpro.com',
      contactNumber: '+1 (555) 019-2834',
      address: '100 Procurement Blvd, Suite 400',
      currency: 'USD',
      taxRate: 5,
      enableEmailNotifications: true,
    });
    console.log('⚙️ Default system settings initialized...');

    // 5. Activity logs
    await Activity.insertMany([
      {
        action: 'VENDOR_CREATED',
        entityType: 'vendor',
        entityName: 'SteelCore Solutions',
        description: 'New vendor "SteelCore Solutions" registered',
        performedBy: admin._id,
        icon: 'person_add',
        iconBg: 'bg-tertiary-fixed',
        iconColor: 'text-on-tertiary-fixed',
      },
      {
        action: 'QUOTATION_APPROVED',
        entityType: 'quotation',
        entityName: 'RFQ-2026-001',
        description: 'Quotation "Structural Steel Delta Project" (RFQ-2026-001) approved',
        performedBy: admin._id,
        icon: 'check_circle',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-700',
      },
      {
        action: 'VENDOR_CREATED',
        entityType: 'vendor',
        entityName: 'NextGen Tech',
        description: 'New vendor "NextGen Tech" registered',
        performedBy: admin._id,
        icon: 'person_add',
        iconBg: 'bg-tertiary-fixed',
        iconColor: 'text-on-tertiary-fixed',
      }
    ]);
    console.log('📋 Activity logs seeded...');

    console.log('✨ Data seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedData();
