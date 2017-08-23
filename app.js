// Budget controller
var budgetController = (function(){
    
    // Expense object 
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    // Income object
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
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
        }
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
        expensesContainer: '.expenses__list'
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
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }else if(type === 'exp'){
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            
            // Replace placeholder with real data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // Insert HTML into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

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

    };

    var updateBudget = function(){
        // 1. Calculate budget
        
        // 2. Return the budget

        // 3. Display budget on UI
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

        }
    };

    return{
        init: function(){
            setupEventListener();
        }
    };
    
})(budgetController, UIController);

appController.init();