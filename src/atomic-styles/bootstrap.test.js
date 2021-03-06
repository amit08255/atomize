import {
  transformVar,
  createCssRule,
  createEffectWrapper,
  createMediaWrapper,
  ruleExists,
} from './bootstrap';
import themeDefault from '../constants/themeDefault';

const override = { props: { theme: themeDefault } };

describe('Chain styles', () => {
  test('create css rule', () => {
    const { css } = createCssRule({
      propKey: ['bgc'],
      value: 'red',
      ...override,
    });
    expect(css).toStrictEqual({ 'background-color': 'red' });
  });
  test('create effect wrapper', () => {
    const { css } = createEffectWrapper({
      propKey: ['hover'],
      value: 'red',
      css: { 'background-color': 'red' },
      config: { effects: { hover: ':hover' } },
      ...override,
    });
    expect(css).toStrictEqual({
      '&:hover, &[data-quarkly-state="hover"]': { 'background-color': 'red' },
    });
  });
  test('create media wrapper', () => {
    const { css } = createMediaWrapper({
      propKey: ['sm'],
      value: 'red',
      css: { 'background-color': 'red' },
      config: { effects: { hover: ':hover' } },
      ...override,
    });
    expect(css).toStrictEqual({
      '@media (max-width: 576px)': { 'background-color': 'red' },
    });
  });
  test('theme get color', () => {
    const { css } = createCssRule({
      propKey: ['color'],
      value: '--blue',
    });
    expect(css).toStrictEqual({ color: 'var(--qtheme-color-blue)' });
  });
  test('theme get bg color', () => {
    const { css } = createCssRule({
      propKey: ['bgc'],
      value: '--blue',
    });
    expect(css).toStrictEqual({ 'background-color': 'var(--qtheme-color-blue)' });
  });
});

describe('work with useAliases', () => {
  test('enable', () => {
    expect(ruleExists('m')).toBeTruthy();
    expect(ruleExists('d')).toBeTruthy();
    expect(ruleExists('bgc')).toBeTruthy();
  });
  test('disable', () => {
    expect(ruleExists('m', { useAliases: false })).toBeFalsy();
    expect(ruleExists('d', { useAliases: false })).toBeFalsy();
    expect(ruleExists('bgc', { useAliases: false })).toBeFalsy();
  });
});

describe('Var transformation', () => {
  test('simple', () => {
    const primary = 'var(--qtheme-color-primary)';
    expect(transformVar('color', '--primary')).toBe(primary);
    expect(transformVar('color', '--color-primary')).toBe(primary);
    expect(transformVar('color', primary)).toBe(primary);

    expect(transformVar('background-color', '--color-primary')).toBe(primary);
    expect(transformVar('border-color', '--primary')).toBe(primary);
  });
});
