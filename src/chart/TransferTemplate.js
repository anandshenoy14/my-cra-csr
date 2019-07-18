import React from 'react';
import Button from '@material-ui/core/Button';
class TransferTemplate extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            "original" : {
                employees : []
            },
            "current" : {
                employees : []
            }
        }
    }
    getEmployees(){
        fetch("/employeelist")
        .then(res => res.json())
        .then(
            (result) => {
            let original = this.state.original.employees.slice();
            let current = this.state.current.employees.slice();
            original = result;
            current = result;
            this.setState({
                original : {
                    employees : original
                },
                current : {
                    employees : current
                }
            });
            },
            (error) => {
            this.setState({
               "current" : {
                employees : [{
                    "name" : "An Error Occured While Fetching Chart"
                }]
               }
            });
            }
        )
    }
    getAllManagersBySections = (employees,managers) =>{
        employees.forEach(employee=>{
            if(employee.employees && employee.employees.length > 0){
                managers.push(employee)
                this.getAllManagersBySections(employee.employees,managers);
            }
        })
        return managers;
    }
    makePutRequest(data){
        let employees = {
            "employees" : data
        }
        fetch("/employeelist/1", {
            method: 'PUT', // 'GET', 'PUT', 'DELETE', etc.
            body: JSON.stringify(employees), // Coordinate the body type with 'Content-Type'
            headers: new Headers({
              'Content-Type': 'application/json'
            }),
          })
          .then(response => response.json())
          .then((response)=>{
                let result = document.getElementById("result");
                result.innerHTML = "The Transfer was a Success";
          },
          (error)=>{
                let result = document.getElementById("result");
                result.innerHTML = error.toString();
          })
    }
    traverseAndUpdateEmployee= (employeelist,newManager,oldManager) => {
        employeelist.forEach((employee)=>{
            if(employee.name == newManager.name){
                if(employee.employees){
                    employee.employees = newManager.employees
                }
            }
            if(employee.name == oldManager.name){
                if(employee.employees){
                    employee.employees = oldManager.employees
                }
            }
        })
        return employeelist;
    }
    makeTransfer = () =>{
        let employeeName = document.getElementById("employeeName").value;
        let toSection = document.getElementById("toSection").value;
        let allEmployees = this.state.original.employees.slice();
        //console.log('Employees  === '+JSON.stringify(allEmployees));
        let allManagers = this.getAllManagersBySections(allEmployees,[]);
        let newManager = null,oldManager = null;
        //console.log('Managers === '+JSON.stringify(allManagers));
        allManagers  = allManagers.map((manager)=>{
            if(manager.section === toSection){
                manager["employees"].push({
                    "name" : employeeName,
                    "section" : toSection
                })
                newManager = manager;
            }
            if(manager.employees.filter(employee => employee.name === employeeName).length > 0){
                if(!newManager || (newManager.name != manager.name)){
                    manager["employees"] = manager.employees.filter(employee => employee.name !== employeeName)
                    oldManager = manager;
                }
            }
        })
        // console.log(' old manager === > '+JSON.stringify(oldManager));
        // console.log(' new maanger == >  '+JSON.stringify(newManager));
        let updatedemployees = this.traverseAndUpdateEmployee(allEmployees,newManager,oldManager);
        this.setState({
            "current" : {
                "employees" : updatedemployees
            },
            "original" : {
                "employees" : updatedemployees
            }
        })
        this.makePutRequest(updatedemployees);
    }
    componentDidMount(){
        this.getEmployees()
    }
    materialUIBtnClick = (e) =>{
        console.log('you clicked the material UI button')
    }
    render(){
        return (<div className="transfer-template">
            <h1>Make Transfer</h1>
            <br/>
            <label>Employee Name : </label><input type="text" placeholder="enter name" id="employeeName"></input>
            <label>To Section : </label><input type="text" placeholder="enter name" id="toSection"></input>
            <button onClick={this.makeTransfer.bind(this)}>Make Transfer</button>
            <span id="result"></span>
            <Button variant="contained" color="primary" onClick={this.materialUIBtnClick.bind(this)}>
                Click Me
            </Button>
        </div>
        )
    }
}

export default TransferTemplate;