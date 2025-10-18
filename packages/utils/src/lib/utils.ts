import { core } from '@lc-trading-services/core';

export function utils(): string {
  return 'utils';
}

export function getInfo(): string {
  return `utils depends on ${core()}`;
}
