import React, { FC } from 'react';
import { Table, Row, Col, Container } from 'react-bootstrap';
import styles from './MetricsTable.module.scss';

interface MetricsTableProps {
    metrics: {w: number, a: number, d: number, c: number}[]
}

const MetricsTable: FC<MetricsTableProps> = React.memo(
    ({metrics}: MetricsTableProps) => {
        return (
            <Container className={styles.metricsSection}>
                <Row>
                    <Col lg={{span: 11,  offset: 1}}>
                        <h5>Weekly Contribution Break-down</h5>
                    </Col>

                    <Col className={styles.tableWrapper} lg={{span: 10,  offset: 1}}>
                        <Table  striped hover>
                            <thead>
                                <tr>
                                <th>Week #</th>
                                <th>Lines Added</th>
                                <th>Lines Removed</th>
                                <th>Commits</th>
                                </tr>
                            </thead>
                            <tbody>
                                { metrics.map((metricRow: any, index) => 
                                    <tr key={index}>
                                        <td>{new Date(metricRow.w*1000).toLocaleDateString()}</td>
                                        <td>{metricRow.a}</td>
                                        <td>{metricRow.d}</td>
                                        <td>{metricRow.c}</td>
                                    </tr>
                                )}                       
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        )
    }
)

export default MetricsTable;
