import { last, random, sample, shuffle, times } from 'lodash';
import { isMikroORMDb } from '../..';
import { Notation, Tag, User, UserRole } from '../../../domain';
import { InternalError } from '../../../errors';
import { container } from '../../../inversify.config';
import { TYPES } from '../../../inversify.constants';
import { Logger, rand } from '../../../util';
import { Db } from '../../types';
import { NotationEntity, TagEntity, UserEntity } from '../entities';
import {
  ADJECTIVES,
  ARTIST_NAMES,
  ENCRYPTED_PASSWORD,
  MUSIC_XML_URLS,
  NOTATION_THUMBNAIL_URLS,
  NOUNS,
  USERNAMES,
  USER_AVATAR_URLS,
  VIDEO_URL,
} from './constants';

(async () => {
  const db = container.get<Db>(TYPES.Db);
  const logger = container.get<Logger>(TYPES.Logger);

  if (!isMikroORMDb(db)) {
    throw new InternalError('must use MikroORM db, check inversify.config.ts');
  }
  logger.info('connecting to the database...');
  await db.init();
  logger.info('connection succeeded');
  logger.info('seeding database...');

  const buildUser = (props: Partial<User> = {}) => {
    const user = new UserEntity(
      {
        ...rand.notation({
          id: undefined,
          username: `${sample(USERNAMES)}_${random(100, 999)}`,
          email: `${rand.str(5)}@${rand.str(5)}.com`,
          encryptedPassword: ENCRYPTED_PASSWORD,
          avatarUrl: sample(USER_AVATAR_URLS),
          ...props,
        }),
      },
      { em: db.em }
    );
    db.em.persist(user);
    return user;
  };
  const buildNotation = (props: Partial<Notation> = {}) => {
    const notation = new NotationEntity(
      rand.notation({
        id: undefined,
        cursor: 0,
        durationMs: 34933,
        songName: `${sample(ADJECTIVES)} ${sample(NOUNS)}`,
        artistName: sample(ARTIST_NAMES),
        transcriberId: undefined,
        thumbnailUrl: sample(NOTATION_THUMBNAIL_URLS),
        musicXmlUrl: sample(MUSIC_XML_URLS),
        videoUrl: VIDEO_URL,
        private: false,
        ...props,
      }),
      { em: db.em }
    );
    db.em.persist(notation);
    return notation;
  };
  const buildTag = (props: Partial<Tag> = {}) => {
    const tag = new TagEntity(rand.tag({ id: undefined, ...props }), { em: db.em });
    db.em.persist(tag);
    return tag;
  };

  // create users
  const jared = buildUser({ username: 'jaredplaysguitar', email: 'jared@stringsync.com', role: UserRole.ADMIN });
  const admin = buildUser({ username: 'admin', email: 'admin@stringsync.com', role: UserRole.ADMIN });
  const teacher = buildUser({ username: 'teacher', email: 'teacher@stringsync.com', role: UserRole.TEACHER });
  const student = buildUser({ username: 'student', email: 'student@stringsync.com', role: UserRole.STUDENT });
  const students = buildUser({ role: UserRole.STUDENT });
  const teachers = [jared, admin, teacher];

  // create notations
  const notations = times(100, () => {
    const notation = buildNotation();
    const transcriber = sample(teachers)!;
    notation.transcriber.set(transcriber);
    return notation;
  });

  // create notations named after the music xml file that backs them
  notations.push(
    ...MUSIC_XML_URLS.map((musicXmlUrl) => {
      const filename = last(musicXmlUrl.split('/'));
      const notation = buildNotation({ musicXmlUrl, songName: filename });
      const transcriber = sample(teachers)!;
      notation.transcriber.set(transcriber);
      return notation;
    })
  );

  // create tags
  const tags = [
    buildTag({ name: 'acoustic' }),
    buildTag({ name: 'alternative' }),
    buildTag({ name: 'electric' }),
    buildTag({ name: 'jazz' }),
    buildTag({ name: 'neosoul' }),
    buildTag({ name: 'prog' }),
  ];

  // create notation tags
  for (const notation of notations) {
    const numTags = random(1, 3);
    const shuffledTags = shuffle(tags);
    const selectedTags = shuffledTags.slice(0, numTags);
    for (const selectedTag of selectedTags) {
      notation.tags.add(selectedTag);
    }
  }

  logger.info('persisting seeded entities...');
  try {
    await db.em.flush();
    logger.info('seed succeeded');
  } catch (e) {
    logger.error('seed failed');
    console.error(e);
  } finally {
    logger.info('closing connection...');
    await db.closeConnection();
    logger.info('connection closed');
  }
})();
