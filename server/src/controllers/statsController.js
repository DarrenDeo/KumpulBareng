const asyncHandler = require('express-async-handler');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getSiteStats = asyncHandler(async (req, res) => {
  const totalUsers = await prisma.user.count();
  const totalEvents = await prisma.event.count();
  res.status(200).json({ totalUsers, totalEvents });
});

module.exports = { getSiteStats };