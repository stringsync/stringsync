import { TagEntity } from './../entities/TagEntity';
import { NotationEntity } from './../entities/NotationEntity';
import { getContainerConfig } from '@stringsync/config';
import { connectToDb } from '../connectToDb';
import { UserEntity } from '../entities';
import { UserRole } from '@stringsync/domain';
import { EntityManager } from 'typeorm';

const seed = async (manager: EntityManager) => {
  await manager.save(UserEntity, [
    {
      id: 1,
      username: 'jaredplaysguitar',
      email: 'jared@gmail.com',
      role: UserRole.ADMIN,
      encryptedPassword: '$2b$10$SuOsN1G4fCftbp3yejwS.u2EARRSU5cVOCpWOARVuGAbTat5YOhC6', // password = 'password'
      avatarUrl: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1',
    },
    {
      id: 2,
      username: 'jessicaplayspiano',
      email: 'jessica@hotmail.com',
      role: UserRole.STUDENT,
      encryptedPassword: '$2b$10$SuOsN1G4fCftbp3yejwS.u2EARRSU5cVOCpWOARVuGAbTat5YOhC6', // password = 'password'
      avatarUrl: 'https://images.unsplash.com/photo-1524593689594-aae2f26b75ab',
    },
    {
      id: 3,
      username: 'jordanplaysflute',
      email: 'jordan@yahoo.com',
      role: UserRole.TEACHER,
      encryptedPassword: '$2b$10$SuOsN1G4fCftbp3yejwS.u2EARRSU5cVOCpWOARVuGAbTat5YOhC6', // password = 'password'
      avatarUrl: 'https://images.unsplash.com/photo-1552673304-23f6ad21aada',
    },
  ]);

  await manager.save(NotationEntity, [
    { id: 1, songName: 'good mourning', artistName: 'jaredplaysguitar', transcriberId: 1 },
    { id: 2, songName: 'panda', artistName: 'jaredplaysguitar', transcriberId: 3 },
  ]);

  await manager.save(TagEntity, [
    { id: 1, name: 'acoustic', notations: [{ id: 1 }, { id: 2 }] },
    { id: 2, name: 'alternative', notations: [{ id: 1 }] },
  ]);
};

const main = async () => {
  const config = getContainerConfig();
  const connection = await connectToDb(config);

  try {
    await seed(connection.manager);
  } finally {
    await connection.close();
  }
};

if (require.main === module) {
  main();
}
