const test = require('node:test');
const assert = require('node:assert/strict');
const cp = require('node:child_process');
test('bounded Zod arrays reject excess input before walking elements (GHSA-mrhx-c7xc-m3w5)', () => {
  const { z } = require('zod');
  let visits = 0;
  const schema = z.array(z.string().superRefine(() => { visits += 1; })).max(3);
  const rejected = schema.safeParse(['a', 'b', 'c', 'd', 'e']);
  assert.equal(rejected.success, false);
  assert.equal(visits, 0);
  assert.deepEqual(rejected.error.issues.map(issue => issue.code), ['too_big']);
  assert.deepEqual(schema.parse(['a', 'b']), ['a', 'b']);
  assert.equal(visits, 2);
});
test('Undici rejects an excessive encoding chain without an orphan stream crash (GHSA-xjj6-f33q-929c)', () => {
  const script = `
    import assert from 'node:assert/strict';
    import { createServer } from 'node:http';
    import { setTimeout } from 'node:timers/promises';
    import { fetch } from 'undici';
    const server = createServer((req, res) => {
      res.writeHead(200, {'content-encoding':'gzip, gzip, gzip, gzip, gzip, gzip', 'content-length':'1'});
      res.flushHeaders();
      res.socket.end();
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    try {
      await assert.rejects(fetch('http://127.0.0.1:' + server.address().port));
      await setTimeout(50);
    } finally {
      server.closeAllConnections();
      await new Promise(resolve => server.close(resolve));
    }
  `;
  const child = cp.spawnSync(process.execPath, ['--input-type=module', '-e', script], {encoding:'utf8', timeout:5000});
  assert.equal(child.error, undefined);
  assert.equal(child.status, 0, child.stderr);
});
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

test('manual mock URLs remain literal data in generated JavaScript (GHSA-qxg6-89mg-rqv8)', async () => {
  const { createManualModuleSource } = await import('@vitest/mocker/node');
  const url = 'x"); globalThis.__specforgeMockCanary = 1; void("';
  let received;
  globalThis.__specforgeMockFactory = { getFactoryModule(value) { received = value; return { answer: 42 }; } };
  try {
    const source = createManualModuleSource(url, ['answer'], '"__specforgeMockFactory"');
    const module = await import('data:text/javascript,' + encodeURIComponent(source));
    assert.equal(received, url);
    assert.equal(module.answer, 42);
    assert.equal(globalThis.__specforgeMockCanary, undefined);
  } finally {
    delete globalThis.__specforgeMockFactory;
    delete globalThis.__specforgeMockCanary;
  }
});

