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

var itemsForSale = function() {
	console.log("welcome to Bamazon!");
	readProducts();
}

function readProducts() {
  console.log("Selecting all products...\n");
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    for (var i = 0; i < res.length; i++) {
      console.log("  product id: " + res[i].item_id + "\n  product: " + res[i].product_name + "\n  department: " + 
        res[i].department_name + "\n  price per unit: " + res[i].price + "\n  current inventory: " + 
        res[i].stock_quantity + " unit(s)" + "\n----------------------------------------");
    }

    inquirer.prompt([
    	{
    		name: "question",
    		message: "Would you like to purchase a Bamazon produt? (y/n)",
    			validate: function(value) {
          		if (value === "y" || value === "n") {
            		return true;
          		}
          			return false;
        	}
    	}
    ]).then(function(questResponse) {
    	if (questResponse.question === "y") {
    		post();
    	} else if (questResponse.question === "n") {
    		console.log("Sorry we didn't have what you were looking for")
        connection.end();
    	}
    })
   
  });
}

itemsForSale();

// function Product(name, color, age) {
// 	this.item_id = item_id;
// 	this.product_name = product_name;
// 	this.department_name = department_name;
// 	this.price = price;
// 	this.stock_quantity = stock_quantity;
// };

function post() {
	inquirer.prompt([
	{
		name: "item_id",
		message: "what is the numerical id of the item you'd like to purchase?",
		  validate: function(value) {
          if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= 20) {
            return true;
          }
          return false;
      	}
	}, {
		name: "desired_quantity",
		message: "how many units would you like to purchase?",
		  validate: function(value) {
          if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= 100) {
            return true;
          }
          return false;
        }
	}

	]).then(function(postResponse) {

		var custId = parseInt(postResponse.item_id);

		var query = connection.query(
    	"SELECT * FROM products WHERE ?", {item_id: custId},
    	function (err, ans, fields) {
    		var origQuant = parseInt(ans[0].stock_quantity);
    		var desiredQuant = parseInt(postResponse.desired_quantity);
    		var cost = parseInt(ans[0].price);
      		console.log("original quantity: " + origQuant);

      		if (postResponse.desired_quantity > ans[0].stock_quantity) {
      			console.log("insufficient quantity!")
            connection.end();
      		} else {
      			var newQuant = (origQuant - desiredQuant);
      			var totalCost = (desiredQuant * cost);

      				console.log("updating quantity..." + newQuant);
      				updateQuant();
      				function updateQuant() {

 						var query = connection.query(
    					"UPDATE products SET ? WHERE ?",
    					[
      						{
        						stock_quantity: newQuant,
                    product_sales: totalCost                    
      						},
      						{
        						item_id: custId
      						}
    					],

    				function (err, res) {
      				// console.log(res.affectedRows + " products updated!\n");
      			console.log("your total cost will be $" + totalCost);
   			    });

      		}
      	}
      		connection.end();
    	}
  	);
  // logs the actual query being run
  console.log(query.sql);
})

}


