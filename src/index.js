import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import { ModalProvider } from "react-modal-hook";
import AuthContextProvider from "./context/auth";
import store from './reducers/store';
import Gigsasa from "./application";
import * as serviceWorker from './serviceWorker';
import 'rsuite/dist/styles/rsuite-default.css'
import './override.css';


ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <AuthContextProvider>
                <ModalProvider>
                    <Gigsasa />
                </ModalProvider>
            </AuthContextProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);



serviceWorker.unregister();
