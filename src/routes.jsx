import AssignmentsContainer from "./components/assignments/AssignmentsContainer";
import JobsContainer from "./components/jobs/JobsContainer";
import ClientsContainer from "./components/clients";
import CandidatesContainer from "./components/candidates/CandidatesContainer";
import JobContainer from "./components/jobs/JobContainer";
import DashboardContainer from "./components/dashboard/DashboardContainer";
import EmployeesContainer from "./components/employees/EmployeesContainer";
import TimesheetsContainer from "./components/timesheets/TimesheetsContainer";
import SchedulesContainer from "./components/schedules/SchedulesContainer";
import EmployeeContainer from "./components/employees/EmployeeContainer";
import WorkforceContainer from "./components/workforce/WorkforceContainer";
import ActivitiesContainer from "./components/activities/ActivitiesContainer";

import { ROLE_GROUPS } from "./permissions";
import LocationsContainer from "./components/workforce/LocationsContainer";
import PositionsContainer from "./components/workforce/PositionsContainer";
import MembersContainer from "./components/settings/MembersContainer";
import ProfileContainer from "./components/settings/ProfileContainer";
import QuestionsContainer from "./components/workforce/QuestionsContainer";

export default {
    dashboard: {
        name: 'Dashboard',
        path: '/',
        component: DashboardContainer,
        perms: ROLE_GROUPS.WORKER
    },
    timesheets: {
        name: 'Timesheets',
        path: '/timesheets',
        component: TimesheetsContainer,
        perms: ROLE_GROUPS.WORKER
    },
    workforce: {
        name: 'Workforce',
        path: '/workforce',
        component: WorkforceContainer,
        perms: ROLE_GROUPS.SUPERVISOR
    },
    schedules: {
        name: 'Schedules',
        path: ['/schedules', '/schedules/shifts/:id'],
        component: SchedulesContainer,
        perms: ROLE_GROUPS.WORKER,
        exact: false
    },
    assignments: {
        name: 'Assignments',
        path: '/assignments',
        component: AssignmentsContainer,
        perms: ROLE_GROUPS.WORKER,
    },
    jobs: {
        name: 'Jobs',
        path: '/jobs',
        component: JobsContainer,
        perms: ROLE_GROUPS.WORKER
    },
    job: {
        name: 'Job',
        path: '/jobs/:id',
        component: JobContainer,
        perms: ROLE_GROUPS.WORKER
    },
    clients: {
        name: 'Clients',
        path: '/clients',
        component: ClientsContainer,
        perms: ROLE_GROUPS.SUPERVISOR
    },
    candidates: {
        name: 'Candidates',
        path: '/candidates',
        component: CandidatesContainer,
        perms: ROLE_GROUPS.SUPERVISOR
    },
    activities: {
        name: 'Activities',
        path: '/activities',
        component: ActivitiesContainer,
        perms: ROLE_GROUPS.SUPERVISOR
    },
    locations: {
        name: 'Locations',
        path: '/locations',
        component: LocationsContainer,
        perms: ROLE_GROUPS.ADMIN
    },
    questions: {
        name: 'Performance Questions',
        path: '/questions',
        component: QuestionsContainer,
        perms: ROLE_GROUPS.SUPERVISOR
    },
    positions: {
        name: 'Positions',
        path: '/roles',
        component: PositionsContainer,
        perms: ROLE_GROUPS.ADMIN
    },
    employees: {
        name: 'Employees',
        path: '/employees',
        component: EmployeesContainer,
        perms: ROLE_GROUPS.SUPERVISOR
    },
    employee: {
        name: 'Employee',
        path: '/employees/:id',
        component: EmployeeContainer,
        perms: ROLE_GROUPS.SUPERVISOR
    },
    members: {
        name: 'Members',
        path: '/settings/members',
        component: MembersContainer,
        perms: ROLE_GROUPS.ADMIN
    },
    profile: {
        name: 'Profile',
        path: '/settings/profile',
        component: ProfileContainer,
        perms: ROLE_GROUPS.WORKER
    }
}
