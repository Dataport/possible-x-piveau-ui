// https://docs.cypress.io/api/table-of-contents

describe('My First Test', () => {
  it('Visits the app root url', () => {
    cy.visit('/test2');
    cy.contains('h1', "This is a test module named 'Test2'");
  })
});
