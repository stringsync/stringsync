import { useEffect, useState } from 'react';
import { Guitar } from '../lib/guitar/Guitar';
import { Tuning } from '../lib/guitar/Tuning';

export const useGuitar = (tuning: Tuning) => {
  const [guitar, setGuitar] = useState(() => new Guitar(tuning));

  useEffect(() => {
    setGuitar(new Guitar(tuning));
  }, [tuning]);

  return guitar;
};
