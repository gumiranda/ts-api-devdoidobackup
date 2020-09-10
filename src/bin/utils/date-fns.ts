import { addDays, isPast as past } from 'date-fns';
export const addDay = (date, amount) => {
  return addDays(date, amount).toISOString();
};
export const isPast = (date) => {
  return past(date);
};
