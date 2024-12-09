export function isToday(dateString: string): boolean {
  // Parse the date string back into a Date object
  const date = new Date(parseInt(dateString, 10));

  // Get today's date
  const today = new Date();

  if (
    today.getFullYear() == date.getFullYear() &&
    today.getMonth() == date.getMonth() &&
    today.getDate() == date.getDate()
  ) return true;
  
	return false;
}
