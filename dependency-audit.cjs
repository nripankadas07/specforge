const test = require('node:test');
const assert = require('node:assert/strict');
const cp = require('node:child_process');
test('indexed source maps with extreme offsets finish without scanning absent code', () => {
  const fixture = `const {SourceMapConsumer, SourceNode} = require('source-map-js');
const map = {version:3,sections:[{offset:{line:10000000,column:0},map:{version:3,sources:['x.js'],names:[],mappings:'AAAA',sourcesContent:['x']}}]};
process.stdout.write(SourceNode.fromStringWithSourceMap('x',new SourceMapConsumer(map)).toString());`;
  const result = cp.spawnSync(process.execPath, ['-e', fixture], {encoding:'utf8', timeout:3000});
  assert.equal(result.error, undefined); assert.equal(result.status, 0); assert.equal(result.stdout, 'x');
});

test('section offsets above the supported bound are rejected', () => {
  const {SourceMapConsumer} = require('source-map-js');
  assert.throws(() => new SourceMapConsumer({version:3,sections:[{offset:{line:10000001,column:0},map:{version:3,sources:[],names:[],mappings:''}}]}), /Section offset line must not exceed 10000000/);
});
