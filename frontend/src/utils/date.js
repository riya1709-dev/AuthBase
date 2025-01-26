export const formatDate = (dateString) => {
    const date = new Date(dateString);
  
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
  
    // Format the date using toLocaleString with options for full date and time
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",  // Short month name (e.g., Dec)
      day: "numeric",  // Numeric day (e.g., 25)
      hour: "2-digit",  // Hour in 12-hour format (e.g., 01, 02, etc.)
      minute: "2-digit",  // Minute (e.g., 05, 30)
      hour12: true,  // Use 12-hour clock (AM/PM)
    });
  };
  