import React, { FC, useState } from 'react';
import styles from './Dashboard.module.scss';
import { Octokit } from 'octokit';
import { Container, Navbar } from 'react-bootstrap';

import useUpdateEffect from '../../helpers/useUpdateEffect';
import DashboardForm from '../DashboardForm/DashboardForm';
import DashboardStats from '../DashboardStats/DashboardStats';

interface DashboardProps {}

//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

// helper methods
const isNotOlderThan = (startEpoch: any, dateString: any): boolean => {
    const entryEpoch = Date.parse(dateString)

    return (entryEpoch >= startEpoch) || false
}

const isNotFromAuthor = (comment: any) => {
    return comment.user && comment.user.login !== "gopalanaika"
}

const calculateAvgComments = (pullsCount: number, commentsCount: number): number => {
    return Math.round(commentsCount / pullsCount)
}

const calculateAvgOpenToCloseTime = (pulls: any): number => {
    let pullsOpenToCloseTime: number[] = []
    let sumOfAllTimesInMins = 0
    pulls.forEach((pull: any) => {
        let createdTimeStamp = Date.parse(pull.created_at)
        let closedTimeStamp = Date.parse(pull.closed_at)
        let timeToClosureInMins = (closedTimeStamp - createdTimeStamp) / 60000
        pullsOpenToCloseTime.push(timeToClosureInMins)
    })
    
    if(pullsOpenToCloseTime.length > 0) {
        sumOfAllTimesInMins = pullsOpenToCloseTime.reduce((sum: number, x: number) => sum + x)        
    }

    return Math.round((sumOfAllTimesInMins) / pullsOpenToCloseTime.length)
}

const getReviewComments = (
    octokit: Octokit,
    pulls: any,
    setIsLoading: Function,
    setStateCallback: Function) => {

    let $reviewCommentsRequests: any = []
    let reviewComments: any[][] | any[] = []

    pulls.forEach((pull: any) => 
        $reviewCommentsRequests.push(
            octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}/comments', 
            {
                owner: 'infer-ai',
                repo: 'idc-portal-ui',
                pull_number: pull.number
            }).then((response: any) => {
                if(response.data && response.data.length > 0) {
                    reviewComments.push(response.data.filter((comment: any) => isNotFromAuthor(comment)))
                }
            })
        )
    )

    Promise.all($reviewCommentsRequests).then(() => setStateCallback(reviewComments)).finally(() => setIsLoading(false))
}

const getContributors = (
    octokit: Octokit,
    repoName: string,
    setIsLoading: Function,
    setStateCallback: Function): void => {

    octokit.request('GET /repos/{owner}/{repo}/collaborators?per_page=100', {
        owner: repoName.split('/')[0],
        repo: repoName.split('/')[1]
    })
    .then((response: any) => {
        let contributors = response.data
        contributors = contributors.map((collaborator: any) => collaborator.login)
        setStateCallback(contributors)
    }).finally(() => setIsLoading(false))
}

const getPulls = (
    octokit: Octokit,
    startEpoch: number,
    form: any,
    setStateCallback: Function) => {

    let filteredPulls: {}[] = []
    let q = 'q=' + encodeURIComponent(`is:pr is:closed repo:${form.repo} author:${form.contributorId}`)
    
    octokit.request(`GET /search/issues?${q}&per_page=100`).then((response: any) => {
        filteredPulls = response.data && response.data.items
        filteredPulls = filteredPulls.filter((pull: any) => isNotOlderThan(startEpoch, pull.created_at))
        setStateCallback(filteredPulls)
    })
}

const computeStats = (pulls: any[], reviewComments: any[], setStateCallback: Function): void => {
    const avgComments = calculateAvgComments(pulls.length, reviewComments.flat().length)
    const avgOpenToCloseInMins = calculateAvgOpenToCloseTime(pulls)
    setStateCallback({ totalPulls: pulls.length, avgComments, avgOpenToCloseInMins })
}

let octokit = new Octokit()

// Component
const Dashboard: FC<DashboardProps> = React.memo(
    () => {
        // let repo = 'infer-ai/idc-portal-ui'
        let startEpoch = Date.parse('01/01/22')
        
        const [contributors, setContributors] = useState<string[]>([])
        const [isLoading, setIsLoading] = useState(false)
        const [pulls, setPulls] = useState<{}[]>([])
        
        const [reviewComments, setComments] = useState<{}[]>([])
        const [stats, setStats] = useState({totalPulls: 0, avgOpenToCloseInMins: 0, avgComments: 0})
                
        // on pull requests fetch complete
        useUpdateEffect(() => getReviewComments(octokit, pulls, setIsLoading, setComments), [pulls])
        // on comments fetch complete
        useUpdateEffect(() => computeStats(pulls, reviewComments, setStats), [reviewComments])

        const handleFetchUsers = (event: any, repoName: string) => {
            getContributors(octokit, repoName, setIsLoading, setContributors)
        }

        const handleAuthTokenUpdate = (authToken: string) => {
            octokit = new Octokit({auth: authToken})
        }
        
        // on form submit
        const handleFormSubmit = (event: any, formData: any) => {
            event.preventDefault()
            setIsLoading(true)
            getPulls(octokit, startEpoch, formData, setPulls)
        }
        
        return (
            <>
                <Navbar bg="dark" variant="dark">
                        <Container>
                            <Navbar.Brand href="#home">Contributor Stats</Navbar.Brand>
                        </Container>
                </Navbar>
                <Container className={styles.Dashboard} data-testid="Dashboard" fluid>
                    <DashboardForm
                        handleAuthTokenUpdate={handleAuthTokenUpdate}
                        contributors={contributors}
                        handleFetchUsers={handleFetchUsers}
                        isLoading={isLoading}
                        handleFormSubmit={handleFormSubmit} >
                    </DashboardForm>
                    <DashboardStats stats={stats}></DashboardStats>
                    
                </Container>
            </>
        );
    }
)

export default Dashboard;
