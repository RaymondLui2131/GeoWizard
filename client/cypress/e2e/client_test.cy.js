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

describe('testing edit upload', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/editUpload')
  })

  it('should move to editing page', () => {

    cy.get('.France').click()
    cy.url().should('eq', 'http://localhost:3000/editingmap') 

  })

  it('should move to next available maps', () => {
    cy.contains('→').click()
    cy.get('.Finland').should('have.text', 'Edit  Finland')
  })

})

describe('testing editing map page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/editingmap')
  })

  it('should change title', () => {
    cy.get('input[placeholder="Enter Title...').type('New Title').should('have.value', 'New Title')

  })

  it('should move to heatmap', () => {
    cy.contains('Select Map Type ▼').click()
    cy.contains('Heatmap').should('have.text', 'Heatmap ')
  })

  it('should move to pointmap', () => {
    cy.contains('Select Map Type ▼').click()
    cy.contains('Point/Locator').should('have.text', 'Point/Locator')
  })

  it('should move to symbol', () => {
    cy.contains('Select Map Type ▼').click()
    cy.contains('Symbol').should('have.text', ' Symbol ')
  })

  it('should move to choropleth', () => {
    cy.contains('Select Map Type ▼').click()
    cy.contains('Choropleth').should('have.text', 'Choropleth ')
  })

  it('should move to flow', () => {
    cy.contains('Select Map Type ▼').click()
    cy.contains('Flow').should('have.text', 'Flow ')
  })
})

describe('testing editing map page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/mapview')
  })

  it('should change title', () => {
    cy.get('input[placeholder="Enter new comment...').type('New Comment').should('have.value', 'New Comment')
  })

})



