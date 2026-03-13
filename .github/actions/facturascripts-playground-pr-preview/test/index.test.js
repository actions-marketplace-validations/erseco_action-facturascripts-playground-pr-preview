import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toBase64Url, buildBlueprint, buildPreviewUrl, buildCommentBody } from '../lib.js';

test('toBase64Url produces valid base64url (no +, /, or = chars)', () => {
  const input = '{"test":"hello world+/="}';
  const result = toBase64Url(input);
  assert.ok(!result.includes('+'), 'must not contain +');
  assert.ok(!result.includes('/'), 'must not contain /');
  assert.ok(!result.includes('='), 'must not contain =');
  // Verify round-trip
  const decoded = Buffer.from(result.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
  assert.equal(decoded, input);
});

test('toBase64Url strips padding from base64', () => {
  // 'a' encodes to 'YQ==' in standard base64, must be 'YQ' in base64url
  assert.equal(toBase64Url('a'), 'YQ');
});

test('buildBlueprint returns correct structure', () => {
  const bp = buildBlueprint(
    'https://example.com/plugin.zip',
    'Test Title',
    'test-author',
    'Test description'
  );
  assert.deepEqual(bp, {
    meta: {
      title: 'Test Title',
      author: 'test-author',
      description: 'Test description',
    },
    plugins: ['https://example.com/plugin.zip'],
  });
});

test('buildPreviewUrl appends blueprint-data query param', () => {
  const json = '{"meta":{},"plugins":["https://example.com/plugin.zip"]}';
  const url = buildPreviewUrl('https://erseco.github.io/facturascripts-playground/', json);
  assert.ok(url.startsWith('https://erseco.github.io/facturascripts-playground/'), 'starts with playground URL');
  assert.ok(url.includes('?blueprint-data='), 'contains blueprint-data param');
  // Must not contain raw base64 special chars
  const encoded = url.split('?blueprint-data=')[1];
  assert.ok(!encoded.includes('+'), 'encoded must not contain +');
  assert.ok(!encoded.includes('/'), 'encoded must not contain /');
  assert.ok(!encoded.includes('='), 'encoded must not contain =');
});

test('buildPreviewUrl appends trailing slash to playground URL if missing', () => {
  const json = '{"test":1}';
  const url = buildPreviewUrl('https://erseco.github.io/facturascripts-playground', json);
  assert.ok(url.startsWith('https://erseco.github.io/facturascripts-playground/'), 'trailing slash added');
});

test('buildCommentBody contains marker, URL, and image', () => {
  const marker = 'facturascripts-playground-preview';
  const previewUrl = 'https://erseco.github.io/facturascripts-playground/?blueprint-data=abc123';
  const imageUrl = 'https://example.com/logo.png';
  const body = buildCommentBody(marker, previewUrl, imageUrl);
  assert.ok(body.includes(`<!-- ${marker} -->`), 'contains hidden marker');
  assert.ok(body.includes(previewUrl), 'contains preview URL');
  assert.ok(body.includes(imageUrl), 'contains image URL');
});
