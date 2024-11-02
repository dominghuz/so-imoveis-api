import { ZodError } from 'zod';

export const validateRequest = (schema) => async (req, res, next) => {
  try {
    await schema.parseAsync(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: 'Dados inválidos',
        errors: error.errors
      });
    }
    next(error);
  }
}; 