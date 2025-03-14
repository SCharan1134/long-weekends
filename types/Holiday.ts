export interface Holiday {
  id: string;
  name: string;
  description: string;
  countryId: string;
  country: string;
  date: string; // ISO date string format
  year: number;
  month: number;
  day: number;
  url: string;
  createdAt: string; // ISO date string format
}

export interface LongWeekend {
  start: string; // Start date of the long weekend
  end: string; // End date of the long weekend
  leaveUsed?: number; // Optional: Number of leaves used
  type: "holiday" | "paid" | "unpaid"; // Category of long weekend
  holidayName?: string;
}
