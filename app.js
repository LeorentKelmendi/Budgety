//BUDGET CONTROLLER
var budgetController = (function(){
    var Expense = function(id, description, value){
        this.id = id;
        this.value = value;
        this.description = description;
    };

    var Income = function(id, description, value){
        this.id = id;
        this.value = value;
        this.description = description;
    };

    var data = {
        allItems:{
            expense: [],
            income: [],
        },
        totals:{
            expense: 0,
            income: 0
        }
    };

    return{
        addItem: function(type, des, val){

            var newItem,ID;
            //create new id
            if(data.allItems[type].length > 0){
              ID = data.allItems[type][data.allItems[type].length - 1 ].id + 1;
            }else{
              ID = 0;
            }
            //create new item
            if(type === 'expense'){
                newItem = new Expense(ID, des, val);
            }else if (type === 'income'){
                newItem = new Income(ID, des, val);
            }

            //push to items and return.
            data.allItems[type].push(newItem);
            return newItem;
        },
        testing: function(){
            console.log(data);
        }
    }
})();

//UI CONTROLLER
var UIController = (function(){

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer:'.income__list',
        expensesContainer: '.expenses__list'
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
        },
        addListItem: function(obj, type){
            var html, newHtml, element, finalHtml;

            if(type === 'income'){
            element = DOMStrings.incomeContainer;
            html ='<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else{
            element = DOMStrings.expensesContainer;
            html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%',  obj.description);
            finalHtml = newHtml.replace('%value%',  obj.value);

            document.querySelector(element).insertAdjacentHTML('beforeend', finalHtml);
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
          var newItem = budgetController.addItem(input.type, input.description, input.value);
         // add the new item to user interface
          UIController.addListItem(newItem, input.type);
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