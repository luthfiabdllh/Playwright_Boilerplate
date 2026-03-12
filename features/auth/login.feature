@auth
Feature: Login

  Background:
    Given the user opens the login page

  @login-success
  Scenario: Successful login with valid credentials
    When the user enters "valid" email and "valid" password
    And the user clicks the Login button
    Then the user is redirected to the dashboard

  @login-failed
  Scenario: Failed login with invalid credentials
    When the user enters "invalid" email and "invalid" password
    And the user clicks the Login button
    Then the user sees a login error message

  @login-empty
  Scenario: Failed login when fields are empty
    When the user clicks the Login button without filling the form
    Then the user sees required field validation messages
