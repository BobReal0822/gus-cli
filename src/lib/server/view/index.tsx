
/**
 *
 */
import * as Path from 'path';

import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import * as ReactDom from 'react-dom';
import * as escapeHtml from 'escape-html';
import { view } from './../config';

console.log(`path in view:
    layout: ${ Path.resolve(view.path.layout) }
    Home: ${ Path.resolve(view.path.home) }
`);

// tslint:disable-next-line
const Layout = require(Path.resolve(view.path.layout));
// tslint:disable-next-line
const Home = require(Path.resolve(view.path.layout));

console.log('Layout value: ', JSON.stringify(Layout));

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
