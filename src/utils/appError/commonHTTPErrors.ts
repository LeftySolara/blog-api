type HttpCode = number;

const commonHTTPErrors = {
  created: 201,
  notFound: 404,
  internalServerError: 500,
};

export { type HttpCode, commonHTTPErrors };
