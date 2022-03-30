describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'First Last',
      username: 'testUser',
      password: 'password'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user) 
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
    cy.get('#username').parent().contains('username:')
    cy.get('#password').parent().contains('password')
    cy.get('#login-button').parent().contains('login')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('testUser')
      cy.get('#password').type('password')
      cy.get('#login-button').click()
  
      cy.get('#notification')
        .should('contain', 'Login Successful')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
        .and('have.css', 'border-style', 'solid')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('wrong-user')
      cy.get('#password').type('wrong-password')
      cy.get('#login-button').click()
  
      cy.get('#notification')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
    })
  })
})
