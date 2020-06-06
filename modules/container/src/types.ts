import { Connection } from 'typeorm';

export type ConnectionProvider = () => Promise<Connection>;
