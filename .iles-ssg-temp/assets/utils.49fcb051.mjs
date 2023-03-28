import "@nuxt/devalue";
function mapObject(obj, fn) {
  const result = {};
  for (let key in obj)
    result[key] = fn(obj[key], key);
  return result;
}
async function asyncMapObject(obj, fn) {
  const result = {};
  for (let key in obj)
    result[key] = await fn(obj[key]);
  return result;
}
function getComponentName({ displayName, name, _componentTag, __file }) {
  return displayName || name || _componentTag || nameFromFile(__file);
}
function nameFromFile(file) {
  var _a;
  const regex = /[\\/]src(?:[\\/](?:pages|layouts))?[\\/](.*?)(?:\.vue)?$/;
  return ((_a = file == null ? void 0 : file.match(regex)) == null ? void 0 : _a[1]) || file;
}
export {
  asyncMapObject as a,
  getComponentName as g,
  mapObject as m
};
