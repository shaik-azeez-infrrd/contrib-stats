import React, { FC } from 'react';
import styles from './DashboardStats.module.scss';
import { Row, Col, Card, Container } from 'react-bootstrap';
import AnimatedNumbers from "react-animated-numbers";

interface DashboardStatsProps {
    stats: {totalPulls: number,
            avgOpenToCloseInMins: number,
            avgComments: number,
            pullsWithNoChanges: number,
            highestCommentsOnPR: number}
}

const DashboardStats: FC<DashboardStatsProps> = React.memo(
    ({stats}: DashboardStatsProps) => {
        return (
            <Container>
            <Row>
                <Col lg={{span: 3, offset: 1}}>
                    <Card text={'light'} className={styles.statCard}>
                        <Card.Body>
                            <Card.Text>Pull-requests merged</Card.Text>
                            <h2>
                                <AnimatedNumbers animateToNumber={stats.totalPulls}></AnimatedNumbers>
                            </h2>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={{span: 4}}>
                    <Card text={'light'} className={styles.statCard}>
                        <Card.Body>
                            <Card.Text>Pull-requests with no changes requested</Card.Text>
                            <h2>
                                <AnimatedNumbers animateToNumber={stats.pullsWithNoChanges}></AnimatedNumbers>
                            </h2>
                        </Card.Body>
                    </Card>   
                </Col>
                <Col lg={{span: 3}}>
                    <Card text={'light'} className={styles.statCard}>
                        <Card.Body>
                            <Card.Text>Highest Comments on a PR</Card.Text>
                            <h2>
                                <AnimatedNumbers animateToNumber={stats.highestCommentsOnPR}></AnimatedNumbers>
                            </h2>
                        </Card.Body>
                    </Card>   
                </Col>
            </Row>
            <Row>
                <Col lg={{span: 5, offset: 1}}>
                    <Card text={'light'} className={styles.statCard}>
                        <Card.Body>
                            <Card.Text>Avg. comments per pull-request</Card.Text>
                            <h2>
                                <AnimatedNumbers animateToNumber={stats.avgComments}></AnimatedNumbers>
                            </h2>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={{span: 5}}>
                <Card text={'light'} className={styles.statCard}>
                        <Card.Body>
                            <Card.Text>Avg. time between PR creation and merge</Card.Text>
                            <h2 className='d-flex'>
                                <AnimatedNumbers includeComma animateToNumber={stats.avgOpenToCloseInMins}></AnimatedNumbers>
                                <span>&nbsp;hrs</span>
                            </h2>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            </Container>
        )
    }
)

export default DashboardStats;
