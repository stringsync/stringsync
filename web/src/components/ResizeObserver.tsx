import { PropsWithChildren, useEffect, useId } from 'react';

type Props = PropsWithChildren<{
  onResize: (rect: DOMRectReadOnly) => void;
}>;

export const ResizeObserver: React.FC<Props> = (props) => {
  const { onResize } = props;

  const id = useId();

  useEffect(() => {
    const div = document.getElementById(id);
    if (!div) {
      return;
    }

    const resizeObserver = new window.ResizeObserver((entries) => {
      if (entries.length === 0) {
        return;
      }
      onResize(entries[0].contentRect);
    });
    resizeObserver.observe(div);

    return () => {
      resizeObserver.unobserve(div);
      resizeObserver.disconnect();
    };
  }, [id, onResize]);

  return <div id={id}>{props.children}</div>;
};
