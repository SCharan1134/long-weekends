export interface Holiday {
  id: string;
  name: string;
  description: string;
  countryId: string;
  country: string;
  date: Date | string;
  year: number;
  month: number;
  day: number;
  createdAt: Date | string;
}

export interface LongWeekend {
  start: string; // Start date of the long weekend
  end: string; // End date of the long weekend
  leaveUsed?: number; // Optional: Number of leaves used
  type: "holiday" | "paid" | "unpaid"; // Category of long weekend
  holidayName?: string;
}
