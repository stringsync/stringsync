export type Mail = {
  from: string;
  to: string;
  subject: string;
  html: string;
};

export interface Mailer {
  send(mail: Mail): Promise<void>;
}
