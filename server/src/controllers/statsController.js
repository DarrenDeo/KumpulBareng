const prisma = require('../lib/prismaClient');
const { catchAsync } = require('../middleware/errorHandler');
const { sendSuccess } = require('../utils/responseHelper');

// @desc    Get site-wide statistics
// @route   GET /api/stats
// @access  Public
const getSiteStats = catchAsync(async (req, res) => {
  const [totalUsers, totalEvents, upcomingEvents, totalCategories] = await Promise.all([
    prisma.user.count(),
    prisma.event.count(),
    prisma.event.count({ where: { eventDate: { gte: new Date() } } }),
    prisma.event.groupBy({ by: ['category'] }).then((groups) => groups.length),
  ]);

  sendSuccess(res, {
    totalUsers,
    totalEvents,
    upcomingEvents,
    totalCategories,
  });
});

module.exports = { getSiteStats };