const EMPLOYEE_NAME_PATTERN = /^[A-Za-z.' -]+$/;
const EVENT_TITLE_PATTERN = /^[A-Za-z0-9 -]+$/;
const VENUE_PATTERN = /^[A-Za-z0-9, -]+$/;
const MAX_BUDGET = 10000000;
const MAX_DESCRIPTION_LENGTH = 500;

export function validateEmployeeName(value) {
  const name = value.trim();
  if (!name) return "Employee name is required.";
  if (!EMPLOYEE_NAME_PATTERN.test(name)) {
    return "Employee name can contain only alphabets.";
  }
  return "";
}

export function validateEventTitle(value) {
  const title = value.trim();
  if (!title) return "Event title is required.";
  if (!EVENT_TITLE_PATTERN.test(title)) {
    return "Event title can contain only alphabets, numbers, spaces, and hyphens.";
  }
  return "";
}

export function validateVenue(value) {
  const venue = value.trim();
  if (!venue) return "Venue is required.";
  if (!VENUE_PATTERN.test(venue)) {
    return "Venue can contain only alphabets, numbers, commas, spaces, and hyphens.";
  }
  return "";
}

export function validateHeadcount(value) {
  if (!/^\d+$/.test(String(value)) || Number(value) <= 0) {
    return "Headcount must be greater than zero.";
  }
  return "";
}

export function validateBudget(value) {
  const budget = Number(value);
  if (!/^\d+(\.\d+)?$/.test(String(value)) || budget <= 0 || budget > MAX_BUDGET) {
    return "Budget must be a valid positive number.";
  }
  return "";
}

export function validateEventDate(value) {
  if (!value) return "Please select a valid event date.";
  if (value < getTodayISO()) return "Please select a valid event date.";
  return "";
}

export function getTodayISO() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function validateCategory(value) {
  return value ? "" : "Please select a category.";
}

export function validateQuarter(value) {
  return Array.isArray(value) && value.length > 0
    ? ""
    : "Please select a quarter.";
}

export function validateDescription(value) {
  return value.length > MAX_DESCRIPTION_LENGTH
    ? `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters.`
    : "";
}

export function validateRequestForm(formData) {
  return {
    employee: validateEmployeeName(formData.employee),
    category: validateCategory(formData.category),
    eventDate: validateEventDate(formData.eventDate),
    event: validateEventTitle(formData.event),
    venue: validateVenue(formData.venue),
    headcount: validateHeadcount(formData.headcount),
    budget: validateBudget(formData.budget),
    description: validateDescription(formData.description),
    quarter: validateQuarter(formData.quarter),
  };
}

export const DESCRIPTION_MAX_LENGTH = MAX_DESCRIPTION_LENGTH;
export const BUDGET_MAX = MAX_BUDGET;
