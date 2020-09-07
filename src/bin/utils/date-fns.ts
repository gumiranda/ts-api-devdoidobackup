import {
  addDays,
  isFriday,
  isMonday,
  isPast,
  isSaturday,
  isSunday,
  isThursday,
  isTuesday,
} from 'date-fns';
export const addDay = (date, amount) => {
  return addDays(date, amount).toISOString();
};
