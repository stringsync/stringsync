import React from 'react';
import { compose, setDisplayName, lifecycle } from 'recompose';
import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US.js';

const scrollToTop = () => window.scrollTo(null, 0);

const enhance = compose(
  setDisplayName('App'),
  lifecycle({
    componentDidMount: () => {

    }
  })
);

const App = enhance(props => (
  <div className="App">
    <LocaleProvider locale={enUS}>
      <div>
        <main>
          App
        </main>
      </div>
    </LocaleProvider>
  </div>
));

export default App;
