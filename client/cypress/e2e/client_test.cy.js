import 'cypress-file-upload'
import AuthController from '../../src/api/auth_request_api'

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

describe('LoginScreen test ', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login')
  })

  it('should exist', () => {
    cy.get('[data-test-id="LoginEmailSection"]').should("exist")
  })
})

describe('testing HomeScreen', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
  })

  it('should display GeoWizard in Banner', () => {
    cy.get('span').should('contain', 'GeoWizard')
  })
  it('Should show dropdown when clicking Time button', () => {
    cy.contains('Time').click()
    cy.get('button').should('contain', "Today")
  })

  it('Should show dropdown when clicking Sort button', () => {
    cy.contains('Sort').click()
    cy.get('button').should('contain', "Recents")
  })

  it('should display in search bar', () => {
    cy.get('input[placeholder="Search for maps"]').type('America').should('have.value', 'America')
  })

  it('Login Button should exist', () => {
    cy.contains('button', 'Login').should('exist')
  })

  it('Sign Up Button should exists', () => {
    cy.contains('button', 'Sign Up').should('exist')
  })

  it('Redirect to Login Page', () => {
    cy.contains('button', 'Login').click()
    cy.url().should('include', '/login')
  })

  it('Redirect to Register Page', () => {
    cy.contains('button', 'Sign Up').click()
    cy.url().should('include', '/createAccount')
  })
})

// describe('testing SearchScreen', () => {
//   beforeEach(() => {
//     cy.visit('http://localhost:3000/search')
//   })

//   it('should display GeoWizard in Banner', () => {
//     cy.get('span').should('contain', 'GeoWizard')
//   })

//   it('Should show dropdown when clicking time button', () => {
//     cy.contains('Sort').click()
//     cy.get('a').should('contain', "Trending")
//   })

//   it('should display in search bar', () => {
//     cy.get('input[placeholder="Search for maps').type('America').should('have.value', 'America')
//   })

// })

describe('testing edit upload', () => {
  beforeEach(() => {
    cy.setCookie('token', '123')
    cy.intercept('GET', '/users/me', {
      statusCode: 200,
      body: {
        _id: 'id',
        username: 'testuser',
        email: 'test@example.com',
        token: "123"
      }
    })
    cy.visit("http://localhost:3000/editUpload")
  })

  afterEach(() => {
    cy.clearCookie('token');
  });
  it('should move to editing page', () => {

    cy.get('.France').click()
    cy.url().should('eq', 'http://localhost:3000/editingMap')

  })

  it('should move to next available maps', () => {
    cy.get('.next').click()
    cy.get('.FinlandLabel').should('have.text', 'Edit Finland')
  })


})
describe('testing editing map page', () => {
  beforeEach(() => {
    // cy.stub(AuthController, 'authgetUser').withArgs('123').resolves({
    //   _id: 'id',
    //   username: 'testuser',
    //   email: 'test@example.com',
    //   token: "123"
    // })

    cy.setCookie('token', '123')
    cy.intercept('GET', '/users/me', {
      statusCode: 200,
      body: {
        _id: 'id',
        username: 'testuser',
        email: 'test@example.com',
        token: "123"
      }
    })
    cy.visit("http://localhost:3000/editUpload")
    cy.get('[data-test-id="upload-button"]').click()
    cy.get('input[type="file"]').attachFile("france-compress.geo.json")
  })

  afterEach(() => {
    cy.clearCookie('token');
  });

  it('should change title', () => {
    cy.get('input[placeholder="Enter Title...').type('New Title').should('have.value', 'New Title')

  })

  it('should move to heatmap', () => {
    cy.contains('Select Map Type ▼').click()
    cy.contains('Heatmap').should('have.text', 'Heatmap')
  })
  it('should show heatmap options', () => {
    cy.contains('Select Map Type ▼').click()
    cy.contains('Heatmap').click()
    cy.get('[class*="heatcolors"]').should("exist")
  })

  it('should move to pointmap', () => {
    cy.contains('Select Map Type ▼').click()
    cy.contains('Point/Locator').should('have.text', 'Point/Locator')
  })

  it('should move to symbol', () => {
    cy.contains('Select Map Type ▼').click()
    cy.contains('Symbol').should('have.text', 'Symbol')
  })
  it('should show symbol options', () => {
    cy.contains('Select Map Type ▼').click()
    cy.contains('Symbol').click()
    cy.get('[class*="symbolOptions"]').should("exist")
  })

  it('should move to choropleth', () => {
    cy.contains('Select Map Type ▼').click()
    cy.contains('Choropleth').should('have.text', 'Choropleth')
  })

  it('should show choropleth options', () => {
    cy.contains('Select Map Type ▼').click()
    cy.contains('Choropleth').click()
    cy.get('[class*="choroOptions"]').should("exist")
  })

  it('should move to flow', () => {
    cy.contains('Select Map Type ▼').click()
    cy.contains('Flow').should('have.text', 'Flow')
  })

  it('should export the file', () => {
    cy.get('select[name="Export"]').select('GeowizJson')
    cy.get('option[value="GEOWIZ"]').trigger('click',{ force: true });
    cy.readFile('cypress/downloads/geowizardMap.geowizjson').should("exist");
  })
})

describe('testing view page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/mapview')
  })

  it('should change comment', () => {
    cy.get('input[placeholder="Enter new comment..."]').type('New Comment').should('have.value', 'New Comment')
  })

})

describe('testing create account screen', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/createAccount')
  })

  it('should type text into the input field', () => {

    cy.get('.caUserEmail')
      .type('exampleText')
      .should('have.value', 'exampleText');

  })

  it('should type text into the input field', () => {
    cy.get('.caPassword')
      .type('exampleText')
      .should('have.value', 'exampleText');
  })

  it('should type text into the input field', () => {
    cy.get('.caComfirmPassword')
      .type('exampleText')
      .should('have.value', 'exampleText');
  })

})

describe('testing create account success page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/createAccountSuccess')
  })

  it('should display "Account Created!" text', () => {
    cy.contains('Account Created!').should('exist')
  })

  it('should display the success message', () => {
    cy.contains('You have successfully created an account. You may now close this window.').should('exist')
  })
})

describe('testing find email screen', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/findEmail')
  })

  it('should type text into the input field', () => {
    cy.get('.theEmail')
      .type('exampleText')
      .should('have.value', 'exampleText');
  })

  it('should display find your email message', () => {
    cy.contains('Find Your Email').should('exist')
  })
})

describe('testing reset email message screen', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/resetMessage')
  })

  it('should display find your email message', () => {
    cy.contains('Reset Your Password').should('exist')
  })

})

describe('testing change password screen', () => {
  beforeEach(() => {
    const id = 'mockUserId';
    const userName = 'mockUserName';
    const token = 'mockToken';

    const url = `http://localhost:3000/changeYourPassword/${id}/${userName}/${token}`;
    cy.visit(url);
  });

  it('should type text into the input field', () => {
    cy.get('.cpPassword')
      .type('exampleText')
      .should('have.value', 'exampleText');
  })

  it('should type text into the input field', () => {
    cy.get('.cpComfirmPassword')
      .type('exampleText')
      .should('have.value', 'exampleText');
  })

})

describe('testing change password success page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/changePasswordSuccess')
  })

  it('should display "Account Created!" text', () => {
    cy.contains('Password Changed!').should('exist')
  })

  it('should display the success message', () => {
    cy.contains('Your password has been changed successfully. You many now close this window.').should('exist')
  })
})