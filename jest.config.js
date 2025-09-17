export default {
  transform: {},  
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  moduleNameMapper: {
    "^../middleware/auth.js$": "<rootDir>/middleware/__mocks__/auth.js"
  }
  
};