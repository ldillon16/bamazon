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





 
// instantiate 





function viewDeptSales() {
  console.log("product sales by department ");
  var query = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(products.product_sales) AS total_sales, (SUM(products.product_sales) - departments.over_head_costs) AS total_profit FROM departments INNER JOIN products ON departments.department_name=products.department_name GROUP BY department_name ORDER BY department_id ASC";

  console.log("Selecting all products...\n");
  connection.query(query, function (err, res) {
    if (err) throw err;

var table = new Table({
     head: ["department_id", "department_name", "over_head_costs", "total_sales", "total_profit"]     
 });
 
 res.forEach(function(item) {
  table.push(
      [item.department_id, item.department_name, item.over_head_costs, item.total_sales, item.total_profit]
    )
 });
// // table is an Array, so you can `push`, `unshift`, `splice` and friends 
 
 
 console.log(table.toString());
  connection.end();
  });
}


function createDept() {
	console.log("creating department...");
};







