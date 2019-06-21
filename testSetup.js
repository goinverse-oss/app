jest.mock('expo-file-system', () => {
  const FileSystem = {
    documentDirectory: 'file:///path/to/app/sandbox/',

    makeDirectoryAsync() {
      return Promise.resolve();
    },

    createDownloadResumable(url, fileUrl /* other args ignored */) {
      return {
        downloadAsync() {
          return Promise.resolve();
        },
        savable() {
          return { url, fileUrl };
        },
      };
    },

    deleteAsync: jest.fn().mockImplementation(() => Promise.resolve()),
  };

  return {
    ...jest.requireActual('expo-file-system'),
    ...FileSystem,
  };
});
