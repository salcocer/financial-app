declare module '*.png' {
    const value: any;
    export default value;
}
declare module '*.jpg' {
    const value: any;
    export default value;
}
declare module '*.jpeg' {
    const value: any;
    export default value;
}
declare module '*.svg' {
    const value: any;
    export default value;
}
declare module '*.gif' {
    const value: any;
    export default value;
}

/**
 We tell TypeScript that any file with a .png, .jpg, .jpeg, .svg, or .gif extension can be imported as a module and will have a value of type any. 
 This is useful for importing image files in a TypeScript project without getting type errors.
 We tell the typescript to understand the import of the assets files.
 */
