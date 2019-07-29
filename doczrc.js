/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
import url from 'url';
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
  title: 'sinoui-forms',
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
        '表单校验',
        '自定义表单域',
        '提交表单',
        '嵌套表单',
        'web-forms',
        '与sinoui-components组合',
      ],
    },
    {
      name: 'API',
      menu: [
        '@sinoui/rx-form-state',
        'useFormState',
        'FormStateContext',
        'Field',
        'FieldArray',
        'FormValueMonitor',
        'useFormStateContext',
        'useField',
        'useFieldState',
        'useFielError',
        'useFieldValue',
        'useFieldTouched',
        'useFieldArray',
        '数据结构类型',
        '与rxjs的组合',
        '@sinoui/web-forms',
        'Form',
        'FormItem',
        'FormItemField',
        'FieldError',
        'Label',
        '@sinoui/sinoui-components-forms',
        'Form',
        'FormItem',
        'FormItemField',
        'FieldError',
        'Label',
        'TextInput',
        'Checkbox',
        'CheckboxGroup',
        'RadioGroup',
        'DatePicker',
        'Select',
      ],
    },
    {
      name: '案例分析',
      menu: ['登录', '注册', '新建联系人'],
    },
  ],
  wrapper: 'docs/Wrapper.tsx',
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

    return config;
  },
};
