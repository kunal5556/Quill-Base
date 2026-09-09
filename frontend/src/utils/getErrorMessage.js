const getErrorMessage = (error) => {
  if (error?.data?.message) {
    return error.data.message;
  }

  if (error?.status === "FETCH_ERROR") {
    return "Cannot reach the server. Please check your connection and try again.";
  }

  return "Something went wrong. Please try again.";
};

export default getErrorMessage;
