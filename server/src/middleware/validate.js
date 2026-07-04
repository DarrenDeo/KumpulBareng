/**
 * Middleware untuk validasi request body menggunakan Zod schema.
 * 
 * Usage:
 *   const { createEventSchema } = require('../validators/eventSchema');
 *   router.post('/', protect, validate(createEventSchema), createEvent);
 */
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: 'Data tidak valid',
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  // Replace req.body with validated & transformed data
  req.body = result.data;
  next();
};

module.exports = validate;
