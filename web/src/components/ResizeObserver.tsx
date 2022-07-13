import { CSSProperties, PropsWithChildren, useId } from 'react';
import { useMemoCmp } from '../hooks/useMemoCmp';
import { useResizeObserver } from '../hooks/useResizeObserver';

type Props = PropsWithChildren<{
  onResize: (entries: ResizeObserverEntry[]) => void;
  style?: CSSProperties;
}>;

export const ResizeObserver: React.FC<Props> = (props) => {
  const style = useMemoCmp(props.style);

  const idPrefix = useId();
  const id = `${idPrefix}-rect`;
  useResizeObserver(id, props.onResize);

  return (
    <div id={id} style={style}>
      {props.children}
    </div>
  );
};
