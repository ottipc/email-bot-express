module.exports = {
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./tests/setupMocks.js', './tests/setup.js'], // Lade Mocks und MongoDB-Setup
};

module.exports = {
     testEnvironment: 'node', // Node.js als Testumgebung
     setupFiles: ['dotenv/config'], // Automatisches Laden von Umgebungsvariablen
     moduleDirectories: ['node_modules', 'src'],
     testTimeout: 10000, // Setze Timeout für Tests
 };

config.OPENAI_API_KEY = 'dummy_key_for_testing';


