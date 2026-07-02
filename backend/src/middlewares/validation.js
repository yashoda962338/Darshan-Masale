const { validationResult } = require('express-validator');
const { apiError } = require('../utils/apiResponse');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.param,
      message: error.msg,
    }));
    
    return res.status(400).json(apiError('VALIDATION_ERROR', 'Validation failed', errorMessages));
  }
  
  next();
};

module.exports = { validate };