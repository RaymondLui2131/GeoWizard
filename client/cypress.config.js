const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    projectId: "1tka2d",
    baseUrl: "https://geowizard-app-b802ae01ce7f.herokuapp.com/",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },

  component: {
    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
    },
  }, 
});

