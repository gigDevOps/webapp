export const view = {
    beginning: new Date('07-05-2020'),
    termination: new Date('07-12-2020')
};

export const schedules = [
    {
        employee: {
            name: 'Edoardo Biraghi',
            id: '1',
        },
        assignments: [
            {},
            {
                id: '1000',
                beginning: new Date('07-6-2020 08:00'),
                termination: new Date('7-6-2020 18:00'),
                active: true,
                acknowledged: true,
                role: 'Chef'
            },
            {
                id: '1001',
                beginning: new Date('07-7-2020 08:00'),
                termination: new Date('7-7-2020 18:00'),
                active: true,
                acknowledged: true,
                role: 'Chef'
            },
            {
                id: '1002',
                beginning: new Date('07-8-2020 08:00'),
                termination: new Date('7-8-2020 18:00'),
                active: true,
                acknowledged: true,
                role: 'Chef'
            },
            {
                id: '1003',
                beginning: new Date('07-9-2020 08:00'),
                termination: new Date('7-9-2020 18:00'),
                active: true,
                acknowledged: true,
                role: 'Chef'
            },
            {
                id: '1004',
                beginning: new Date('07-10-2020 08:00'),
                termination: new Date('7-10-2020 18:00'),
                active: true,
                acknowledged: true,
                role: 'Chef'
            },
            {},{}
        ]
    },
    {
        employee: {
            name: 'Alberto Biraghi',
            id: '2',
        },
        assignments: [
            {
                id: '0001',
                beginning: new Date('05-7-2020 08:00'),
                termination: new Date('05-7-2020 18:00'),
                active: true,
                acknowledged: true,
                role: 'Chef'
            },
            {},{},{},{},{},
            {
                id: '0002',
                beginning: new Date('05-11-2020 08:00'),
                termination: new Date('05-11-2020 18:00'),
                active: true,
                acknowledged: true,
                role: 'Chef'
            },
            {
                id: '0003',
                beginning: new Date('05-12-2020 08:00'),
                termination: new Date('05-12-2020 18:00'),
                active: true,
                acknowledged: true,
                role: 'Chef'
            },
        ]
    }
];