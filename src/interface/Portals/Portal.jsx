import React from 'react';
import ReactDOM from "react-dom";
import styled from "styled-components";
import PropTypes from "prop-types";

const root = document.getElementById('portal');

class Portal extends React.Component {
    static propTypes = {
        onClose: PropTypes.func.isRequired,
        isOpen: PropTypes.bool.isRequired,
        children: PropTypes.node.isRequired
    }
    constructor(props) {
        super(props);
        this.el = document.createElement('div');
    }

    componentDidMount() {
        root.appendChild(this.el);
    }

    componentWillUnmount() {
        root.removeChild(this.el);
    }

    render() {
        return this.props.isOpen
            ? ReactDOM.createPortal(
                <PortalWrapper>
                    <PortalContentWrapper>
                        <button onClick={this.props.onClose}>Close</button>
                        <PortalContent>
                            {this.props.children}
                        </PortalContent>
                    </PortalContentWrapper>
                </PortalWrapper>
                , this.el)
            : null
    }
}

export default Portal;

const PortalWrapper = styled.div`
    z-index: 500;
    background: rgba(9, 30, 66, 0.54);
    width: 100vw;
    height: 100vh;
    position: fixed;
    position: absolute;
    top: 0;
    left: 0;
`
const PortalContentWrapper = styled.div`
    width: 75vw;
    height: 100vh;
    background: #fff;
    border-right: 1px solid #ccc;
    overflow-y: scroll;
`

const PortalContent = styled.div`
    padding: 1rem;   
`