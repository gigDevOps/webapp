import React from 'react';
import PropTypes from 'prop-types';

import { get, find } from 'lodash';

import Button from '../Button';

export default function DataTableRows(props) {
    const { dataSource, columns, keys, actionsRow } = props;

    const returnRenderMethod = (head, row) => {
        const object = find(head, ['key', row]);
        return object.render ? object.render : null;
    };

    return dataSource.map((c) => {
        const values = keys.map((k) => {
            const customRenderMethod = returnRenderMethod(columns, k);
            if (customRenderMethod) {

                const render = () => customRenderMethod(c);
                return {
                    name: k,
                    value: render(),
                };
            }
            /**
             * @TODO Check if actions are full-filled with all params, otherwise noop.
             * @type {any[]}
             */
            const actionObjects = actionsRow.map((a) => {
                if (a.condition && !a.condition(c)) {
                    return <></>;
                }
                /** Pass the context from the parent to the function. **/
                const onClick = () => a.onClick(c);
                return (
                    <Button
                        key={a.value}
                        onClick={onClick}
                        size="xsmall"
                        value={a.value}
                    />
                );
            });
            return k !== 'actions'
                ? {
                    name: k,
                    value: get(c, k),
                } : {
                    name: k,
                    value: actionObjects,
                };
        });

        return (
            <tr key={c.name}>
                {values.map((r) => <td key={r.name}>{r.value}</td>)}
            </tr>
        );
    });
}

DataTableRows.prototype.propTypes = {
    actionsRow: PropTypes.array.isRequired,
};

DataTableRows.defaultProps = {
    actionsRow: [],
};
