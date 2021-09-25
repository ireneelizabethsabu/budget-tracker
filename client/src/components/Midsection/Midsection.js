import React from "react";
import { Card, CardGroup } from "react-bootstrap";
import { useBudget } from "../../hooks/budget";
import { useActivity } from "../../hooks/useActivity";
import "./Midsection.css";

const Midsection = () => {
  const budget = useBudget();
  const { calcExpense} = useActivity();
  const {expense,income} = calcExpense('','month');
 
  return (
    <CardGroup className="mt-4">
      
      <Card className="m-4 midcard text-center">
        <Card.Body>
          <div className="mb-4">TOTAL EXPENSES</div> Rs {expense}
        </Card.Body>
      </Card>
      <Card className="m-4 midcard text-center">
        <Card.Body>
          <div className="mb-4">EXTRA INCOME</div> Rs {income}
        </Card.Body>
      </Card>
      <Card className="m-4 midcard text-center">
        <Card.Body>
          <div className="mb-4">CURRENT BUDGET</div> Rs {budget.budget+income-expense}
        </Card.Body>
      </Card>
    </CardGroup>
  );
};

export default Midsection;