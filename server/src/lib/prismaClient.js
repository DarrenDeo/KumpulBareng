const { PrismaClient } = require('@prisma/client');

// Singleton pattern — prevents creating multiple PrismaClient instances
// which exhausts database connection pools
const globalForPrisma = globalThis;

const prisma = globalForPrisma.__prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'warn', 'error'] 
    : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__prisma = prisma;
}

module.exports = prisma;
