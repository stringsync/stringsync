import { getContainerConfig } from '@stringsync/config';
import * as bcrypt from 'bcrypt';
import { connectToDb } from '../connectToDb';
import { UserEntity } from '../entities';
import { UserRole } from '@stringsync/domain';
import { Connection } from 'typeorm';

const PASSWORD = 'password';
const HASH_ROUNDS = 10;
const NOW = new Date();

const seedUsers = async (connection: Connection) => {
  const encryptedPassword = await bcrypt.hash(PASSWORD, HASH_ROUNDS);
  const userRepo = connection.getRepository(UserEntity);

  const user1 = userRepo.create({
    username: 'jaredplaysguitar',
    email: 'jared@gmail.com',
    role: UserRole.ADMIN,
    createdAt: NOW,
    updatedAt: NOW,
    encryptedPassword: encryptedPassword,
    avatarUrl: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1',
  });
  const user2 = userRepo.create({
    username: 'jessicaplayspiano',
    email: 'jessica@hotmail.com',
    role: UserRole.STUDENT,
    createdAt: NOW,
    updatedAt: NOW,
    encryptedPassword: encryptedPassword,
    avatarUrl: 'https://images.unsplash.com/photo-1524593689594-aae2f26b75ab',
  });
  const user3 = userRepo.create({
    username: 'jordanplaysflute',
    email: 'jordan@yahoo.com',
    role: UserRole.TEACHER,
    createdAt: NOW,
    updatedAt: NOW,
    encryptedPassword: encryptedPassword,
    avatarUrl: 'https://images.unsplash.com/photo-1552673304-23f6ad21aada',
  });
  const users = userRepo.create([user1, user2, user3]);
  await userRepo.save(users);
};

const main = async () => {
  const config = getContainerConfig();
  const connection = await connectToDb(config);

  try {
    await seedUsers(connection);
  } finally {
    await connection.close();
  }
};

if (require.main === module) {
  main();
}
