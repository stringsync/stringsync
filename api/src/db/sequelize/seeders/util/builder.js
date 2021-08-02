const { randId, randStr, sample, randInt } = require('./rand');
const {
  ENCRYPTED_PASSWORD,
  USER_ROLES,
  USER_AVATAR_URLS,
  USERNAMES,
  ADJECTIVES,
  NOUNS,
  ARTIST_NAMES,
  NOTATION_THUMBNAIL_URLS,
  VIDEO_URL,
} = require('./constants');

const buildUser = (attrs) => ({
  id: randId(),
  username: `${sample(USERNAMES)}_${randStr(4)}${randInt(100, 999)}`,
  email: `${randStr(5)}@${randStr(5)}.com`,
  role: USER_ROLES.STUDENT,
  encrypted_password: ENCRYPTED_PASSWORD,
  avatar_url: sample(USER_AVATAR_URLS),
  ...attrs,
});

const buildNotation = (attrs) => ({
  id: randId(),
  song_name: `${sample(ADJECTIVES)} ${sample(NOUNS)}`,
  artist_name: sample(ARTIST_NAMES),
  transcriber_id: randId(),
  thumbnail_url: sample(NOTATION_THUMBNAIL_URLS),
  video_url: VIDEO_URL,
  private: false,
  ...attrs,
});

const buildTag = (attrs) => ({
  id: randId(),
  name: sample(ADJECTIVES),
  ...attrs,
});

const buildTagging = (attrs) => ({
  id: randId(),
  notation_id: randId(),
  tag_id: randId(),
  ...attrs,
});

exports.buildUser = buildUser;
exports.buildNotation = buildNotation;
exports.buildTag = buildTag;
exports.buildTagging = buildTagging;
