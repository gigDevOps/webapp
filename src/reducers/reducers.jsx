import {combineReducers} from "redux";

import genericReducer from "./generics.jsx";

/**
 * @description Reuse reducer logic to update state to avoid code duplication
 * @param {function} genericReducer
 * @param {string} reducerName
 */
function createNamedReducer(genericReducer, reducerName) {
    return (prevState = null, action) => {
        const isInitializing = prevState === null; // When app first loads
        const {stateName} = action;

        if (!isInitializing && stateName !== reducerName) return prevState;

        return genericReducer(prevState, action);
    };
}

const reducers = combineReducers({
    jobs: createNamedReducer(genericReducer, 'jobs'),
    job: createNamedReducer(genericReducer, 'job'),
    user: createNamedReducer(genericReducer, 'user'),
    profile: createNamedReducer(genericReducer, 'profile'),
    setup: createNamedReducer(genericReducer, 'setup'),
    assignments: createNamedReducer(genericReducer, 'assignments'),
    assignment: createNamedReducer(genericReducer, 'assignment'),
    companies: createNamedReducer(genericReducer, 'companies'),
    company: createNamedReducer(genericReducer, 'company'),
    candidates: createNamedReducer(genericReducer, 'candidates'),
    candidate: createNamedReducer(genericReducer, 'candidate'),
    rosters: createNamedReducer(genericReducer, 'rosters'),
    roster: createNamedReducer(genericReducer, 'roster'),
    rosters_stats: createNamedReducer(genericReducer, 'rosters_stats'),
    employees: createNamedReducer(genericReducer, 'employees'),
    employee: createNamedReducer(genericReducer, 'employee'),
    shift: createNamedReducer(genericReducer, 'shift'),
    shifts: createNamedReducer(genericReducer, 'shifts'),
    workforce_chart: createNamedReducer(genericReducer, 'workforce_chart'),
    timesheets: createNamedReducer(genericReducer, 'timesheets'),
    timesheet: createNamedReducer(genericReducer, 'timesheet'),
    locations: createNamedReducer(genericReducer, 'locations'),
    location: createNamedReducer(genericReducer, 'location'),
    question: createNamedReducer(genericReducer, 'question'),
    questions: createNamedReducer(genericReducer, 'questions'),
    organizations: createNamedReducer(genericReducer, 'organizations'),
    organization: createNamedReducer(genericReducer, 'organization'),
    position: createNamedReducer(genericReducer, 'position'),
    activities: createNamedReducer(genericReducer, 'activities'),
    roles: createNamedReducer(genericReducer, 'roles'),
    activity: createNamedReducer(genericReducer, 'activity'),
    timezones: createNamedReducer(genericReducer, 'timezones'),
    members: createNamedReducer(genericReducer, 'members'),
    member: createNamedReducer(genericReducer, 'member'),
    dashboard: createNamedReducer(genericReducer, 'dashboard'),
    whosonline: createNamedReducer(genericReducer, 'whosonline')
})

export default reducers;