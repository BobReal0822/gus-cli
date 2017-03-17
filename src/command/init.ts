/**
 * 
 */
import * as Cp from 'child_process';

export const InitNames = {
  lib: 'lib',
  koa: 'koa',
  express: 'express'
};

export interface InitOptionsInfo {

};

export const  DefaultInitOptions: InitOptionsInfo = {

};

export function init(name: string, options?: InitOptionsInfo) {
  if (!name) {
    return;
  }

  switch(name) {
    case InitNames.lib: 
      Cp.exec('yo ts-lib');
      break;
    default: 
      '';
  }
}