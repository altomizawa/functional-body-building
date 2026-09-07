const cleanDate = (date) => {
  return date.split('T')[0]
}

function getQueryValue (url) {
  if (!url || typeof url !== 'string') return null;
  // Match YouTube Video IDs from various URL formats (watch?v=, youtu.be/, embed/, etc.)
  const regExp = /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[1] && match[1].length === 11) {
    return match[1];
  }
  const parts = url.split("=");
  if (parts.length > 1) {
    return parts[1].split("&")[0];
  }
  return url;
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