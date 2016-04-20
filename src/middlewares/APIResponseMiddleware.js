function middleware(req, res, next) {
  res.success = function(data) {
    // console.log(data);
    res.json({
      status: 1,
      data: data
    });
  }
  res.error = function(error) {
    console.log(error.stack);
    res.json({
      status: error.api_status || 0,
      message: error.error || error.message
    })
  };
  next();
}

module.exports = middleware;