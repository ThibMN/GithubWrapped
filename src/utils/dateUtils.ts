import { format, startOfYear, endOfYear, eachMonthOfInterval, startOfMonth, endOfMonth, parseISO, isWithinInterval } from 'date-fns';
import fr from 'date-fns/locale/fr';

export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

export const getYearStart = (year: number): Date => {
  return startOfYear(new Date(year, 0, 1));
};

export const getYearEnd = (year: number): Date => {
  return endOfYear(new Date(year, 11, 31));
};

export const getMonthsOfYear = (year: number): Date[] => {
  return eachMonthOfInterval({
    start: getYearStart(year),
    end: getYearEnd(year),
  });
};

export const getMonthStart = (year: number, month: number): Date => {
  return startOfMonth(new Date(year, month, 1));
};

export const getMonthEnd = (year: number, month: number): Date => {
  return endOfMonth(new Date(year, month, 1));
};

export const formatMonth = (date: Date): string => {
  return format(date, 'MMMM yyyy', { locale: fr });
};

export const formatMonthShort = (date: Date): string => {
  return format(date, 'MMM yyyy', { locale: fr });
};

export const isDateInYear = (dateString: string, year: number): boolean => {
  const date = parseISO(dateString);
  return isWithinInterval(date, {
    start: getYearStart(year),
    end: getYearEnd(year),
  });
};

export const isDateInMonth = (dateString: string, year: number, month: number): boolean => {
  const date = parseISO(dateString);
  return isWithinInterval(date, {
    start: getMonthStart(year, month),
    end: getMonthEnd(year, month),
  });
};

export const getMonthName = (month: number): string => {
  const date = new Date(2024, month, 1);
  return format(date, 'MMMM', { locale: fr });
};

