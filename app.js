//BUDGET CONTROLLER
var budgetController = (function(){

})();

//UI CONTROLLER
var UIController = (function(){

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
    };

    return{
        getInput: function(){
            var type = document.querySelector(DOMStrings.inputType).value;
            var description = document.querySelector(DOMStrings.inputDescription).value;
            var value = document.querySelector(DOMStrings.inputValue).value;
            return{
                type: type,
                description: description,
                value: value,
            }
        },
        getDOMstrings: function(){
            return DOMStrings;
        }
    }
})();

//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){

    var setupEventListeners = function(){

        var DOM = UIController.getDOMstrings();

        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.whitch === 13){
               ctrlAddItem();
            }
        });
    };



    var ctrlAddItem  = function(){
          // get the field input data
          var input = UIController.getInput();
         // add the item to the budget controller
         // add the new item to user interface
         // calculate the budged
         // display the budget
    }

    return{
        init: function(){
            console.log('Application started');
            setupEventListeners();
        }
    }
})(budgetController, UIController);

controller.init();