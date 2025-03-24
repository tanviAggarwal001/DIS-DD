const joi = require('joi');

const adminLoginValidation = (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(8).max(100).required()
  });

  const {error} = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Validation error",
      error: error.details
    });
  }
  next();
};

const adminRegisterValidation = (req, res, next) => {
  const schema = joi.object({
    username: joi.string().min(3).max(50).required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).max(100).required(),
    role: joi.string().valid('admin', 'super').default('admin'),
    adminSecret: joi.string().required()
  });

  const {error} = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Validation error",
      error: error.details
    });
  }
  next();
};

module.exports = {
  adminLoginValidation,
  adminRegisterValidation
};