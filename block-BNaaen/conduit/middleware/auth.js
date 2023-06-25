const jwt = require('jsonwebtoken');

module.exports = {
  verifyToken: async (req, res, next) => {
    let token = req.headers.authorization;
    try {
      if (token) {
        let payload = await jwt.verify(token, 'thisisscerte');
        req.user = payload;
        return next();
      } else {
        return res.status(401).json({ error: { body: ['Token Required'] } });
      }
    } catch (error) {
      next(error);
    }
  },
  authorizeOpt: async (req, res, next) => {
    let token = req.headers.authorization;
    try {
      if (token) {
        let payload = await jwt.verify(token, 'thisisscerte');
        req.user = payload;
        return next();
      } else {
        return next();
      }
    } catch (error) {
      next(error);
    }
  },
};
