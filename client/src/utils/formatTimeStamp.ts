export function formatTimeStamp(dateString: string): string {
    const timestamp = new Date(dateString);
  
    const formattedTimeStamp = new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(timestamp);
  
    console.log(timestamp, "This is timestamp after format");
  
    return formattedTimeStamp;
  }
  