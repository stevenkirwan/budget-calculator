// Budget controller
var budgetController = (function(){
    
    // Expense object 
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100);
        }else{
           this.percentage = -1; 
        }
    };

    Expense.prototype.getPercentage = function(){
       return this.percentage;
    };

    // Income object
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type){

        var sum = 0;

        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        });   
        data.totals[type] = sum;
    };
    //Data object
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
    };

    return{

        // Push item to data object
        addItem: function(type, des, val){

            var newItem, ID;
            // Create new ID for item based on the prev ID +1
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else{
                ID = 0;
            }

            // Creat new item based on type
            if(type === 'exp'){
                newItem = new Expense (ID, des, val);
            }else if(type === 'inc'){
                newItem = new Income (ID, des, val);
            };

            // Push to data object
            data.allItems[type].push(newItem);
            
            // return new item 
            return newItem;
        },

        deleteItem: function(type, id){
           
            var ids, index;

            ids = data.allItems[type].map(function(current){
                return current.id;
            });

            index = ids.indexOf(id);

            if(index !== -1){
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function(){

            // Calculat etotal income and expenses
            calculateTotal('exp');   
            calculateTotal('inc');

            // Calculate the budget
            data.budget = data.totals.inc - data.totals.exp;

            // Calculate percentage of income spent
            if(data.totals.inc > 0){
                data.percentage = Math.round(data.totals.exp / data.totals.inc * 100);
            }else{
                data.percentage = -1;
            }
        },

        getBudget: function(){
            return{
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },

        calculatePercentages: function(){
            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function(){
            var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            });
            return allPerc;
        },

        // testing function 
        testing: function(){
            console.log(data);
        }
    };

})();

// UI controller
var UIController = (function(){
    
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription:'.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',  
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    var formatNumber =  function(num, type){
            var numSplit, int, dec, type;
            
            // two decimal points 
            num = Math.abs(num);
            num = num.toFixed(2);

            numSplit = num.split('.');
            int = numSplit[0];
            
            // comma for numders in 1000's
            if(int.length > 3){
                int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
            }

            dec = numSplit[1];

            // + or - before the number
            return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };

    var nodeListForEach = function(list, callback){
        for(var i = 0; i < list.length; i++){
            callback(list[i], i);
        }
    };

    return{

        getInput: function(){

            return{
                type: document.querySelector(DOMstrings.inputType).value, // will be ether inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };

        },

        addListItem: function(obj, type){

            var html, newHtml, element;

            // Create HTML string with placeholder text
            if(type === 'inc'){
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }else if(type === 'exp'){
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            
            // Replace placeholder with real data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            // Insert HTML into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        deleteListItem: function(selectorID){

            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        clearFields: function(){
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            // Loop arra of elements and clear
            fieldsArr.forEach(function(current, index, array) {
                current.value = '';  
            });

            fieldsArr[0].focus();
        },

        displayBudget: function(obj){

            var type;

            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');

            if(obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            }else{
                document.querySelector(DOMstrings.percentageLabel).textContent = '--';
            }
        },

        displayPercentages: function(percentages){
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

            nodeListForEach(fields, function(current, index){
                if(percentages[index] > 0){
                    current.textContent = percentages[index] + '%';
                }else{
                  current.textContent = '---';  
                }
            });
        },

        displayMonth: function(){

            var now, year, months, month;

            now = new Date();

            year = now.getFullYear();

            var months = ['January', 'Febuaray', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();

            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
        },

        changedType: function(){
            var fields = document.querySelectorAll(
                DOMstrings.inputType + ', ' + 
                DOMstrings.inputDescription + ', ' +  
                DOMstrings.inputValue);

            nodeListForEach(fields, function(cur){
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        },

        getDOMstrings: function(){
            return DOMstrings;
        }   
    }

})();

// Global app controller
var appController = (function(budgetCtrl, UICtrl){
    
    // Event listeners
    var setupEventListener = function(){
        
        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event){
            if(event.keyCode === 13 || event.which === 13){
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    };

    var updatePercentages = function(){

        // 1. calculat epercentages
        budgetCtrl.calculatePercentages();

        //2. Read percentag efrom budget controller
        var percentages = budgetCtrl.getPercentages();

        //3. Update UI with new percentages
        UICtrl.displayPercentages(percentages);

    };

    var updateBudget = function(){
        // 1. Calculate budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        var budget = budgetCtrl.getBudget();

        // 3. Display budget on UI
        UICtrl.displayBudget(budget);
    };

    // Add items
    var ctrlAddItem = function(){

        var input, newItem;

        // 1. get field input data
        input = UICtrl.getInput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0) {

            // 2. Add iyem to budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add item to UI
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear the fields
            UICtrl.clearFields();

            // 5. Calculate and update budget
            updateBudget();
            
            //6. Calculate and update percentage
            updatePercentages();

        }
    };

    var ctrlDeleteItem = function(event){

        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID){
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
        }

        budgetCtrl.deleteItem(type, ID);

        UICtrl.deleteListItem(itemID);

        updateBudget();

        updatePercentages();
    };

    return{
        init: function(){
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0
            });
            setupEventListener();
        }
    };
    
})(budgetController, UIController);

appController.init();