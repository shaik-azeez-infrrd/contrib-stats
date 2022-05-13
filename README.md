# Contributor Analyzer 
### generates metrics to dedudce contribution capacity, rate and quality 

### Stat Formulations (all considerations are for closed Pull-requests)

 - Pull requests merged: total closed PRs
 - Pull-requests with no changes requested: closed PRs with no review comments
 - Highest Comments on a PR: out all closed PRs, the one with highest review comments on it
 - Avg. comments per pull-request: (total review comments from the closed PRs / total closed PRs)
 - Avg. time between PR creation and merge: 
    - difference of each PRs closed_at - created_at
    - Sum of all differences / Total PRs

### Pre-requisites

 - Personal Access Token, of the user having read access to the repo
 - The App currently works only for a quarter (mentions the startDate on Top-right corner of the navbar)
 
### Usage

1. visit: https://shaik-azeez-infrrd.github.io/contrib-stats/
2. Enter PAT, repoOwner/repoName
3. click "get users" button
4. select contributor from the drop down
5. click "Analyze"
