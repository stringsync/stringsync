export class Base64 {
  static encode(string: string): string {
    return Buffer.from(string, 'utf8').toString('base64');
  }

  static decode(string: string): string {
    return Buffer.from(string, 'base64').toString('utf8');
  }
}
