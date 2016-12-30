const hasChirpUsername = (chirp, username) => {
  const inRetweeted = chirp.retweetedStatus && chirp.retweetedStatus.user.screenName === username;
  const inQuoted = chirp.quotedTweet && chirp.quotedTweet.user.screenName === username;
  const inChirp = chirp.user.screenName === username;

  return inRetweeted || inQuoted || inChirp;
};

const isThereAnEgg = (chirp) => {
  const pattern = 'default_profile_images';
  const inRetweeted = chirp.retweetedStatus && chirp.retweetedStatus.user.profileImageURL.includes(pattern);
  const inQuoted = chirp.quotedTweet && chirp.quotedTweet.user.profileImageURL.includes(pattern);
  const inChirp = chirp.user && chirp.user.profileImageURL.includes(pattern);

  return Boolean(inRetweeted || inQuoted || inChirp);
};

export const shouldBeMuted = (chirp) => {
  return `isThereAnEgg ${isThereAnEgg(chirp)}`;
};
