"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function websitePageGenerator(path, type) {
    const pathArray = path.split('/');
    const name = pathArray[pathArray.length - 1];
    const upperName = name.split('-').map(item => item[0].toUpperCase() + item.slice(1, item.length)).join('');
    const prefix = (isStyle = true) => pathArray.length > +isStyle ? pathArray.slice(+isStyle, pathArray.length).map(() => '..').join('/') + '/' : '';
    switch (type) {
        case 'html':
            return `
<!DOCTYPE html>
<html>
<head>
  <title></title>
</head>
<body>
  <div id='${name}'></div>
  <script src={{ url 'common.js' }}></script>
  <script src={{ url '${path}.js' }}></script>
</body>
</html>
      `;
        case 'jsx':
            return `
import * as React from 'react';
import * as ReactDom from 'react-dom';

import "./${prefix()}style/${path}.scss";

class ${upperName} extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (
      <div>
        <img src={ img } />
        <h1 className="title">desktop example</h1>
      </div>
    );
  }
}

ReactDom.render(<${upperName} />, document.getElementById('${name}'));
      `;
        case 'scss':
            return `
@import './${prefix()}common/index.scss';
      `;
        default:
            return '';
    }
}
exports.websitePageGenerator = websitePageGenerator;
//# sourceMappingURL=website.page.js.map