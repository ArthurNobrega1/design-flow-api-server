import { format, toZonedTime } from 'date-fns-tz';

const getCurrentTime = (): string => {
  const zonedDate = toZonedTime(new Date(), 'America/Recife');

  return format(zonedDate, 'yyyy-MM-dd HH:mm:ss', {
    timeZone: 'America/Recife',
  });
};

export default getCurrentTime;
