import { PropsWithChildren, useId } from 'react';
import { useResizeObserver } from '../hooks/useResizeObserver';

type Props = PropsWithChildren<{
  onResize: (entries: ResizeObserverEntry[]) => void;
}>;

export const Rect: React.FC<Props> = (props) => {
  const id = useId();
  useResizeObserver(id, props.onResize);
  return <div id={id}>{props.children}</div>;
};
