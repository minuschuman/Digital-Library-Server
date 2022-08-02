module.exports = (req, res, next) => {
  try {
  } catch (error) {
    return res.status(401).json({
      message: "Auth Failed",
    });
  }
};
