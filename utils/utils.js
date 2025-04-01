const cleanDate = (date) => {
  return date.split('T')[0]
}

function getQueryValue (url) {
  const parts = url.split("=");
  return parts.length > 1 ? parts[1] : null;
}

export { cleanDate, getQueryValue }