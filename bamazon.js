const mysql = require ('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',
    port:3306,
    user: 'root',
    password: 'Empakcon1104',
    database: 'bamazon'
});

function loadProduct(){
    connection.query("SELECT * FROM products", function(err, res){
        console.table(res);
    })
}

connection.connect(function(err){
    if (err) throw err;
    console.log("Hello")
    loadProduct();
})

function chceckInventory(){
    for(let index = 0; index < inventory.length; index++){
        if(inventory[index].item_id === itemID){
            return inventory[index];
        }
    }
    return null
}

function makePurchase(products, quantity){
    connection.query("UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?", [quantity, product.item_id], function(err, res) {
        if(err) throw err;
        console.log("Successful purchased" + quantity +"," + product.product_name);
    })    
}

function promptCustomerForQuantity(product){
    inquirer.prompt([{
        type: "input",
        name: "quantity",
        message: "How many animals do you want[Quit with Q]",
        validate: function(val){
            return val > 0 || val.toLowerCase() === 'q'
        } 
    }]).then(function(val) {
        checkIFExit(val.quantity);
        let quantity = parseInt(val.quantity);

        if(quantity > product.stock_quantity){
            console.log("Insufficient quantity");
            loadProduct();
        } else {
            makePurchase(product, quantity)
        }


    })    
}

function promptCustomer(inventory){
    inquirer.prompt([
        {
            type: "input",
            name: "choice",
            message: "What is the ID of the item you are looking for?",
            validate: function(val){
                return !isNaN(val) || val.toLowerCase () ===  'q'
            }
        }
    ]).then(function(val){
        checkIFExit(val.choice);
        let itemID = parseInt(val.choice);
        let product = chceckInventory(itemID, inventory)
        console.log(product)
        if(product){
            promptCustomerForQuantity(product);
        } else {
            console.log("\nThat item is not in the inventory");
            loadProduct();
        }
    });
}

function loadProduct(){
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err;
        console.table(res);
        promptCustomer(res)
    } )    
}

connection.connect(function(err){
    if(err) throw err;
    loadProduct();
})