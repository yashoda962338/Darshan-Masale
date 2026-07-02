const apiResponse = (success, message, data = null, errors = null) => {
  const response = { success, message };
  
  if (data !== null && data !== undefined) {
    response.data = data;
  }
  
  if (errors !== null && errors !== undefined) {
    response.errors = errors;
  }
  
  return response;
};

const apiSuccess = (message, data = null) => {
  return apiResponse(true, message, data);
};

const apiError = (message, errors = null) => {
  return apiResponse(false, message, null, errors);
};

module.exports = { apiResponse, apiSuccess, apiError };