describe('Testing 1', function(){

   beforeEach('login', function(){
    const excelFilePath = "./cypress/fixtures/Test_cases.xlsx"
    const sheetName='login';

    cy.task('generateJSONFromExcel', { excelFilePath, sheetName: 'login' }).then((credential) => {
        cy.visit('http://testapp.corporate.com/PFS_4.7.2_PL/Account/Login.aspx);
        cy.get('#MC_LoginUser_UserName').clear().type(credential[0].username);
        cy.get('#MC_LoginUser_Password').clear().type(credential[0].password);
        cy.get('#MC_LoginUser_LoginButton').click();
        cy.get('body').then(($btn) => {
            if ($btn.find('#MC_btnLogin').length > 0) {
                cy.get('#MC_btnLogin').click();
            }
        })
    })
    cy.get('li[class="menuitem"]').eq(1).click();
    cy.get('#PC_HC_HyperLink5').click();
   });

   it.only('Creating',function(){
    cy.get('#PC_MC_btnAdd').click();
    const excelFilePath = "./cypress/fixtures/Test_cases.xlsx"
    cy.task('generateJSONFromExcel', { excelFilePath, sheetName: 'create' }).then((data) => {
        for (let index = 0; index < data.length; index++)
        {
            //Cycle Name
            cy.get('input[id="PC_MC_txtName"]').clear('{waitForAnimations: true}').type(data[index].cname);
            //Cycle Start Date
            const date = data[index].startdate
            let newdate = date.replace(/\//g, '-');
            cy.get('input[id="PC_MC_txtCycleStartDate"]').clear('{waitForAnimations: true}').type(newdate);
            cy.get('#PC_MC_txtCycleStartDate').then(($date) => {
                var date = $date.val().split('-');//splitting the start date
                var d1 = new Date(date[2], date[1] - 1, date[0]);
                var d = new Date();
                var month = d.getMonth()+1;
                var day = d.getDate();
                cy.log($date.val())
                var output = (day < 10 ? '0' : '') + day + '-' + (month < 10 ? '0' : '') + month + '-' + d.getFullYear();
                cy.log(output)
                var output = output.split('-');
                var o = new Date(output[2], output[1] - 1, output[0]);
                expect(d1).to.be.gte(o);
            });
            //Cycle Close Date
            const date1 = data[index].closedate
            let newdate1 = date1.replace(/\//g, '-');
            cy.get('input[id="PC_MC_txtCycleClosureDate"]').clear('{waitForAnimations: true}').type(newdate1);
            cy.get('#PC_MC_txtCycleClosureDate').then(($date) => {
                cy.log($date.val());
                var date = $date.val().split('-');//splitting the close date
                var d = new Date(date[2], date[1] - 1, date[0]);
                cy.get('#PC_MC_txtCycleStartDate').then(($date1) => {
                    cy.log($date1.val());
                    var date1 = $date1.val().split('-');
                    var d1 = new Date(date1[2], date1[1] - 1, date1[0]);
                    expect(d).to.be.gte(d1);
                })
            })
            //Plan Start Months

            //Number of Months
            cy.get('input[id="PC_MC_txtNumberOfMonths"]').clear().type(data[index].NoofMonths);
            //Plan End Month - Automatic
            cy.get('input[id="PC_MC_txtPlanEndMonth"]').click()
            cy.get('#PC_MC_btn_Save').click();

            //Enabled
            var en = data[index].enabled
            if(en == 'yes'){
                cy.get('#PC_MC_blnlstTRUEIsEnabled').click()
                cy.log("Inside if")
            }else{
                cy.get('#PC_MC_blnlstFALSEIsEnabled').click()
                cy.log("Inside else")
            }

            //Board Plan
            var bp = data[index].enabled
            if(bp == 'yes'){
                cy.get('#PC_MC_blnlstTRUEIsEnabled').click()
                cy.log("Inside if")
            }else{
                cy.get('#PC_MC_blnlstFALSEIsEnabled').click()
                cy.log("Inside else")
            }

            //Save
            cy.get('#PC_MC_btn_Save').click();

            //Output
            cy.get('.notice-header').then(($a) => { 
                if ($a.text().includes('successfully')) {
                    cy.get('.notice-header').should('contain.text','Planning Cycle saved successfully')
                } else if ($a.text().includes('Planning Cycle')) { 
                    cy.get('.notice-header').should('contain.text','already exists.')
                } else {
                    cy.get('.notice-header').should('contain.text','Cycle with same cycle details already exists.')
                }
            })     
        }
    })   
});

    it.skip('Incorrect Create', function(){
        cy.get('#PC_MC_btnAdd').click();
        const excelFilePath = "./cypress/fixtures/Test_cases.xlsx"
        cy.task('generateJSONFromExcel', { excelFilePath, sheetName: 'create' }).then((data) => {
        for (let index = 0; index < data.length; index++)
        {
            //Empty Cycle name
            var cname = data[index].cname
            var len = cname.length()
            if(len<0){
                cy.get('.mandatoryMsg').should('contain.text', 'Field is mandatory')
            }

            //Invalid Cycle name
            var cname = data[index].cname
            let newcname = cname.replace(/[\W_]+/g,"");
            cy.get('#PC_MC_txtName').clear().type(newcname);
        }
        cy.get('#PC_MC_txtName').should('be.empty')
        cy.get('#PC_MC_txtNumberOfMonths').type('Helo');
        cy.get('#PC_MC_txtCycleClosureDate').clear();
        cy.get('#PC_MC_txtCycleClosureDate').type('22-02-2022');
        cy.get('#PC_MC_cycleClosureDateCompare').should('contain.text','Closure Date must be greater than Start Date')
        cy.get('#PC_MC_btn_Save').click()
        cy.get('#PC_MC_rfvName').should('contain.text','Field is mandatory')
        cy.get('#PC_MC_revNumberOfMonths').should('contain.text','Invalid input, Please enter valid integer')
    })               
});

    //Edit
    it.skip('Edit',function(){
        const excelFilePath = "./cypress/fixtures/Test_cases.xlsx"
        cy.task('generateJSONFromExcel', { excelFilePath, sheetName: 'edit' }).then((data) => {
            for (let index = 0; index < data.length; index++)
            {
                cy.get('#PC_MC_GV_RecordList_btnEdit_0').click();
                cy.get('#PC_MC_txtName').should('be.disabled');
                cy.get('#PC_MC_txtCycleStartDate').should('be.disabled');
                cy.get('#PC_MC_txtPlanStartMonth').should('be.disabled');
                cy.get('#PC_MC_txtNumberOfMonths').should('be.disabled');
                cy.get('#PC_MC_txtPlanEndMonth').should('be.disabled');
                const date = data[index].cdate
                let newdate = date.replace(/\//g, '-');
                cy.get('#PC_MC_txtCycleClosureDate').clear().type(newdate);

                cy.get('#PC_MC_btn_Save').click();
                cy.get('#PC_MC_txtCycleClosureDate').then(($date) => {
                    cy.log($date.val());
                    var date = $date.val().split('-');
                    var d = new Date(date[2], date[1] - 1, date[0]);
                    cy.get('#PC_MC_txtCycleStartDate').then(($date1) => {
                        cy.log($date1.val());
                        var date1 = $date1.val().split('-');
                        var d1 = new Date(date1[2], date1[1] - 1, date1[0]);
                        expect(d).to.be.gte(d1);
                    })
                })
                //Output
                cy.get('.notice-header').then(($a) => { 
                if ($a.text().includes('successfully')) {
                    cy.get('.notice-header').should('contain.text','Planning Cycle saved successfully')
                    } else if ($a.text().includes('Planning Cycle')) { 
                        cy.get('.notice-header').should('contain.text','already exists.')
                    } else {
                        cy.get('.notice-header').should('contain.text','Cycle with same cycle details already exists.')
                    }
                })
            }
            
        })   
    });

    //Incorrect Edit 
    it.skip('Incorrect Edit', function(){
        cy.get('#PC_MC_GV_RecordList_btnEdit_0').click();
        cy.get('#PC_MC_txtCycleClosureDate')
        .clear()
        .type('30-01-2022');
        cy.get('#PC_MC_btn_Save').click();
        cy.get('#PC_MC_cycleClosureDateCompare').should('contain.text','Closure Date must be greater than Start Date')
    });

    //Search
    it.skip('Searching',function(){
        const excelFilePath = "./cypress/fixtures/Test_cases.xlsx"
        cy.task('generateJSONFromExcel', { excelFilePath, sheetName: 'search' }).then((data) => {
            for (let index = 0; index < data.length; index++)
            {
                cy.get('input[id="PC_MC_txtName"]').clear('{waitForAnimations: false}').type(data[index].cname);
                //Enabled
                var en = data[index].enabled
                if(en == 'yes'){
                    cy.get('#PC_MC_blnlstTRUEIsEnabled').click()
                    cy.log("Inside if")
                }else{
                    cy.get('#PC_MC_blnlstFALSEIsEnabled').click()
                    cy.log("Inside else")
                }
                //Board Plan
                var bp = data[index].boardplan
                if(bp == 'yes'){
                    cy.get('#PC_MC_blnlstTRUEIsBoardApproved').click()
                    cy.log("Inside if")
                }else{
                    cy.get('#PC_MC_blnlstFALSEIsBoardApproved').click()
                    cy.log("Inside else")
                }
                //There are no records present.
                cy.get('#PC_MC_btnSearch').click();
                cy.get('table').contains('text','There are no records present.')
                
            }
            
        })   
    });

    //Clear All
    it.skip('Clear All',function(){
        const excelFilePath = "./cypress/fixtures/Test_cases.xlsx"
        cy.task('generateJSONFromExcel', { excelFilePath, sheetName: 'clear'}).then((data) => {
            for (let index = 0; index < data.length; index++)
            {
                cy.get('input[id="PC_MC_txtName"]').type(data[index].cname);  
                //Enabled
                var en = data[index].enabled
                if(en == 'yes'){
                    cy.get('#PC_MC_blnlstTRUEIsEnabled').click()
                    cy.log("Inside if")
                }else{
                    cy.get('#PC_MC_blnlstFALSEIsEnabled').click()
                    cy.log("Inside else")
                }
                //Board Plan
                var bp = data[index].boardplan
                if(bp == 'yes'){
                    cy.get('#PC_MC_blnlstTRUEIsEnabled').click()
                    cy.log("Inside if")
                }else{
                    cy.get('#PC_MC_blnlstFALSEIsEnabled').click()
                    cy.log("Inside else")
                }
                cy.get('#PC_MC_btnClearAll').click();
                cy.get('input[id="PC_MC_txtName"]').should('be.empty');
            }
        })   
    });

    //Delete
    it.skip('Delete a Record', function(){
        cy.get('table tbody tr td #PC_MC_GV_RecordList_btnDelete_1').click();
        cy.get('.notice-header h3').should('contain.text','Planning Cycle deleted successfully');
    });

});
