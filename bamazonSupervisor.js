var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require("console.table");
var Table = require("cli-table");


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

function supervisorOptions() {
	console.log("welcome to the bamazon database - supervisor edition!");
	inquirer.prompt([
			{
				name: "question",
				message: "Would you like to... \n a) view product sales by department \n b) create a new department \n",
    				validate: function(value) {
          			if (value === "a" || value === "b") {
            			return true;
          			}
          				return false;
        		}				
			}

	]).then(function(res) {
		if (res.question === "a") {
			viewDeptSales();
		} else if (res.question === "b") {
			createDept();
		}		
	})
}

supervisorOptions();

function viewDeptSales() {
	console.log("product sales by department ");

 
// instantiate 
var table = new Table({
    head: ["department_id", "department_name", "over_head_costs", "product_sales", "total_profit"]
  , colWidths: [100, 200, 200, 200, 200]
});
 
// table is an Array, so you can `push`, `unshift`, `splice` and friends 
table.push(
    ['First value', 'Second value']
  , ['First value', 'Second value']
);
 
console.log(table.toString());



};





function createDept() {
	console.log("creating department...");
};







