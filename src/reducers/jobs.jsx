import {
    JOB_FETCHING, JOB_FETCHING_DONE, JOB_FETCHING_FAIL,
    JOBS_FETCHING, JOBS_FETCHING_DONE, JOBS_FETCHING_FAIL
} from "../actions/types";

const stateJobs = {
    jobs: [],
    isFetching: false,
    hasError: false,
    error: ""
};

export function jobs(state = stateJobs, action) {
    const {type} = action;
    switch (type) {
        case JOBS_FETCHING:
            break;
        case JOBS_FETCHING_DONE:
            break;
        case JOBS_FETCHING_FAIL:
            break;
        default:
            return state;
    }
}

const stateJob = {
    job: {},
    isFetching: false,
    hasError: false,
    error: ""
};

export function job(state = stateJob, action) {
    const {type} = action;
    switch (type) {
        case JOB_FETCHING:
            break;
        case JOB_FETCHING_DONE:
            break;
        case JOB_FETCHING_FAIL:
            break;
        default:
            return state;
    }
}