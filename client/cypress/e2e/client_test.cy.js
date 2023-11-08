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


describe('testing LoginScreen', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
  })

  it('should display the login form', () => {
    cy.get('form').should('exist')
    cy.get('input[name="email"]').should('exist')
    cy.get('input[name="password"]').should('exist')
    cy.get('button[type="submit"]').should('exist')
  })

  it('should display a link to the registration page', () => {
    cy.get('a[href="/register"]').should('exist')
  })

  it('should display message for invalid login', () => {
    cy.get('input[name="email"]').type('dontexist@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('[data-test-id="login-button"]').click()

    cy.get('pre').should('contain', JSON.stringify({ "message": "Invalid credentials" }, null, 2))
  })

  it('should display message for missing fields', () => {
    cy.get('input[name="password"]').type('password123');
    cy.get('[data-test-id="login-button"]').click()
    cy.get('pre').should('contain', JSON.stringify({
      "message": "Missing required fields for login"
    }, null, 2))
  })

  it('should display message for invalid token', () => {
    cy.get('input[name="token"]').type('wrongtoken');
    cy.get('[data-test-id="user-button"]').click()
    cy.get('pre').should('contain', JSON.stringify({
      "message": "Not authorized, token failed"
    }, null, 2))
  })
})