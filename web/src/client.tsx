import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import Root from './root';

ReactDOM.hydrateRoot(
  document.getElementById('app')!,
  <BrowserRouter>
    <Root />
  </BrowserRouter>,
);
