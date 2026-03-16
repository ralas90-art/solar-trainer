// Type declaration shim for react-pdf v6 (types bundled with package but not resolved by tsc directly)
declare module 'react-pdf' {
    export { Document, Page, pdfjs, Outline, Thumbnail } from 'react-pdf/dist/cjs/entry'
}
