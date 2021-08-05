import { container } from '../../inversify.config';
import { TYPES } from '../../inversify.constants';
import { Mail, Mailer } from '../../util';
import { Processor } from '../types';

export type SendMailPayload = {
  mail: Mail;
};

export const sendMail: Processor<SendMailPayload> = async (payload: SendMailPayload) => {
  const mailer = container.get<Mailer>(TYPES.Mailer);
  await mailer.send(payload.mail);
};
