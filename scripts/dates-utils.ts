export function parseDate(date?: Date): string {

  let value: Date | undefined = date;

  if (!value)
    value = new Date();

  const month = value.getUTCMonth() + 1; //months from 1-12
  const day = value.getUTCDate();
  const year = value.getUTCFullYear();

  return year + "/" + month + "/" + day;
}