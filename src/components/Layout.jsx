import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {Redirect} from "react-router-dom";
import Logo from "../interface/Logo";
import _ from "lodash";
import CompanySelector from "../interface/CompanySelector";
import Avatar from "react-avatar";
import {endOfDay, format, startOfDay} from "date-fns";
import VerticalMenu from "../interface/Menu/VerticalMenu";
import { AiOutlineDashboard, AiOutlineLayout, AiOutlineUser, AiOutlineLogin,
    AiOutlineNodeCollapse, AiOutlineClockCircle } from 'react-icons/ai';
import {useDispatch, useSelector} from "react-redux";
import {fetch} from "../actions/generics";
import { ROLE_GROUPS } from "../permissions";
import UpdateTemporaryPassword from "./UpdateTemporaryPassword";
import {NavLink} from "react-router-dom";
import {useModal} from "react-modal-hook";
import GModal from "../interface/GModal"
import InOutWebcam from "./fragments/InOutWebcam";
import { useAuthContext } from '../context/auth';
import {Button, Icon} from "rsuite";
import LoadingPage from "./LoadingPage";
import {BASE_MEDIA_URL} from "../services/APIClient";
import {BiCog, BiQuestionMark, BsPeople, BsPersonSquare, MdLocationOn} from "react-icons/all";

const menu = [
    { text: 'Dashboard', path: '/', icon: <AiOutlineDashboard /> },
    {
        text: 'Activities',
        path: '/activities',
        perm: ROLE_GROUPS.WORKER,
        icon: <AiOutlineNodeCollapse />,
    },
    {
        text: 'Timesheets', path: '/timesheets', icon: <AiOutlineClockCircle />,
        perm: ROLE_GROUPS.WORKER
    },
    {
        text: 'Schedules',
        path: '/schedules',
        icon: <AiOutlineLayout />,
        perm: ROLE_GROUPS.WORKER,
    },
    {
        text: 'Performance Questions',
        path: '/questions',
        icon: <BiQuestionMark />,
        perm: ROLE_GROUPS.SUPERVISOR,
    },
    {
        text: 'Employees',
        path: '/employees',
        icon: <BsPeople />,
        perm: ROLE_GROUPS.SUPERVISOR,
    },
    {
        text: 'Locations',
        path: '/locations',
        icon: <MdLocationOn />,
        perm: ROLE_GROUPS.SUPERVISOR,
    }
    /*
    {
        text: 'Temporary Workforce',
        path: '/temps',
        perm: ROLE_GROUPS.SUPERVISOR,
        icon: <AiOutlineUsergroupAdd />,
        nodes: [
            { text: 'Candidate Pools', path: '/temps/candidate-pools', perm: ROLE_GROUPS.SUPERVISOR},
            { text: 'Current Assignments', path: '/temps/current-assignments', perm: ROLE_GROUPS.SUPERVISOR},
            { text: 'Active Jobs', path: '/temps/active-jobs', perm: ROLE_GROUPS.SUPERVISOR}
        ]
    },
    { text: 'Reports', path: '/reports', icon: <AiOutlineFund />, perm: ROLE_GROUPS.SUPERVISOR }
     */
];

const adminMenu = [
    //{text: 'Payments', path: '/settings/payments', perm: ROLE_GROUPS.ADMIN},
    //{text: 'Integrations', path: '/settings/integrations', perm: ROLE_GROUPS.ADMIN},
    {
        text: 'Members',
        path: '/settings/members',
        perm: ROLE_GROUPS.ADMIN,
        icon: <BsPeople />,
    },
    {
        text: 'Settings',
        path: '/settings',
        perm: ROLE_GROUPS.ADMIN,
        icon: <BiCog />,
    }
]

export default function ({ children }) {
    const isFetchingUser = useSelector((store) => store.user.isFetching);
    const user = useSelector((store) => store.user.data);
    const isFetchingProfile = useSelector((store) => store.profile.isFetching);
    const profile = useSelector((store) => store.profile.data);
    const isFetchingCompany = useSelector((store) => store.company.isFetching);
    const company = useSelector((store) => store.company.data);
    const departments = useSelector((store) => store.departments.data);

    const [rosters, setRosters] = useState([]);
    const [isFetchingRosters, setIsFetchingRosters] = useState(true);
    const auth = useAuthContext();
    const dispatch = useDispatch();
    const start = startOfDay(new Date());
    const end = endOfDay(start);

    const [ showClockInOutModal, hideClockInOutModal ] = useModal(() => {
        const formatDateTitle =  'ccc, dd MMM p';
        return (
            <GModal mStyle={{minWidth: '40vw'}} onClose={hideClockInOutModal} autoResize title="Time Tracker" help={format(new Date(), formatDateTitle)}>
                <InOutWebcam current_user={user} />
            </GModal>
        )
    });

    useEffect(() => {
        dispatch(fetch('user', '/get-user'));
        dispatch(fetch('profile', '/get-profile'));
        dispatch(fetch('company', '/get-company'));
        dispatch(fetch('departments', '/organization'));
        dispatch(fetch('clock-in-out-layout', '/active-shift', {}, (res) => {
            setIsFetchingRosters(false);
            setRosters(res);
        }));
        // showClockInOutModal();
    }, []);

    // if(!user || !user.tenant || !user.roles) return <LoadingPage loading={true}/>;
    if(!user || isFetchingCompany || isFetchingProfile) return <LoadingPage loading={true}/>;

    if(!company || !profile || !departments || !departments.length) return <Redirect to="/profile-setup" />;

    const name = [profile.first_name, profile.last_name].join(" ");
    if(user.is_password_temporary) return <UpdateTemporaryPassword user={user} />;

    const onClickLogout = () => {
        auth.onLogout();
    }
    return(
        <LayoutWrapper>
            <LayoutContents>
                <LayoutMenu>
                    <div style={{width: "20rem", display: 'flex', alignItems: 'center'}}>
                        <Logo />
                    </div>
                    <div style={{flexGrow: 1, cursor: 'pointer', fontSize: '1.25rem', display: 'flex',
                        color: '#555555', paddingRight: '1rem', justifyContent: 'flex-end'}}>
                        {
                            rosters && _.get(rosters, 'shift_clock_in_time', null) && !_.get(rosters, 'shift_clock_out_time', null) && (
                                <Button appearance="primary" size="sm" color="orange" onClick={showClockInOutModal}>
                                    <Icon icon="arrow-circle-left" /> Check-out
                                </Button>
                            )
                        }
                        {
                            rosters && !_.get(rosters, 'shift_clock_in_time', null) && !_.get(rosters, 'shift_clock_out_time', null) && (
                                <Button appearance="primary" size="sm" color="green" onClick={showClockInOutModal}>
                                    <Icon icon="arrow-circle-right" /> Check-in
                                </Button>
                            )
                        }
                        {
                            rosters && _.get(rosters, 'shift_clock_in_time', null) && _.get(rosters, 'shift_clock_out_time', null) && (
                                <Button appearance="ghost" size="sm" color="green" disabled={true} style={{ opacity: 1}}>
                                    <Icon icon="warning" /> No shift available
                                </Button>
                            )
                        }
                    </div>
                    <CompanySelector
                        name={company.company_name}
                        src={company.company_logo}
                    />
                    <Button size="sm" color="violet" style={{ marginRight: 10 }} onClick={onClickLogout}>
                        <Icon color="white" icon="sign-out" /> Logout
                    </Button>
                </LayoutMenu>
                <LayoutMain>
                    <LayoutSidebar>
                        <SidebarBlockMenuItem>
                            <Avatar name={name} src={profile.profile_pic} size={36} round />
                            <p>
                                <NavLink to={"/settings/profile"}>
                                    {name}
                                    <br /> <small>{user.email}</small>
                                </NavLink>
                            </p>
                        </SidebarBlockMenuItem>
                        <VerticalMenu menu={menu} perms={user.roles || ["ROLE_ADMIN"]}/>
                        {_.get(user, 'role.name', '') === "Admin" && (
                            <>
                                <SidebarMenuGroupTitle>Administration</SidebarMenuGroupTitle>
                                <VerticalMenu menu={adminMenu} perms={user.roles || ["ROLE_ADMIN"]} />
                            </>
                        )}
                    </LayoutSidebar>
                    <LayoutInnerContents>
                        <div style={{padding: "1rem"}}>
                            {children}
                        </div>
                        <div style={{fontSize: '0.8rem', width: "100%", background: "#ffffff", padding: "1rem"}}>
                            <p>Copyright © 2020 Gigsasa. All rights reserved.</p>
                        </div>
                    </LayoutInnerContents>
                </LayoutMain>
            </LayoutContents>
        </LayoutWrapper>
    )
}

const SidebarMenuGroupTitle = styled.p`
  text-transform: uppercase;
  font-size: 0.7rem;
  padding-left: 1rem;
  opacity: 0.5;
  text-shadow: 1px 0px #111;
  padding-top: 1.5rem;
  color: #ffffff;
`



const LayoutWrapper = styled.div`
  display: flex;
`
const LayoutSidebar = styled.div`
  min-height: 100vh;
  border-right: 1px solid #d5d6d5;
  width: 15vw;
  background: #203160;
`

const LayoutContents = styled.div`
  flex-grow: 1;
`

const LayoutInnerContents = styled.div`
  position: relative;
  flex-grow: 1;
  width: 75vw;
  display: flex;
  flex-direction: column;
`

const LayoutMenu = styled.div`
  width: 100%;
  display: flex;
  max-height: 4.5rem;
  min-height: 4.5rem;
  border-bottom: 1px solid #d5d6d5;
  z-index: 1;
  background: #ffffff;
  align-items: center;
  padding: 0.75rem 0;
`

const LayoutMain = styled.div`
  display: flex;
`

const SidebarBlockMenuItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 90%;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid #d5d6d5;
  padding: 1.5rem 1rem;
  background: #172447;

  > div {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
  }
  a {
    color: #ffffff;
  }

  p {
    margin: 0 1rem;
  }
  small {
    font-size: 0.8rem;
    color: #999;

  }
`
