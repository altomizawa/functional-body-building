const cleanDate = (date) => {
  return date.split('T')[0]
}

function getQueryValue(url) {
  if (!url || typeof url !== 'string') return null;
  const cleanUrl = url.trim();

  // If already an 11-character YouTube ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) {
    return cleanUrl;
  }

  // Matches all YouTube URL formats (watch?v=, youtu.be/, shorts/, embed/, live/)
  const regExp = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts|live)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = cleanUrl.match(regExp);
  if (match && match[1]) {
    return match[1];
  }

  return null;
}

function convertPhoneToDisplay(phoneNumber) {
  // Remove non-numeric characters
  const numericPhone = phoneNumber.replace(/\D/g, '');
  // Format the phone number
  const formattedPhone = numericPhone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
}

function createVideoArray(movements, sectionDescription) {
  if (!movements || !sectionDescription) {
    return [];
  }
  return movements?.data.filter(movement =>
    sectionDescription.toLowerCase().includes(movement.name.toLowerCase())
  );
}

// Check if workout is completed
const checkIfWorkoutCompleted = (userData, workout) => {
  // Make sure we have all the required data
  if (!userData?.data?.completed || !workout?._id) {
    return false;
  }

  // Check if the workout ID exists in the user's completed workouts
  return userData.data.completed.some(entry => {
    return entry.pillarId._id.toString() === workout._id.toString();
  });
};



export { cleanDate, getQueryValue, convertPhoneToDisplay, createVideoArray, checkIfWorkoutCompleted }