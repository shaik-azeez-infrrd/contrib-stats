import React, { FC, useState } from 'react';
import styles from './DashboardForm.module.scss';
import { Button, Form, Row, Col, Navbar, Card, Spinner, InputGroup } from 'react-bootstrap';
import { Octokit } from 'octokit';
import useUpdateEffect from '../../helpers/useUpdateEffect';

interface DashboardFormProps {
    contributors: string[]
    isLoading: boolean
    handleAuthTokenUpdate: Function
    handleFetchUsers: Function
    handleFormSubmit: Function
}

const DashboardForm: FC<DashboardFormProps> = (props) => {
    const isLoading = props.isLoading
    const contributors = props.contributors

    const [form, setFromValue] = useState({repo: '', authToken: '', contributorId: ''})
    const [allowSubmit, setAllowSubmit] = useState(false)

    useUpdateEffect(() => props.handleAuthTokenUpdate(form.authToken), [form.authToken])

    // on form input changes
    const handleInputChange = (event: any) => {
        const name = event.target.name
        const value = event.target.value
        
        setFromValue((prevState) => ({
            ...prevState,
            [name]: value,
        }))

        if(form.repo && form.authToken && form.contributorId)
            setAllowSubmit(true)
        else 
            setAllowSubmit(false)
    }

    const handleFetchUsers = (event: any) => {
        props.handleFetchUsers(event, form.repo)
    }

    const handleFormSubmit = (event: any) => {
        props.handleFormSubmit(event, form)
    }
    
    return (
        <Form onSubmit={handleFormSubmit}>
        <Row>             
            <Col lg={{span: 2,  offset: 1}}>
                <Form.Group>
                    <Form.Control
                        type="password"
                        name="authToken"
                        aria-describedby="Auth Token"
                        placeholder='Personal Access Token'
                        value={form.authToken}
                        onChange={handleInputChange}
                    />
                </Form.Group>
            </Col>
            <Col lg={{span: 2}}>
                <Form.Group>
                    <Form.Control
                        type="text"
                        name="repo"
                        aria-describedby="owner and repo"
                        placeholder='repo owner/name'
                        value={form.repo}
                        onChange={handleInputChange}
                    />
                </Form.Group>
            </Col>
            <Col lg={{span: 3}}>
                <Form.Group>
                    <InputGroup>
                        <Form.Select name='contributorId' aria-label="Contributor select" onChange={handleInputChange} value={form.contributorId}>
                            <option>Select Contributor</option>
                            { contributors.map((contributor: any) => <option value={contributor}>{contributor}</option>) }
                        </Form.Select>
                        <Button onClick={handleFetchUsers} variant="outline-secondary" id="button-addon2">
                        Get Users
                        </Button>
                    </InputGroup>
                </Form.Group>
            </Col>
            <Col lg={{span: 2}}>
                <Form.Group>
                    <Button type='submit' variant="outline-secondary" disabled={isLoading || !allowSubmit}>
                        { isLoading && <Spinner as="span" size="sm" animation="border" variant="secondary" />}
                        Analyze
                    </Button>
                </Form.Group>
            </Col>
        </Row>
    </Form>
    )
    
};

export default DashboardForm;
