import React, { FC, useState, useEffect } from 'react';
import styles from './Dashboard.module.scss';
import { GetResponseDataTypeFromEndpointMethod } from '@octokit/types';
import { Octokit } from 'octokit';
import { Container, ListGroup } from 'react-bootstrap';

interface DashboardProps {}
const octokit = new Octokit({ auth: `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` });


// helper methods
const isNotOlderThan = (startEpoch: any, dateString: any): boolean => {
    const entryEpoch = Date.parse(dateString)

    return (entryEpoch >= startEpoch) || false
}

const isNotFromAuthor = (comment: any) => {
    return comment.user && comment.user.login !== "gopalanaika"
}

const updateAvgComments = (pullsCount: number, commentsCount: number, setStats: Function) => {
    const avgCommentsPerPR = Math.round(commentsCount / pullsCount)
    setStats((prevState: any) => ({
        ...prevState,
        avgComments: avgCommentsPerPR
    }))   
}

const updateAvgOpenToCloseTime = (pulls: any, setStats: Function) => {
    let pullsOpenToCloseTime: number[] = []
    pulls.forEach((pull: any) => {
        let createdTimeStamp = Date.parse(pull.created_at)
        let closedTimeStamp = Date.parse(pull.closed_at)
        let timeToClosureInMins = (closedTimeStamp - createdTimeStamp) / 60000
        pullsOpenToCloseTime.push(timeToClosureInMins)
    })
    
    if(pullsOpenToCloseTime.length > 0) {
        let sumOfAllTimesInMins = pullsOpenToCloseTime.reduce((sum: number, x: number) => sum + x)
        let avgTimeInMins = Math.round((sumOfAllTimesInMins) / pullsOpenToCloseTime.length)
        setStats((prevState: any) => ({
            ...prevState,
            avgOpenToCloseInMins: avgTimeInMins})
        )
    }
}
// helper methods

const Dashboard: FC<DashboardProps> = () => {
    let repo = 'infer-ai/idc-portal-ui'
    let startEpoch = Date.parse('01/01/22')
    let contributorId: string = "gopalanaika"
    const [pulls, setPulls] = useState<{}[]>([])
    const [reviewComments, setComments] = useState<{}[]>([])
    const [stats, setStats] = useState({totalPulls: 0, avgOpenToCloseInMins: 0, avgComments: 0})

    // on-init
    useEffect(() => getPulls(), [])

    // on-pulls change
    useEffect(() => getReviewComments(pulls), [pulls])

    // on-comments change
    useEffect(() => computeStats(), [reviewComments])
    
    const getPulls = () => {
        let filteredPulls: {}[] = []
        let q = 'q=' + encodeURIComponent(`is:pr is:closed repo:${repo} author:${contributorId}`)
        
        octokit.request(`GET /search/issues?${q}&per_page=100`).then(response => {
            filteredPulls = response.data && response.data.items
            filteredPulls = filteredPulls.filter((pull: any) => isNotOlderThan(startEpoch, pull.created_at))
            setPulls(filteredPulls)
        })
    }

    const getReviewComments = (pulls: any) => {
        let $reviewCommentsRequests: any = []
        let reviewComments: any[][] | any[] = []
    
        pulls.forEach((pull: any) => 
            $reviewCommentsRequests.push(
                octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}/comments', 
                {
                    owner: 'infer-ai',
                    repo: 'idc-portal-ui',
                    pull_number: pull.number
                }).then(response => {
                    if(response.data && response.data.length > 0) {
                        reviewComments.push(response.data.filter(comment => isNotFromAuthor(comment)))
                    }
                })
            )
        )
    
        Promise.all($reviewCommentsRequests).then(() => setComments(reviewComments))
    }

    const computeStats = () => {
        setStats((prevState) => ({
            ...prevState,
            totalPulls: pulls.length
        }))
        updateAvgComments(pulls.length, reviewComments.flat().length, setStats)
        updateAvgOpenToCloseTime(pulls, setStats)
    }
    
    return (
        <Container className={styles.Dashboard} data-testid="Dashboard">
            <ListGroup variant="flush">
                <ListGroup.Item>Total Pulls: {stats.totalPulls}</ListGroup.Item>
                <ListGroup.Item>Avg. Comments Per Pull: {stats.avgComments}</ListGroup.Item>
                <ListGroup.Item>Avg. time between Pull creation and merge: {stats.avgOpenToCloseInMins}</ListGroup.Item>
            </ListGroup>
        </Container>
    );
}

export default Dashboard;
