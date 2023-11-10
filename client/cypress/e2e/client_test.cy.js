describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000') // change this later
  })
})

describe('testing RegisterScreen', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/register')
  })

  it('should display the registration form', () => {
    cy.get('h2').should('contain', 'Register')
    cy.get('form').should('exist')
  })

  it('should display an error message for password mismatch', () => {
    cy.get('input[name="password1"]').type('password123')
    cy.get('input[name="password2"]').type('differentpassword')
    cy.get('button[type="submit"]').click()
    cy.get('p').should('contain', "Passwords don't match")
  })
})

describe('LoginScreen Component', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login')
  })

  it('should exist', () => {
    cy.get('[data-test-id="login-div"]').should("exist")
  })
})
