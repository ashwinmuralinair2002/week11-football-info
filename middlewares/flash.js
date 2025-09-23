// middlewares/flash.js
module.exports = function flashMiddleware(req, res, next) {
  // Transfer flash from session to locals then clear session flash
  if (req.session && req.session.flash) {
    res.locals.messages = Array.isArray(req.session.flash) ? req.session.flash : [req.session.flash];
    delete req.session.flash;
  } else {
    res.locals.messages = [];
  }
  next();
};
