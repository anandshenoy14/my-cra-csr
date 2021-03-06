import React from 'react'
import '../chart/Chart.css'

function EmployeeList(props) {
    const employees = props.employees;
    const listItems = employees.map((employee) =>
        <Employee employee={employee}></Employee>
    );
    return (
        <ul className={employees.length > 0 && props.ceo === undefined ? 'hide' : ''}>{listItems}</ul>
    );
}

function Employee(props) {
    const employee = props.employee;
    const expandCollapse = function (e) {
        var el = (e.target);
        var childList = el && el.nextElementSibling;
        el.innerHTML === "+" ? el.innerHTML = "-" : el.innerHTML = "+"
        childList.classList.toggle("hide");
    }
    const hasSubEmployees = employee.employees && employee.employees.length > 0
    return (
        <li>
            {hasSubEmployees && <button onClick={expandCollapse}>+</button>}
            {employee.name}
            {hasSubEmployees && <EmployeeList employees={employee.employees}></EmployeeList>}
        </li>
    )
}
class Chart extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            original : {
                employees : []
            },
            current : {
                employees : []
            }
        }
    }
    componentDidMount(){
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
    findQuery(employees,name, result){
        employees.forEach((employee)=>{
            if(employee.employees && employee.employees.length > 0){
                if(employee.name.indexOf(name) > -1){
                    result.push(employee)
                }
                result = this.findQuery(employee.employees,name,result)
            }else{
                if(employee.name.indexOf(name) > -1){
                    result.push(employee)
                }
            }
        })
        return result;
    }
    /**
     *
     *
     * @param {*} employee
     * @memberof Chart
     */
    searchAndUpdate(e){
        let inputSearchTerm = (e.target) && (e.target.value);
        let employees = this.state.original.employees;
        let foundEmployeesWithName = this.findQuery(employees,inputSearchTerm,[]);
        if(inputSearchTerm != ""){
            this.setState({
                "current" : {
                    "employees" : foundEmployeesWithName
                }
            })
        }else{
            this.setState({
                "current" : {
                    "employees" : employees
                }
            })
        }
    }
    render(){
        return (
            <div>
                <input type="text" placeholder="Enter name" onChange={this.searchAndUpdate.bind(this)} value={this.props.children}></input>
                <div><EmployeeList employees={this.state.current.employees} ceo="y"></EmployeeList></div>
            </div>
        )
    }
}

export default Chart;