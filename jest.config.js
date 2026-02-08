module.exports = {
  preset: 'jest-expo',
  moduleNameMapper: {
    '^assets$': '<rootDir>/assets/index.ts',
    '^assets/(.*)$': '<rootDir>/assets/$1',
  },
};
