import { validationResult } from 'express-validator';
import async from 'async';

export default function (validator) {
  return (req, res, next) => {
    async.eachSeries(
      validator,
      (option, validated) => {
        option(req, res, validated);
      },
      (err) => {
        if (err) {
          return res.status(500).json({ error: 'Error serving your request' });
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          const extractedErrors = errors
            .array()
            .map((error) => ({ [error.param]: err.msg }));
          return res.status(422).json({
            errors: extractedErrors,
          });
        }
        return next();
      }
    );
  };
}
