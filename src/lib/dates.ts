// One place for how dates read on the site: English (UK) order, in UTC so the build machine's timezone never shows.

const format = (date: Date, options: Intl.DateTimeFormatOptions) =>
  date.toLocaleDateString("en-GB", { ...options, timeZone: "UTC" });

/** "Oct 2026" */
export const monthYear = (date: Date) => format(date, { month: "short", year: "numeric" });
