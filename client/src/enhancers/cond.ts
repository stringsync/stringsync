import { predicate, ComponentEnhancer, branch, renderComponent } from 'recompose';

export type Condition<TProps> = [predicate<TProps>, ComponentEnhancer<TProps, TProps>];

/**
 * Given a bunch of conditions, this HOC effectively will create a HOC that will
 * iterate over the conditions, test each one, and render the one that matches
 * the condition test.
 *
 * @param conditions
 */
export const cond = <TProps>(conditions: Array<Condition<TProps>>) => (
  (BaseComponent: React.ComponentClass<TProps> | React.SFC<TProps>) => {
    const enhance = conditions.reverse().reduce((hocs, condition) => {
      const [test, targetHoc] = condition;
      return branch<TProps>(props => test(props), targetHoc, hocs);
    }, renderComponent(BaseComponent));

    return enhance(BaseComponent);
  }
);
