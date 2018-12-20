export function spaPageGenerator(path: string, type: string) {
  const pathArray = path.split('/');
  const name = pathArray[pathArray.length - 1];
  const upperName = name.split('-').map(item => item[0].toUpperCase() + item.slice(1, item.length)).join('');
  const prefix = (isStyle = true) =>  pathArray.length > +isStyle ? pathArray.slice(+isStyle, pathArray.length).map(() => '..').join('/') + '/' : '';

  switch (type) {
    case 'tsx':
      return `
import * as React from 'react';

import './${ prefix(false) }style/${ path }.less';

export interface ${ upperName }PropsInfo {
}

export interface ${ upperName }StateInfo {
}

export default class ${ upperName } extends React.Component<${ upperName }PropsInfo, ${ upperName }StateInfo> {
  constructor(props: ${ upperName }PropsInfo) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (
      <div>
        <h1 className='title'>Page ${ name }</h1>
      </div>
    );
  }
}\n`;

    case 'less':
      return `
// @import './${ prefix() }/index.less';
      `;

    default:
      return '';
  }
}
