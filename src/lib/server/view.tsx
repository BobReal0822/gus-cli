
import { EventEmitter } from 'events';
/**
 *
 */
// import { Button } from 'antd';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import * as ReactDom from 'react-dom';
import * as escapeHtml from 'escape-html';

import Layout from './../../page/layout';
import { Home } from './../../page/';

export interface IPropsInfo {
  title: string;
  data: any;
}

export interface IStateInfo {
  size: string;
}

class Index extends React.Component<IPropsInfo, IStateInfo> {
  state: IStateInfo;
  constructor(props: IPropsInfo) {
    super(props);

    this.state = {
      size: 'test-size'
    };
  }

  test() {
    console.log('test click');
  }

  render() {
    const { title, data } = this.props;

    console.log('t-title: ', title);

    const dataScript = `window.__data__ = '${escapeHtml(JSON.stringify(data))}';`;
    const contentString = ReactDOMServer.renderToString(<Home data={data} />);

    return (
      <Layout
        title={ title }
      >
        <div id='content' dangerouslySetInnerHTML={{__html: contentString}} />
        <script dangerouslySetInnerHTML={{__html: dataScript}} />
      </Layout>
    );
  }
}

module.exports = Index;
