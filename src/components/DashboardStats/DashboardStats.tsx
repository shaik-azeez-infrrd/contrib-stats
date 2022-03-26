import React, { FC } from 'react';
import styles from './DashboardStats.module.scss';
import { Row, Col, Card } from 'react-bootstrap';
import AnimatedNumbers from "react-animated-numbers";

interface DashboardStatsProps {
    stats: {totalPulls: number, avgOpenToCloseInMins: number, avgComments: number}
}

const DashboardStats: FC<DashboardStatsProps> = React.memo(
    ({stats}: DashboardStatsProps) => {
        return (
            <Row>
                <Col lg={{span: 3, offset: 1}}>
                    <Card bg={'secondary'} text={'light'} className={styles.statCard}>
                        <Card.Body>
                            <Card.Text><b>Pull-requests merged</b></Card.Text>
                            <Card.Title>
                                <AnimatedNumbers animateToNumber={stats.totalPulls}></AnimatedNumbers>
                            </Card.Title>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={{span: 3}}>
                    <Card bg={'secondary'} text={'light'} className={styles.statCard}>
                        <Card.Body>
                            <Card.Text><b>Avg. comments per pull-request</b></Card.Text>
                            <Card.Title>
                                <AnimatedNumbers animateToNumber={stats.avgComments}></AnimatedNumbers>
                            </Card.Title>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={{span: 4}}>
                    <Card bg={'secondary'} text={'light'} className={styles.statCard}>
                        <Card.Body>
                            <Card.Text><b>Avg. time between PR creation and merge</b></Card.Text>
                            <Card.Title className='d-flex'>
                                <AnimatedNumbers includeComma animateToNumber={stats.avgOpenToCloseInMins}></AnimatedNumbers>
                                <span>&nbsp;mins</span>
                            </Card.Title>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        )
    }
)

export default DashboardStats;
