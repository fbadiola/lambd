// Platforms Enum
const Platforms = {
  AWS: 0,
  GCLOUD: 1,
  isValidPlatform: (platform) => {
    return (
      platform === Platforms.AWS || 
      platform === Platforms.GCLOUD
    );
  },  
}

module.exports = Platforms;