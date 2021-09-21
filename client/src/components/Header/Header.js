import axios from "axios";
import React, { useState } from "react";
import { Button, Form, Col, InputGroup,FormControl, Container } from "react-bootstrap";
import { useUser } from "../hooks/useUser";
import { useActivity } from "../hooks/useActivity";
import { CATEGORIES } from "../util";

const Header = () => {
    const {user} = useUser()
    const [expense, setExpense] = useState({
        topic: '',
        amount: 0,
        status: '-',
        category: ''
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(user)
        axios.post('/api/addactivity',{
            user,expense
        }).then(setExpense({
            topic: '',
            amount: 0,
            status: '-',
            category: ''
        })).catch(err => console.log(err))
    }

    const handleChange = (e) => {
        e.preventDefault();
        setExpense({
            ...expense,
            [e.target.name] : e.target.value
        })  
    }

    return ( 
        <Container >
            <h1 className="d-flex justify-content-between">
                <span>Section Name</span>
                <span>
                    plus
                </span>
            </h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Control placeholder="topic" name="topic" value={expense.topic} onChange={handleChange}/>
                </Form.Group>
                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <Button variant={expense.status === '-' ? 'success' : 'secondary'} name="status" value="-" onClick={handleChange}>-</Button>
                    </InputGroup.Prepend>
                    <FormControl
                        placeholder="Amount"
                        aria-label="Expense"
                        name="amount"
                        value={expense.amount}
                        onChange={handleChange} required/>
                    <InputGroup.Append>
                    <Button variant={expense.status === '+' ? 'success' : 'secondary'} name="status" value="+" onClick={handleChange}>+</Button>
                    </InputGroup.Append>
                </InputGroup>
                <Form.Group controlId="Category">
                    <Form.Control as="select" name="category" onChange={handleChange} required>
                        {CATEGORIES.map(category => <option key={category}>{category}</option>)}
                    </Form.Control>
                </Form.Group>
                <Col className="my-3">
                    <Button type="submit" block>Add</Button>
                </Col>
            </Form>
            
        </Container>
    )
}

export default Header;