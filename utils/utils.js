const cleanDate = (date) => {
  return date.split('T')[0]
}

function getQueryValue (url) {
  const parts = url.split("=");
  return parts.length > 1 ? parts[1] : null;
}

function convertPhoneToDisplay(phoneNumber) {
  // Remove non-numeric characters
  const numericPhone = phoneNumber.replace(/\D/g, '');
  // Format the phone number
  const formattedPhone = numericPhone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  console.log(formattedPhone, numericPhone)
}

function createVideoArray(movements, sectionDescription) {
  return movements.filter(movement =>
    sectionDescription.toLowerCase().includes(movement.name.toLowerCase())
  );
}



export { cleanDate, getQueryValue, convertPhoneToDisplay, createVideoArray }