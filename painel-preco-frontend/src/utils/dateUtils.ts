

export enum DATE_PATTERN {
  FULL
}

export function convertTZptBR(date: Date | string) : Date {
  return convertTZ(date, "America/Fortaleza");
}

export function convertTZ(date: Date | string, tzString: string) : Date {
  return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));   
}

function fillNumberDate(n: number) : string {
  return n < 10 ? `0${n}` : `${n}`;
}

export function datePattern(date: Date, pattern: DATE_PATTERN): string {
  const val = {
    year: date.getFullYear(),
    month: fillNumberDate(date.getMonth()+1),
    day: fillNumberDate(date.getDate()),
    hour: fillNumberDate(date.getHours()),
    minute: fillNumberDate(date.getMinutes())
  }
  switch(pattern) {
    case DATE_PATTERN.FULL: {
      return `${val.day}/${val.month}/${val.year}_${val.hour}-${val.minute}`
    }
  }
}