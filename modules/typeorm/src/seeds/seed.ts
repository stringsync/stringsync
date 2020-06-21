import { TagEntity } from './../entities/TagEntity';
import { NotationEntity } from './../entities/NotationEntity';
import { getContainerConfig } from '@stringsync/config';
import * as bcrypt from 'bcrypt';
import { connectToDb } from '../connectToDb';
import { UserEntity } from '../entities';
import { UserRole } from '@stringsync/domain';
import { Connection } from 'typeorm';

const PASSWORD = 'password';
const HASH_ROUNDS = 10;
const NOW = new Date();

const seed = async (connection: Connection) => {
  const encryptedPassword = await bcrypt.hash(PASSWORD, HASH_ROUNDS);

  const userRepo = connection.getRepository(UserEntity);
  let user1 = userRepo.create({
    username: 'jaredplaysguitar',
    email: 'jared@gmail.com',
    role: UserRole.ADMIN,
    createdAt: NOW,
    updatedAt: NOW,
    encryptedPassword: encryptedPassword,
    avatarUrl: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1',
  });
  let user2 = userRepo.create({
    username: 'jessicaplayspiano',
    email: 'jessica@hotmail.com',
    role: UserRole.STUDENT,
    createdAt: NOW,
    updatedAt: NOW,
    encryptedPassword: encryptedPassword,
    avatarUrl: 'https://images.unsplash.com/photo-1524593689594-aae2f26b75ab',
  });
  let user3 = userRepo.create({
    username: 'jordanplaysflute',
    email: 'jordan@yahoo.com',
    role: UserRole.TEACHER,
    createdAt: NOW,
    updatedAt: NOW,
    encryptedPassword: encryptedPassword,
    avatarUrl: 'https://images.unsplash.com/photo-1552673304-23f6ad21aada',
  });
  user1 = await userRepo.save(user1);
  user2 = await userRepo.save(user2);
  user3 = await userRepo.save(user3);

  const notationRepo = connection.getRepository(NotationEntity);
  let notation1 = notationRepo.create({
    songName: 'good mourning',
    artistName: 'jaredplaysguitar',
    transcriber: user1,
  });
  notation1 = await notationRepo.save(notation1);

  const tagRepo = connection.getRepository(TagEntity);
  let tag1 = tagRepo.create({
    name: 'funeral',
    notations: [notation1] as any,
  });
  tag1 = await tagRepo.save(tag1);
};

const main = async () => {
  const config = getContainerConfig();
  const connection = await connectToDb(config);

  try {
    await seed(connection);
  } finally {
    await connection.close();
  }
};

if (require.main === module) {
  main();
}
