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
            employees : []
        }
    }
    componentDidMount(){
        fetch("/employeelist")
        .then(res => res.json())
        .then(
            (result) => {
            this.setState({
                employees: result
            });
            },
            (error) => {
            this.setState({
                employees : [{
                    "name" : "An Error Occured While Fetching Chart"
                }]
            });
            }
        )
    }
    render(){
        return (<EmployeeList employees={this.state.employees} ceo="y"></EmployeeList>)
    }
}

export default Chart;