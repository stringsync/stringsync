import { useState } from 'react';
import { v4 } from 'uuid';

export const useUuid = () => {
  const [uuid] = useState(v4);
  return uuid;
};
