//BUDGET CONTROLLER
var budgetController = (function(){
    var Expense = function(id, description, value){
        this.id = id;
        this.value = value;
        this.description = description;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome){
        console.log('Here');
        if(totalIncome > 0 ){
         this.percentage = Math.round(( this.value / totalIncome) * 100);
        }else{
         this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function(){
        return this.percentage;
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
        },
        budget: 0,
        percentage: -1,
    };

    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(item){
            sum = sum + item.value;
        });
        data.totals[type] = sum;
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
        deleteItem: function(type, id){
            var ids = data.allItems[type].map(function(current){
                return current.id;
            });

            var index = ids.indexOf(id);

            if(index !== -1){
                data.allItems[type].splice(index,1);
            }
        },
        calculateBudget: function(){
            calculateTotal('expense');
            calculateTotal('income');

            //calculate budget.
            data.budget = data.totals.income - data.totals.expense;

            if(data.totals.income > 0 ){
              //calculate the percentage of income that we spent
              data.percentage = Math.round((data.totals.expense / data.totals.income) * 100);
            }else{
                data.percentage = -1;
            }

        },
        getBudget: function(){
            return{
                budget: data.budget,
                totalIncome: data.totals.income,
                totalExpense: data.totals.expense,
                percentage: data.percentage
            }
        },
        calculatePercentage: function(){
            data.allItems.expense.forEach(function(expense){
                expense.calcPercentage(data.totals.income);
            });
        },
        getPercentages: function(){
            var allPerc = data.allItems.expense.map(function(expense){
                return expense.getPercentage();
            });
            return allPerc;
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
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage'
    };

    return{
        getInput: function(){
            var type = document.querySelector(DOMStrings.inputType).value;
            var description = document.querySelector(DOMStrings.inputDescription).value;
            var value = parseFloat(document.querySelector(DOMStrings.inputValue).value);
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
        },
        deleteListItem:function(selectorId){
            document.getElementById(selectorId).parentNode.removeChild(document.getElementById(selectorId))
        },
        clearFields: function(){
            var fields, fieldsArray;
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', '+DOMStrings.inputValue);
            console.log(fields);
            fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(function(field, index, array){
                field.value = "";
            });

            fieldsArray[0].focus();
        },
        displayBudget: function(obj){
            document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalIncome;
            document.querySelector(DOMStrings.expenseLabel).textContent = obj.totalExpense;
            if(obj.percentage > 0){
            document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            }else{
            document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            }
        },

        displayPercentages: function(percentages){
            var fields = document.querySelectorAll(DOMStrings.expensesPercLabel);

            var nodelListForEach = function(list, callback){
                for(var i = 0; i < list.length; i++){
                    callback(list[i], i);
                }
            };

            nodelListForEach(fields, function(current, index){
                if(percentages[index] > 0 ){
                  current.textContent = percentages[index] + '%';
                }else{
                    current.textContent = '---';
                }
            });
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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    var updatePercentages = function(){

        //calculate the percentages
        budgetController.calculatePercentage();

        //read them from budget controller
        var percentages = budgetController.getPercentages();

        //update the user interface with new percentages
        UIController.displayPercentages(percentages);
    };

    var updateBudget = function(){
          // calculate the budged
        budgetController.calculateBudget();
         // return the budget
         var budget = budgetController.getBudget();

         // display the budget

        UIController.displayBudget(budget);
    };

    var ctrlDeleteItem = function(e){
        var itemID, splitID, type, ID;
        itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID){
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //delete the item from datastructure.
            budgetController.deleteItem(type, ID);
            //delete item from UI
            UIController.deleteListItem(itemID);
            //Update and show new budget
            updateBudget();

            //calculate update percentages
            updatePercentages();
        }
    };

    var ctrlAddItem  = function(){
          // get the field input data
          var input = UIController.getInput();

          if(input.description !== "" && !isNaN(input.value) && input.value > 0){
             // add the item to the budget controller
              var newItem = budgetController.addItem(input.type, input.description, input.value);
             // add the new item to user interface
              UIController.addListItem(newItem, input.type);
              //clear the fields
              UIController.clearFields();
              //calculate and update budged
              updateBudget();

              //update and caclulate the percentages.
              updatePercentages();
          }
    };

    return{
        init: function(){
            console.log('Application started');
            UIController.displayBudget({
                budget:0,
                totalIncome:0,
                totalExpense:0,
                percentage: -1,
            });
            setupEventListeners();
        }
    }
})(budgetController, UIController);

controller.init();