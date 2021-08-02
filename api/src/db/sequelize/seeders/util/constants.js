const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const ENCRYPTED_PASSWORD = '$2b$10$SuOsN1G4fCftbp3yejwS.u2EARRSU5cVOCpWOARVuGAbTat5YOhC6'; // password = 'password'

const VIDEO_URL = 'https://d2w1rk200g2ur4.cloudfront.net/79b928a4-fcf6-412e-a96f-f251e7e14c4f/hls/z3HrPy8P.m3u8';

const USER_AVATAR_URLS = [
  'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1',
  'https://images.unsplash.com/photo-1524593689594-aae2f26b75ab',
  'https://images.unsplash.com/photo-1552673304-23f6ad21aada',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
  'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
  'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
];

const NOTATION_THUMBNAIL_URLS = [
  'https://i.picsum.photos/id/386/640/640.jpg?hmac=v88N3FMug3KL11kiuk2LbTluui3qQyndBZ3hSbdKrhE',
  'https://i.picsum.photos/id/1022/640/640.jpg?hmac=eL8LqmacYbjMQcmDI3fUP6RcPrOc17cNprV0ob_1zWI',
  'https://i.picsum.photos/id/912/640/640.jpg?hmac=XsUObYKPDc5Lm6kNC_Ba3NdosOYwgGbDcZa6mIrUrLs',
  'https://i.picsum.photos/id/296/640/640.jpg?hmac=eqbqmzIvHmPLyY6CA1jYOUjzB6epBBTgYZxlV07uD0M',
  'https://i.picsum.photos/id/399/640/640.jpg?hmac=hfUgpG3GaHuHx8dI6pNQTa3EpvrzJMbGLLN2BxoUFVg',
  'https://i.picsum.photos/id/436/640/640.jpg?hmac=lSExp2ZnSIPYy-2OPONXCtklK4KVXwQb8ks2ps2H2Kk',
  'https://i.picsum.photos/id/118/640/640.jpg?hmac=9eDpAAk_-zZm6UTHesxJx6KOf3Woe81aEHZKQEhW5y0',
  'https://i.picsum.photos/id/916/640/640.jpg?hmac=EHluv0BZVuQN086F8oSnDxATmI5dUPj55DKgaLFrhxs',
  'https://i.picsum.photos/id/396/640/640.jpg?hmac=VdBTqu346MK-eSb56C1ECAafLjS5pZmVceD8vukN_Gw',
  'https://i.picsum.photos/id/1069/640/640.jpg?hmac=Ud9JbyZwA5Z3zbd7rBqGdl35_p_0cCmDi3z8MMQqGDk',
  'https://i.picsum.photos/id/701/640/640.jpg?hmac=_sFE_KXZDTWd-lmWANBltHjz0kEg47jwNYo7FbsOZmw',
  'https://i.picsum.photos/id/274/640/640.jpg?hmac=j3fdQJ3m4ZtebCV1z3zX2jOMdd9suY0Z2ApZ7zSIbFE',
  'https://i.picsum.photos/id/654/640/640.jpg?hmac=-MzeqOYDYPFs1UTKdciPPZGv9gm5M11neqfTcOH0S3k',
  'https://i.picsum.photos/id/970/640/640.jpg?hmac=E_2cOK4itdGLk-lUo0Y8197W-fd4PHRsIHN36R9ft5k',
  'https://i.picsum.photos/id/935/640/640.jpg?hmac=YnzWURTk63wT6KAUprsF3zfAb8Ws4URDky1RjqjC_-Q',
  'https://i.picsum.photos/id/477/640/640.jpg?hmac=PbmMRK_FS_zhXcEz2rgWGJ99V9kEGz6LUoIXhlAjV0Y',
];

const ADJECTIVES = [
  'swift',
  'vulgar',
  'efficacious',
  'foregoing',
  'bewildered',
  'significant',
  'torpid',
  'capable',
  'futuristic',
  'melodic',
  'nebulous',
  'annoying',
  'beneficial',
  'little',
  'unadvised',
  'level',
  'rainy',
  'debonair',
  'educated',
  'thin',
];

const NOUNS = [
  'shy',
  'analysis',
  'enhance',
  'twilight',
  'value',
  'army',
  'cylinder',
  'qualification',
  'peace',
  'depend',
  'buttocks',
  'holiday',
  'motorist',
  'passive',
  'progress',
  'popular',
  'witness',
  'judge',
  'examination',
  'roll',
];

const USERNAMES = [
  'reddafordfaculty',
  'thrashmacular',
  'buryabnormal',
  'strathmoremeriadoc',
  'tabbyfrosting',
  'kodyrhiconich',
  'penaltyquanzhou',
  'leeboardvain',
  'strutcone',
  'bucketspickled',
  'upholdbusiness',
  'landfillpupil',
  'cramponmute',
  'recklesstiki',
  'unguidedgleads',
  'numberlesshuff',
];

const USER_ROLES = {
  STUDENT: 'STUDENT',
  TEACHER: 'TEACHER',
  ADMIN: 'ADMIN',
};

const ARTIST_NAMES = [
  'J.J. Cale',
  'Jack Bruce',
  'Jack Johnson',
  'Jackson 5',
  'Jacques Brel',
  'Jadakiss',
  'The Jam',
  'James',
  'James Bay',
  'James Blake',
  'James Brown',
  'James Morrison',
  'James Taylor',
  'Jane’s Addiction',
  'Janet Jackson',
  'Japan & David Sylvian',
  'Jay-Z',
  'Jeru the Damaja',
  'Jessie J',
  'Jimi Hendrix',
  'Jimmy Buffett',
  'Jimmy Cliff',
  'Jimmy Eat World',
  'Jimmy Ruffin',
  'Jimmy Smith',
  'Joan Armatrading',
  'Joan Baez',
  'Joe Cocker',
  'Joe Jackson',
  'Joe Sample',
  'Joe Walsh / The James Gang',
  'John Coltrane',
  'John Fogerty',
  'John Lee Hooker',
  'John Lennon',
  'John Martyn',
  'John Mayall',
  'John Mellencamp',
  'John Williams',
  'Johnny Cash',
  'Johnny Gill',
  'Joni Mitchell',
  'Jonny Lang',
  'Joss Stone',
  'Jr. Walker & The All Stars',
  'Julie London',
  'Jurassic 5',
  'Justin Bieber',
];

exports.CHARS = CHARS;
exports.ARTIST_NAMES = ARTIST_NAMES;
exports.USERNAMES = USERNAMES;
exports.ENCRYPTED_PASSWORD = ENCRYPTED_PASSWORD;
exports.USER_AVATAR_URLS = USER_AVATAR_URLS;
exports.NOTATION_THUMBNAIL_URLS = NOTATION_THUMBNAIL_URLS;
exports.ADJECTIVES = ADJECTIVES;
exports.NOUNS = NOUNS;
exports.USER_ROLES = USER_ROLES;
