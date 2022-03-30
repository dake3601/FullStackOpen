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

  describe('When logged in', function() {
    beforeEach(function() {
      cy.request('POST', 'http://localhost:3003/api/login', {
        username: 'testUser', password: 'password'
      }).then(response => {
      localStorage.setItem('loggedBlogappUser', JSON.stringify(response.body))
      cy.visit('http://localhost:3000')
      })
    })

    it.only('A blog can be created', function() {
      const author = 'John Doe'
      const title = 'A Guide on React'
      cy.contains('new blog').click()
      cy.get('#title-input').type(title)
      cy.get('#author-input').type(author)
      cy.get('#url-input').type('https://reactjs.org/')
      cy.get('#create-blog').click()

      cy.contains(`A new blog ${title} by ${author} added`)
      cy.get('#blogs').contains(`${title} by ${author}`)  
    })
  })
})
