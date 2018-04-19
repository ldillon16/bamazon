var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock",

  // username
  user: "root",

  // password
  password: "root",
  database: "bamazon"

});

function managerOptions() {
	console.log("welcome to the bamazon database!");
	inquirer.prompt([
			{
				name: "question",
				message: "Would you like to... \n a) view products for sale \n b) view low inventory \n c) add to iventory \n d) add new product \n",
    				validate: function(value) {
          			if (value === "a" || value === "b" || value === "c" || value === "d") {
            			return true;
          			}
          				return false;
        		}				
			}

	]).then(function(res) {
		if (res.question === "a") {
			viewProducts();
		} else if (res.question === "b") {
			viewLowInv();
		} else if (res.question === "c") {
			addInv();
		} else if (res.question === "d") {
			addProduct();
		}		
	})
}

managerOptions();

function viewProducts() {
  console.log("Selecting all products...\n");
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.log(res);
    connection.end();
   
  });
}

function viewLowInv() {
	console.log("Low inventory:");

	var query = "SELECT * FROM products HAVING stock_quantity < 3";
    connection.query(query, function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
    	console.log("  product: " + res[i].product_name + "\n  current inventory: " + res[i].stock_quantity + " unit(s)");
    }   	
    })

    connection.end();
   
  };


function addInv() {
	console.log("Add to inventory");
	inquirer.prompt([
		{
		name: "item_id",
		message: "what is the item id of the product you'd like to restock?",
			validate: function(value) {
            	if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= 10) {
            		return true;
          		}
          			return false;
      		}
      	} , {
      	name: "amount",
      	message: "how many units would you like to add to the inventory?",
			validate: function(value) {
            	if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= 100) {
            		return true;
          		}
          			return false;
      		}
      	}
		

	]).then(function(response) {
		var product_id = parseInt(response.item_id);
		var query = connection.query(
    	"SELECT * FROM products WHERE ?", {item_id: product_id},
    	function (err, ans, fields) {
    		var productName = ans[0].product_name;
    		var origQuant = parseInt(ans[0].stock_quantity);
    		var amountToAdd = parseInt(response.amount);
    		var newQuant = (origQuant + amountToAdd);

    		console.log("The updated inventory for the " + productName + " is: " + newQuant);

      				updateQuant();
      				function updateQuant() {

 						var query = connection.query(
    					"UPDATE products SET ? WHERE ?",
    					[
      						{
        						stock_quantity: newQuant
      						},
      						{
        						item_id: product_id
      						}
    					],
    				function (err, res) {
      				console.log(res.affectedRows + " product updated!\n");
   			    });
      		}      	
      		connection.end();
    	}
  	);
  // logs the actual query being run
  console.log(query.sql);
})
}

function Item(product_name, department_name, price, stock_quantity) {
	this.product_name = product_name;
	this.department_name = department_name;
	this.price = price;
	this.stock_quantity = stock_quantity;
}

function addProduct() {
	inquirer.prompt([
	{
		name: "product_name",
		message: "what product would you like to add?"
	}, {
		name: "department_name",
		message: "what department does the product belong to"
	}, {
		name: "price",
		message: "what is the price per unit?",
		  validate: function(value) {
          if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= 100) {
            return true;
          }
          return false;
          }
	}, {
		name: "stock_quantity",
		message: "How many units would you like to stock?",
		  validate: function(value) {
          if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= 100) {
            return true;
          }
          return false;
           }
    }

	]).then(function(response) {
		console.log(response);
		var item = new Item(response.product_name, response.department_name, parseInt(response.price), parseInt(response.stock_quantity));
		console.log("copy: " + JSON.stringify(item));

  		console.log("Inserting a new item...\n");
  		var query = connection.query(
    	"INSERT INTO products SET ?",
    		{
      			product_name: item.product_name,
      			department_name: item.department_name,
      			price: item.price,
      			stock_quantity: item.stock_quantity
    		},
    	
    	function (err, res) {
      		console.log(res.affectedRows + " product inserted!");
      		console.log("----------------------------------------\n  product: " + item.product_name + "\n  department: " + 
        item.department_name + "\n  price per unit: " + item.price + "\n  current inventory: " + 
        item.stock_quantity + " unit(s)" + "\n----------------------------------------");
       		connection.end();
    	}
  	);

  // logs the actual query being run
  console.log(query.sql);
})

}









