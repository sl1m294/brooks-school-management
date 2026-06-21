export const sendResponse = (res, statusCode, data, meta = undefined) => {
  res.status(statusCode).json({
    data,
    ...(meta ? { meta } : {})
  });
};

