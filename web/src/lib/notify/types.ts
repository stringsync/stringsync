import { ReactNode } from 'react';
import { Duration } from '../../util/Duration';

export type MessageConfig = {
  content: ReactNode;
  duration?: Duration | null;
  key?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
};

export type NotificationPlacement = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

export type PopupConfig = {
  title: ReactNode;
  content: ReactNode;
  placement?: NotificationPlacement;
  button?: ReactNode;
  closeIcon?: ReactNode;
  duration?: Duration;
};

export type ModalConfig = {
  title: ReactNode;
  content: ReactNode;
};

export type SendMessage = (config: MessageConfig) => void;
export type MakePopup = (config: PopupConfig) => void;
export type ShowModal = (config: ModalConfig) => void;

export interface Notify {
  message: Readonly<{
    info: SendMessage;
    success: SendMessage;
    warn: SendMessage;
    error: SendMessage;
    loading: SendMessage;
  }>;
  popup: Readonly<{
    info: MakePopup;
    success: MakePopup;
    warn: MakePopup;
    error: MakePopup;
  }>;
  modal: Readonly<{
    info: ShowModal;
    success: ShowModal;
    warn: ShowModal;
    error: ShowModal;
  }>;
}
