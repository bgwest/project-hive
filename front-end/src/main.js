import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';

import App from './component/app/app';
import createStore from './create-store';

// future import of CSS
import '../style/main.scss';

const store = createStore();

const rootNode = document.createElement('div');
document.body.appendChild(rootNode);
// this starts the entire application
ReactDom.render(<Provider store={store}><App/></Provider>, rootNode);
