import { MenuProps } from 'antd/lib/menu';

interface IProps extends MenuProps {
  triggerSubMenuAction: 'hover' | 'click';
}

export const MENU_PROPS: IProps = {
  mode: 'horizontal',
  multiple: true,
  triggerSubMenuAction: 'click', // necessary for this menu to work on mobile
  style: { border: 0, lineHeight: '62px' }
};
