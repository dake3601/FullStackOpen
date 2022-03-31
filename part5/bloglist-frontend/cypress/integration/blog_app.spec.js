describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.createUser({
      name: 'Test Name',
      username: 'testUser',
      password: 'password'
    })
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
      cy.login({ username: 'testUser', password: 'password' })
    })

    it('A blog can be created', function() {
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

    describe('and a blog exists', function() {
      beforeEach(function() {
        cy.createBlog({
          title: 'A Guide on React',
          author: 'John Doe',
          url: 'https://reactjs.org/'
        })
      })
  
      it('User can like a blog', function() {
        cy.contains('view').click()
        cy.contains('likes 0')
        cy.contains('like').click()
        cy.contains('likes 1')
      })

      it('User can delete a blog', function() {
        cy.contains('view').click()
        cy.contains('remove').click()
        cy.get('html').should('not.contain', 'A Guide on React')
      })
    })

    describe('and a blog from another user exists', function() {
      beforeEach(function() {
        cy.createBlog({
          title: 'A Guide on React',
          author: 'John Doe',
          url: 'https://reactjs.org/'
        })
        cy.createUser({
          name: 'First Last',
          username: 'secondUser',
          password: 'passwd'
        })
        cy.login({ username: 'secondUser', password: 'passwd' })
      })
  
      it('User can not delete the blog', function() {
        cy.contains('view').click()
        cy.get('#blogs').should('not.contain', 'remove')
      })
    })
  })
})
