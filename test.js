import { loadSchema, getLoadedSchemas } from './index.js'
const a = loadSchema('./samples/', 'composed')
console.log(getLoadedSchemas())
a.then(()=>
console.log(getLoadedSchemas()))