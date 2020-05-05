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
        } else {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            const extractedErrors = errors.array().map((err) => {
              return { [err.param]: err.msg };
            });
            return res.status(422).json({
              errors: extractedErrors,
            });
          }
          return next();
        }
      }
    );
  };
}
