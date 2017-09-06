"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const escapeHtml = require("escape-html");
const react_router_1 = require("react-router");
const app_1 = require("./../app");
const config_1 = require("./../config");
class Index extends React.Component {
    constructor(props) {
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
        const appPath = (app.type === app_1.ProjectTypes.project) ? app.name : '';
        console.log('app in view:', app.type, JSON.stringify(app));
        const Layout = require(Path.resolve('dist', appPath, config_1.view.path.layout));
        const Home = require(Path.resolve('dist', appPath, config_1.view.path.home));
        console.log(`path in view:
            layout: ${Path.resolve(config_1.view.path.layout)}----${JSON.stringify(Layout)}
            Home: ${Path.resolve(config_1.view.path.home)} ---${JSON.stringify(Home)}
        `);
        const dataScript = `window.__data__ = '${escapeHtml(JSON.stringify(data))}';`;
        const contentString = ReactDOMServer.renderToString(React.createElement(react_router_1.StaticRouter, { location: location, context: context },
            React.createElement(Home, { data: data })));
        return (React.createElement(Layout, { title: data.title },
            React.createElement("div", { onClick: this.test.bind(this) }, "this test"),
            React.createElement("div", { id: 'content', dangerouslySetInnerHTML: { __html: contentString } }),
            React.createElement("script", { dangerouslySetInnerHTML: { __html: dataScript } })));
    }
}
module.exports = Index;
//# sourceMappingURL=index.js.map