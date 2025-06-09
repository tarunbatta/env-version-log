import * as actualPath from 'path';

const mockParentDir = actualPath.resolve('__tests__');
const mockRootDir = actualPath.parse(process.cwd()).root;

export const join = (...args: string[]) => actualPath.join(...args);
export const dirname = jest.fn().mockReturnValue(mockParentDir);
export const parse = jest.fn().mockReturnValue({ root: mockRootDir });
export const resolve = (...args: string[]) => actualPath.resolve(...args);
