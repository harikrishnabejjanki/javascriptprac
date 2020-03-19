// Budget controller


var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id,
            this.description = description,
            this.value = value,
            this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function (totalIncome) {

        if (totalIncome > 0) {
            this.percentage = Math.round(this.value / totalIncome * 100);

        } else {
            this.percentage = -1;
        }

    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
    }

    var Income = function (id, description, value) {
        this.id = id,
            this.description = description,
            this.value = value
    };



    var calculateTotal = function (type) {

        var sum = 0;
        data.allItems[type].forEach(function (item, index, array) {

            sum = sum + item.value;

        });

        data.totals[type] = sum;
    }
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    }

    return {
        addItem: function (type, des, val) {
            var newItem, Id;
            // create new id

            if (data.allItems[type].length > 0) {
                Id = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                Id = 0;
            }



            // create an item, based on inc or exp type
            if (type == 'exp') {
                newItem = new Expense(Id, des, val);
            } else if (type == 'inc') {
                newItem = new Income(Id, des, val);
            }
            //pushing into data strucure
            data.allItems[type].push(newItem);

            // returning item
            return newItem;


        },

        deleteItem: function (type, id) {

            var ids, index;


            ids = data.allItems[type].map(function (current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }

        },
        calculateBudget: function () {

            // calculate total expenses and income
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate budget // expenses - income

            data.budget = data.totals.inc - data.totals.exp;
            // calculate the percentage of income that we spent
            if (data.totals.inc > 0) {

                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }



        },
        calculatePercentages: function () {
            data.allItems.exp.forEach(function (curr) {
                curr.calcPercentage(data.totals.inc);

            })
        },

        getPercentages: function () {

            var allPerc = data.allItems.exp.map(function (curr) {
                return curr.getPercentage();
            })

            return allPerc;
        },
        getBudget: function () {

            return {
                budget: data.budget,
                totalIncome: data.totals.inc,
                expenses: data.totals.exp,
                percentage: data.percentage
            }
        },

        testing: function () {
            console.log('result', data);

        }
    }


})();

var Income = function (id, description, value) {
    this.id = id,
        this.description = description,
        this.value = value
};


// Ui controller
var UIcontroller = (function () {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        budgetIncomeLabel: '.budget__income--value',
        budgetExpenseLabel: '.budget__expenses--value',
        budgetExpensePercentage: '.budget__expenses--percentage',
        container: '.container',
        exppensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'

    };
    var formatNumber = function (number, type) {
        /*
        
       +  or - before number
       exactly 2 decimal points

       comma separate by thousands

       eg.   2000.212 =>  +2,000.21

        */

        var numSplit, int, dec;

        number = Math.abs(number);
        number = number.toFixed(2);
        numSplit = number.split('.');
        int = numSplit[0];
        dec = numSplit[1];

        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);  // ex: input is 2211 ==> 2,211  for comma separate for thousands
        }

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec

    },
    var nodeListForEach = function (list, callback) {

        for (var i = 0; i < list.length; i++) {
            callback(list[i], i)
        }
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp

                description: document.querySelector(DOMstrings.inputDescription).value,

                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }



        },

        clearFields: function () {

            var fields, fieldsArray;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

            fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(function (currentval, index, array) {
                currentval.value = "";

            });

            fieldsArray[0].focus();

        },

        displayBudget: function (obj) {

            var type;

            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.budgetIncomeLabel).textContent = formatNumber(obj.totalIncome, 'inc');
            document.querySelector(DOMstrings.budgetExpenseLabel).textContent = formatNumber(obj.expenses, 'exp');



            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.budgetExpensePercentage).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.budgetExpensePercentage).textContent = '---';
            }

        },
        getDomStrings: function () {
            return DOMstrings

        },
        addListItem: function (obj, type) {

            var html, newHtml, element;
            // create HTML string with placeholder text

            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div>  <div class="right clearfix"> <div class="item__value">%value%</div><div class="item__delete">  <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div></div>'
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%<div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }



            // Replace the placeholder text with some actual data

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
            // Insert HTML into DOM

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        deleteListItem: function (selectorId) {
            var el = document.getElementById(selectorId);
            el.parentNode.removeChild(el);



        },
        displayPercentages: function (percentages) {
            var fields = document.querySelectorAll(DOMstrings.exppensesPercLabel);



            nodeListForEach(fields, function (current, index) {

                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }

            })
        },

        displayMonth: function () {

            var now, year, month, months;

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            now = new Date();
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;


        },

        changeType: function () {

            var fields = document.querySelectorAll(

                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue
            );

            nodeListForEach(fields, function (curr) {

                curr.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red-focus');
        }
    }

})();


// Global controller
var controller = (function (budgetCntlr, UIcontlr) {


    var setupEventListners = function () {


        var DOM = UIcontlr.getDomStrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', cntlAddItem);

        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13 || e.which === 13) {
                cntlAddItem();
            }

        });

        document.querySelector(DOM.container).addEventListener('click', cntrlDeleteItem);

        document.querySelector(DOMstrings.inputType).addEventListener('change', UIcontlr.changeType)
    }

    var cntlAddItem = function () {
        var input, newItem;
        // 1. Get the field input data

        input = UIcontlr.getInput();

        if (input.description && input.value) {
            //2 . Add the item to the budget contoller

            newItem = budgetCntlr.addItem(input.type, input.description, input.value);
            //3 .Add the item to the UI

            UIcontlr.addListItem(newItem, input.type);

            //4. clear the fields

            UIcontlr.clearFields();

            //5. Calculate and update the budget

            updateBudget();

            // 6. Calculate the percentages

            updatePercentages();

        } else {
            console.log('hai');

        }



    }

    var cntrlDeleteItem = function (event) {

        var itemId, splitId, type, Id;
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemId) {
            splitId = itemId.split('-');
            type = splitId[0];
            Id = parseInt(splitId[1]);


            // delete the item from data strucure

            budgetCntlr.deleteItem(type, Id);
            // delete from ui

            UIcontlr.deleteListItem(itemId);
            // update and show new budget 

            updateBudget();

            //  Calculate the percentages

            updatePercentages();
        }

    }

    var updatePercentages = function () {
        // calculate percentages
        budgetCntlr.calculatePercentages();
        // read percentage from the budget  controller

        var percentages = budgetCntlr.getPercentages();


        // update the percentage on the ui
        UIcontlr.displayPercentages(percentages);


    }
    var updateBudget = function () {
        // 1. Calculate the budget

        budgetCntlr.calculateBudget();

        // 2. return the budget
        var budget = budgetCntlr.getBudget();

        //3. Display the budget on the UI

        UIcontlr.displayBudget(budget);

    }




    return {
        init: function () {
            UIcontlr.displayBudget({
                budget: 0,
                totalIncome: 0,
                expenses: 0,
                percentage: 0
            });
            setupEventListners();
            UIcontlr.displayMonth();
        }
    }


})(budgetController, UIcontroller);

controller.init();

