import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';

/**
 * Middleware to validate request data using express-validator
 * @param validations Array of validation chains
 * @returns Middleware function
 */
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Execute all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    // Check for validation errors
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Return validation errors
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => {
        // Handle different types of validation errors
        const field = err.type === 'field' ? err.path : 
                     (err.type === 'alternative' || err.type === 'alternative_grouped') ? 'multiple' : 
                     err.type === 'unknown_fields' ? 'unknown' : 
                     'field';
        return {
          field,
          message: err.msg
        };
      })
    });
  };
};