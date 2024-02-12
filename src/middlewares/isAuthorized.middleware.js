export const isAuthorized = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return next(new Error("You are not authorized.", { cause: 401 }));
    }

    return next();
  };
};
