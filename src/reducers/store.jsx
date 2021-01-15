import {applyMiddleware, createStore} from "redux";
import thunk from 'redux-thunk';

import reducers from "./reducers";

const middlewares = [thunk];
const middlewareEnhancer = applyMiddleware(...middlewares);
// const composedEnhancers = composeWithDevTools(middlewareEnhancer);

/**
 * Prepopulate
 */

const GENERIC_STATE = {
    isFetching: false,
    data: [],
    fetchError: false,
    form: { isPosting: false, postError: false },
};

const INIT_STATE = {
    assignments: GENERIC_STATE,
    assignment: GENERIC_STATE,
    jobs: GENERIC_STATE,
    job: GENERIC_STATE,
    companies: GENERIC_STATE,
    company: GENERIC_STATE,
    profile: GENERIC_STATE,
    candidates: GENERIC_STATE,
    candidate: GENERIC_STATE,
    rosters: GENERIC_STATE,
    roster: GENERIC_STATE,
    rosters_stats: GENERIC_STATE,
    employees: GENERIC_STATE,
    employee: GENERIC_STATE,
    shift: GENERIC_STATE,
    shifts: GENERIC_STATE,
    workforce_chart: GENERIC_STATE,
    timesheets: GENERIC_STATE,
    timesheet: GENERIC_STATE,
    user: GENERIC_STATE,
    setup: GENERIC_STATE,
    locations: GENERIC_STATE,
    location: GENERIC_STATE,
    questions: GENERIC_STATE,
    question: GENERIC_STATE,
    organizations: GENERIC_STATE,
    organization: GENERIC_STATE,
    position: GENERIC_STATE,
    activities: GENERIC_STATE,
    activity: GENERIC_STATE,
    timezones: GENERIC_STATE,
    members: GENERIC_STATE,
    member: GENERIC_STATE,
    dashboard: GENERIC_STATE,
    roles: GENERIC_STATE,
    role: GENERIC_STATE,
    whosonline: GENERIC_STATE
}

export default createStore(
    reducers,
    INIT_STATE,
    middlewareEnhancer
)