import { useEffect } from 'react';

export const useDocumentTitle = (title: string) => {
  useEffect(() => {
    const originalDocumentTitle = document.title;
    document.title = title;
    return () => {
      document.title = originalDocumentTitle;
    };
  }, [title]);
};
