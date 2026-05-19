Feature: Items in Shopping cart tests
    
	Background:
    Given I am on the shopping page


    @smoke @reg
    Scenario: Add item "car"  to cart
    And User select 'car' from itemlist dropdown
    And User click add button
    Then "car" appears in the shopping cart


      @smoke @reg
    Scenario: Add item "gasoline"  to cart
    And User select 'gasoline' from itemlist dropdown
    And User click add button
    Then "gasoline" appears in the shopping cart