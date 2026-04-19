Feature: User Authentication tests
    
	Background:
    Given I am on the login page


    @smoke @reg
    Scenario: Login with valid credentials
    And User enter the username as "admin"
    And User enter the password as "password"
    Then Login should be successful