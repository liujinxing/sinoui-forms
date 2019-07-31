/** @private is the given object a Function? */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isFunction = (obj: any): obj is Function => typeof obj === 'function';

export default isFunction;
