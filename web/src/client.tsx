import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import Root from './root';

const mountEl = document.getElementById('app')!;

const node = (
  <BrowserRouter>
    <Root />
  </BrowserRouter>
);

if (mountEl.childNodes.length) ReactDOM.hydrateRoot(mountEl, node);
else ReactDOM.createRoot(mountEl).render(node);
