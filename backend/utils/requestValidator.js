const MAX_BUDGET = 10000000;
const MAX_DESCRIPTION_LENGTH = 500;

function validateRequest(body) {
  const errors = [];

  if (!body.employee?.trim()) {
    errors.push("Employee name is required.");
  }

  if (!body.department?.trim()) {
    errors.push("Department is required.");
  }

  if (!body.category?.trim()) {
    errors.push("Category is required.");
  }

  if (
    !(body.event || body.title)?.trim()
  ) {
    errors.push("Event title is required.");
  }

  if (!body.eventDate) {
    errors.push("Event date is required.");
  }

  if (!body.venue?.trim()) {
    errors.push("Venue is required.");
  }

  const headcount = Number(body.headcount);

  if (
    !Number.isInteger(headcount) ||
    headcount <= 0
  ) {
    errors.push(
      "Headcount must be greater than zero."
    );
  }

  const budget = Number(body.budget);

  if (
    Number.isNaN(budget) ||
    budget <= 0 ||
    budget > MAX_BUDGET
  ) {
    errors.push(
      "Budget must be a valid positive number."
    );
  }

  if (
    !Array.isArray(body.quarter) ||
    body.quarter.length === 0
  ) {
    errors.push(
      "At least one quarter must be selected."
    );
  }

  if (
    body.description &&
    body.description.length >
      MAX_DESCRIPTION_LENGTH
  ) {
    errors.push(
      `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters.`
    );
  }

  return errors;
}

module.exports = {
  validateRequest,
};