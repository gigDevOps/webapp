import React, {useState} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {get} from 'lodash';
import {colors} from '../styles';
import Button from '../Button';

import DropDownBtn from '../DropDownBtn';
import DataFilters from './DataFilters';
import NoData from './NoData';
import DataTableRows from './DataTableRows';

const Filters = (props) => {
    const {columns, filters, onFilteringHandler} = props;
    return (
        <div className="novek-table-filters">
            {columns.map((c) => {
                if (c.isFilterable) {
                    const value = get(filters, 'name');
                    return (
                        <DataFilters
                            key={c.key}
                            name={c.key}
                            onChange={onFilteringHandler}
                            hasLabel={false}
                            value={value}
                            type={c.filter.type}
                            options={c.filter.options}
                        />
                    );
                }
                return null;
            })}
        </div>
    );
};

export default function DataTable(props) {
    const {
        isFetching,
        dataSource,
        sectionTitle,
        onFiltering,
        activeFilters,
        columns,
        actions,
    } = props;

    const [filters, setFilters] = useState(activeFilters);
    if (isFetching) return (<p>Loading {sectionTitle} section...</p>);

    let hasFilters = false;
    let hasActions = false;
    let actionsRow = [];

    const onFilteringHandler = (key, value) => {
        setFilters({
            ...filters,
            [key]: value,
        });
        onFiltering(filters);
    };

    const keys = columns.map((c) => {
        if (c.isFilterable) hasFilters = true;
        if (c.key === 'actions') {
            actionsRow = c.options;
            hasActions = true;
        }
        return c.key;
    });

    const DataTableActions = actions.map((action) => {
        if (action.condition && !action.condition(action.context)) {
            return <></>;
        }
        /** Pass the context from the parent to the function. **/
        const onClick = () => action.onClick(action.context);
        if (action.type === 'dropdown') {
            return (
                <DropDownBtn
                    key={action.value}
                    value={action.value}
                    menuItems={action.options}
                />
            );
        }
        return <Button key={action.value} onClick={onClick} value={action.value}/>;
    });

    return (
        <>
            {
                props.sectionTitle
                    ? (
                        <StyledSimpleTableHeader>
                            <h2>{props.sectionTitle}</h2>
                            <hr/>
                        </StyledSimpleTableHeader>
                    ) : ''
            }
            <StyledDataTableWrapper
                className={['novek-table-wrapper', props.isCompact ? 'novek-table-compact' : ''].join(' ')}
            >
                {
                    (hasFilters || props.isExportable) && !props.isCompact
                        ? (
                            <StyledFilterActionWrapper>
                                {
                                    hasFilters
                                        ? (
                                            <div className="novek-table-filters-wrapper">
                                                <p className="head">Filters</p>
                                                <Filters onFilteringHandler={onFilteringHandler} {...props} />
                                            </div>
                                        )
                                        : ''
                                }
                                {
                                    hasActions || props.isExportable
                                        ? (
                                            <div className="novek-table-actions">
                                                {props.isExportable && !props.isCompact ? (
                                                    <Button
                                                        value="Export"
                                                        onClick={() => {
                                                        }}
                                                    />
                                                ) : ''}
                                                {DataTableActions}
                                            </div>
                                        ) : ''
                                }
                            </StyledFilterActionWrapper>
                        ) : ''
                }

                <StyledTableWrapper className="novek-table">
                    <StyledDataTable>
                        <thead>
                        <tr>
                            {columns.map((c) => <th key={c.key}>{c.value}</th>)}
                        </tr>
                        </thead>
                        {
                            dataSource.length < 1
                                ? <tbody/>
                                : <tbody><DataTableRows dataSource={dataSource} keys={keys} actionsRow={actionsRow}
                                                        columns={columns}/></tbody>
                        }
                    </StyledDataTable>
                    <div className="novek-table-results-wrapper">
                        <div className="novek-table-results">
                            {
                                props.dataSource.length < 1
                                    ? <NoData sectionTitle={props.sectionTitle}/>
                                    :
                                    <p>Showing {props.dataSource.length} of {props.dataSource.length} entries</p>
                            }
                        </div>
                        <div className="novek-table-pagination">
                            <ul className="novek-pagination"/>
                        </div>
                    </div>
                </StyledTableWrapper>

            </StyledDataTableWrapper>
        </>
    );
}

DataTable.prototype.propTypes = {
    columns: PropTypes.array.isRequired,
    dataSource: PropTypes.object.isRequired,
    isExportable: PropTypes.bool,
    isFetching: PropTypes.bool,
    onExport: PropTypes.func,
    onFiltering: PropTypes.func,
    rows: PropTypes.array,
    activeFilters: PropTypes.object,
    isCompact: PropTypes.bool,
    actions: PropTypes.array,
};

DataTable.defaultProps = {
    isExportable: false,
    isCompact: false,
    rows: [],
    actions: [],
    isFetching: true,
    activeFilters: {},
    onFiltering: () => {
    },
};

const StyledSimpleTableHeader = styled.div`
                                        display: flex;
                                        width: 100%;
                                        align-items: center;
                                        margin: 0.5rem 0;

                                        h2 {
                                        font-weight: 600;
                                        font-size: 1.15rem;
                                        color: ${colors.lightBlack};
                                        padding: 0.5rem 0;
                                        }

                                        hr {
                                        flex-grow: 1;
                                        border-top: 1px solid ${colors.grey};
                                        margin-left: 1rem;
                                        }

                                        button {
                                        border-radius: 3px;
                                        }

                                        .novek-table-compact-actions {
                                        padding-left: 1rem;
                                        }
                                        `;

const StyledDataTableWrapper = styled.div`
                                        width: 100%;
                                        font-size: 0.9rem;

                                        .novek-table-filters {
                                        flex-grow: 1;
                                        display: flex
                                        }

                                        .novek-table-actions {
                                        align-items: flex-end;
                                        padding: 0.25rem 0;

                                        button {
                                        display: inline-block;
                                        border-radius: 2.5px;
                                        margin-right: 1rem;

                                        :last-child {
                                        margin-right: 0;
                                        }
                                        }
                                        }
                                        `;

const StyledFilterActionWrapper = styled.div`
                                        width: 100%;
                                        display: flex;
                                        justify-content: space-between;
                                        align-items: flex-start;
                                        border-radius: 2.5px;
                                        background: ${colors.white};
                                        margin-bottom: 1rem;
                                        padding: 1rem;

                                        .novek-table-filters-wrapper {
                                        display: flex;
                                        align-items: baseline;

                                        .head {
                                        font-weight: 600;
                                        padding: 0 1.5rem 0 0;
                                        margin: 0;
                                        }
                                        }
                                        `;

const StyledTableWrapper = styled.div`
                                        width: 100%;
                                        background: ${colors.white};
                                        border-radius: 2.5px;
                                        margin-bottom: 1rem;


                                        .novek-table-results-wrapper {
                                        padding: 0.5rem;

                                        .novek-table-results {
                                        padding: 0 1.5rem;
                                        }

                                        .novek-table-results {
                                        color: ${colors.black};
                                        }
                                        }
                                        `;

const StyledDataTable = styled.table`
                                        width: 100%;
                                        white-space: nowrap;
                                        padding: 1.5em;
                                        border-collapse: collapse;
                                        border-bottom: 1px solid ${colors.grey};
                                        font-size: 0.9rem;
                                        
                                        button {
                                        display: inline-block;
                                        margin-right: 0.5rem;
                                        padding: 0.25rem 1rem;
                                        font-size: 1rem;
                                        border-radius: 2.5px;
                                        font-weight: 500;

                                        }

                                        thead {
                                        color: ${colors.black};
                                        text-transform: capitalize;
                                        background: ${colors.white};

                                        th {
                                        padding: 0.5rem;
                                        font-weight: 600;
                                        text-align: start;
                                        text-transform: uppercase;
                                        font-size: 0.8rem;

                                        :last-child {
                                        white-space: nowrap
                                        }
                                        }
                                        }

                                        tbody {
                                        tr {
                                        border-top: 1px solid ${colors.grey};
                                        :nth-of-type(even) {
                                        background: ${colors.white};
                                        }

                                        }

                                        td {
                                        text-align: start;
                                        vertical-align: top;
                                        padding: 0.5rem;

                                        :last-child {
                                        white-space: nowrap
                                        }
                                        }
                                        `;