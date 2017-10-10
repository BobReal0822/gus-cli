
/**
 *
 */
import * as Path from 'path';

import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import * as ReactDom from 'react-dom';
import * as escapeHtml from 'escape-html';
import { StaticRouter } from 'react-router';

import { ProjectTypes } from './../app';
import { view } from './../config';

export interface IPropsInfo {
    app: {
        name: string;
        type: string;
    };
    data: any;
    location: string;
    context: {
        url?: string;
    } | undefined;
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
        const { app, data, location, context } = this.props;
        const appPath = (app.type === ProjectTypes.project) ? app.name : '';

        console.log('app in view:', app.type, JSON.stringify(app));
        // tslint:disable-next-line
        const Layout = require(Path.resolve('dist', appPath, view.path.layout));
        // tslint:disable-next-line
        const Home = require(Path.resolve('dist', appPath, view.path.home));

        console.log(`path in view:
            layout: ${ Path.resolve(view.path.layout) }----${ JSON.stringify(Layout) }
            Home: ${ Path.resolve(view.path.home) } ---${ JSON.stringify(Home) }
        `);
        const dataScript = `window.__data__ = '${escapeHtml(JSON.stringify(data))}';`;
        const contentString = ReactDOMServer.renderToString(
            <StaticRouter
                location={ location }
                context={ context }
            >
                <Home data={ data } />
            </StaticRouter>);

        return (
            <Layout
                title={ data.title }
            >
                <div id='content' dangerouslySetInnerHTML={{__html: contentString}} />
                <script dangerouslySetInnerHTML={{__html: dataScript}} />
            </Layout>
        );
    }
}

module.exports = Index;
