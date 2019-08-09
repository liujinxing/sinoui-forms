/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
import url from 'url';
import { resolve } from 'path';
import packageInfo from './package.json';

/**
 * 获取基本URL
 */
function getBaseUrl() {
  if (process.env.NODE_ENV === 'production') {
    const { name, homepage } = packageInfo;

    if (homepage) {
      return url.parse(homepage).path;
    }
    if (name.startsWith('@')) {
      return name.substr(name.indexOf('/'));
    }
    return `/${name}`;
  }
  return '/';
}

export default {
  title: 'sinoui-forms-library',
  codeSandbox: false,
  typescript: true,
  files: ['**/*.mdx'],
  public: './docs/assets',
  menu: [
    '开始',
    {
      name: '教程',
      menu: [
        '值处理',
        '表单初始值与重置',
        '表单校验',
        '自定义表单域',
        '提交表单',
        '嵌套表单',
      ],
    },

    {
      name: '@sinoui/rx-form-state',
      menu: [
        'useFormState',
        'FormStateContext',
        'Field',
        'FieldArray',
        'FormValueMonitor',
        'useFormStateContext',
        'useFormSelect',
        'useFormSubmitting',
        'useField',
        'useFieldState',
        'useFieldError',
        'useFieldValue',
        'useFieldTouched',
        'useFieldArray',
        '数据结构类型',
      ],
    },
    {
      name: '@sinoui/web-forms',
      menu: ['Form', 'FormItem', 'FormItemField', 'Label'],
    },
    {
      name: '@sinoui/sinoui-components-forms',
      menu: [
        '开始',
        'Form',
        'FormItem',
        'Label',
        'Field',
        'TextInput',
        'Checkbox',
        'CheckboxGroup',
        'RadioGroup',
        'DatePicker',
        'Select',
        '表单样式定制',
        '@sinoui/forms到@sinoui/sinoui-components-forms迁移指南',
      ],
    },
    {
      name: '案例分析',
      menu: ['登录', '注册', '新建联系人'],
    },
  ],
  wrapper: 'docs/src/Wrapper.tsx',
  indexHtml: 'docs/index.html',
  base: getBaseUrl(),
  onCreateWebpackChain: (config) => {
    // 配置webpack的方式：[webpack-chain](https://github.com/neutrinojs/webpack-chain)

    config.module
      .rule('css')
      .test(/\.css$/)
      .use('style-loader')
      .loader('style-loader')
      .end()
      .use('css-loader')
      .loader('css-loader')
      .options({
        importLoaders: 1,
      })
      .end()
      .use('postcss-loader')
      .loader('postcss-loader')
      .options({
        plugins: (loader) => [
          require('postcss-import')({ root: loader.resourcePath }),
          require('postcss-preset-env')({
            browsers: ['last 2 versions', 'not dead', 'IE 10', 'IE 11'],
          }),
        ],
      })
      .end();

    config.plugin('ghpages').use(require('webpack-docz-ghpages-plugin'));

    config.resolve.alias
      .set(
        '@sinoui/rx-form-state',
        resolve('./packages/rx-form-state/src/index.ts'),
      )
      .set('@sinoui/web-forms', resolve('./packages/web-forms/src/index.ts'))
      .set(
        '@sinoui/sinoui-components-forms',
        resolve('./packages/sinoui-components-forms/src/index.ts'),
      )
      .end();

    return config;
  },
};
