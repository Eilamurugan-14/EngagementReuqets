const ALLOWED_TRANSITIONS = {
  "Pending Manager": [
    "Approved",
    "Rejected",
    "Pending GCC Leader",
  ],

  "Pending GCC Leader": [
    "Approved",
    "Rejected",
  ],

  Approved: [],

  Rejected: [],
};

function isValidTransition(
  currentStatus,
  newStatus
) {
  if (currentStatus === newStatus) {
    return true;
  }

  return (
    ALLOWED_TRANSITIONS[
      currentStatus
    ]?.includes(newStatus) || false
  );
}

module.exports = {
  isValidTransition,
};