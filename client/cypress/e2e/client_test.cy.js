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

describe('testing HomeScreen', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
  })

  it('should display GeoWizard in Banner', () => {
    cy.get('span').should('contain', 'GeoWizard')
  })

  it('Should show dropdown when clicking time button', () => {
    cy.contains('Time').click()
    cy.get('a').should('contain', "Today")
  })

  it('should display in search bar', () => {
    cy.get('input').type('America').should('have.value', 'America')
  })

})

describe('testing SearchScreen', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/search')
  })

  it('should display GeoWizard in Banner', () => {
    cy.get('span').should('contain', 'GeoWizard')
  })

  it('Should show dropdown when clicking time button', () => {
    cy.contains('Sort').click()
    cy.get('a').should('contain', "Trending")
  })

  it('should display in search bar', () => {
    cy.get('input[placeholder="Search for maps').type('America').should('have.value', 'America')
  })

})

