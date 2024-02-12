const asyncHandler = (controller) => {
  return (req, res, next) => {
    controller(req, res, next).catch((err) => {
      return next(new Error(err));
    });
  };
};

export default asyncHandler;
