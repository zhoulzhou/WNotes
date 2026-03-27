
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

export function formatTime(timestamp: number): string {
  const now = dayjs();
  const noteTime = dayjs(timestamp);
  const diffDays = now.diff(noteTime, 'day');
  
  if (diffDays > 0) {
    return noteTime.format('YYYY年MM月DD日');
  }
  return noteTime.fromNow();
}
