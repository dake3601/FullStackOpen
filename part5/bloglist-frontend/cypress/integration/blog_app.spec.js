describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
    cy.get('#username').parent().contains('username:')
    cy.get('#password').parent().contains('password')
    cy.get('#login-button').parent().contains('login')
  })
})
