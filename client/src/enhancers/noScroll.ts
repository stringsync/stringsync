import { compose, lifecycle } from 'recompose';
import $ from 'jquery';

type ElementGetter<TProps> = (props?: TProps) => HTMLElement;

export const noScroll = <TProps = {}>(getElement: ElementGetter<TProps>) => BaseComponent => {
  const enhance = compose(
    lifecycle<TProps, {}, {}>({
      componentDidMount(): void {
        $(getElement(this.props)).addClass('no-scroll');
      },
      componentWillUnmount(): void {
        $(getElement(this.props)).removeClass('no-scroll');
      }
    })
  );

  return enhance(BaseComponent);
};
