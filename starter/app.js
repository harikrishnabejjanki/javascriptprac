// Budget controller


var budgetController = (function () {

})();


// Ui controller
var UIcontroller = (function () {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn :'.add__btn'
    }

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp

                description: document.querySelector(DOMstrings.inputDescription).value,

                value: document.querySelector(DOMstrings.inputValue).value
            }



        },
      
    getDomStrings : function(){
            return DOMstrings
            
    }
      

    }

})();


// Global controller
var controller = (function (budgetCntlr, UIcontlr) {


var setupEventListners = function(){

    
    var DOM = UIcontlr.getDomStrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', cntlAddItem);

    document.addEventListener('keypress', function (e) {
        if (e.keyCode === 13 || e.which === 13) {
            cntlAddItem();
        }

    })
}

    var cntlAddItem = function () {
        // 1. Get the field input data

        var input = UIcontlr.getInput();
    

        console.log(input);


        //2 . Add the item to the budget contoller

        //3 .Add the item to the UI

        // 4. Calculate the budget

        //5. Display the budget on the UI

return {
    init : function(){
        setupEventListners();
    }
}

    }



})(budgetController, UIcontroller);

controller.init();

