describe('CRUDE on parameters',() =>{
    beforeEach(function(){
        cy.get('[placeholder="Username"]').type('rmuser');
        cy.get('[placeholder="Password"]').type('Surya@1111');
        cy.get('.login-button').click();
    });
        //Session Expired
        test.forEach(test =>{
            it(test.name, function(){

            });
        })
        cy.get('#MC_btnLogin').click();
        //Planning Secion
        cy.get('li[class="menuitem"]').eq(1).click();
        cy.get('#PC_HC_HyperLink5').click();

        //CRUDE Operation
        //Create
        cy.get('#PC_MC_btnAdd').click();
        cy.get('#PC_MC_txtName').type('7 day');
        //cy.get('#PC_MC_txtCycleStartDate').to.be.greaterThan('19-03-2022') 
        cy.get('#PC_MC_txtNumberOfMonths').type('2');
        
    })
