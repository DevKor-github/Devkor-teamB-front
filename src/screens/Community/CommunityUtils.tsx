// CommunityUtils.tsx
export function getDateString(date: string) {
    const postDate: Date = new Date(date);
    const current: Date = new Date();
    const diffSec = Math.floor((current.getTime() - postDate.getTime()) / 1000);
  
    if (diffSec < 60) {
      return '방금';
    }
  
    if (diffSec < 3600) {
      const min = Math.floor(diffSec / 60);
      return `${min}분 전`;
    }
  
    if (postDate.toDateString() === current.toDateString()) {
      const hour = postDate.getHours().toString().padStart(2, '0');
      const minute = postDate.getMinutes().toString().padStart(2, '0');
      return `${hour}:${minute}`;
    }
  
    if (postDate.getFullYear() === current.getFullYear()) {
      const month = (postDate.getMonth() + 1).toString().padStart(2, '0');
      const day = postDate.getDate().toString().padStart(2, '0');
      return `${month}/${day}`;
    }
  
    const postYear = postDate.getFullYear();
    const currentYear = current.getFullYear();
    return `${currentYear - postYear}년 전`;
  }