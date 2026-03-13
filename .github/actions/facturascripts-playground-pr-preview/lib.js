/**
 * Encodes a string as base64url (RFC 4648 §5).
 * Replaces `+` with `-`, `/` with `_`, and strips trailing `=`.
 * @param {string} str
 * @returns {string}
 */
export function toBase64Url(str) {
  const b64 = Buffer.from(str, 'utf8').toString('base64');
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Builds the blueprint JSON object from action inputs.
 * @param {string} zipUrl
 * @param {string} title
 * @param {string} author
 * @param {string} description
 * @returns {object}
 */
export function buildBlueprint(zipUrl, title, author, description) {
  return {
    meta: {
      title,
      author,
      description,
    },
    plugins: [zipUrl],
  };
}

/**
 * Constructs the full playground preview URL.
 * @param {string} playgroundUrl
 * @param {string} blueprintJson
 * @returns {string}
 */
export function buildPreviewUrl(playgroundUrl, blueprintJson) {
  const encoded = toBase64Url(blueprintJson);
  const base = playgroundUrl.endsWith('/')
    ? playgroundUrl
    : playgroundUrl + '/';
  return `${base}?blueprint-data=${encoded}`;
}

/**
 * Builds the body of the sticky PR comment.
 * @param {string} marker
 * @param {string} previewUrl
 * @param {string} imageUrl
 * @returns {string}
 */
export function buildCommentBody(marker, previewUrl, imageUrl) {
  return `<!-- ${marker} -->
## FacturaScripts Playground Preview

<a href="${previewUrl}">
  <img src="${imageUrl}" alt="Open this PR in FacturaScripts Playground" width="220">
</a><br>
<small><a href="${previewUrl}">Try this PR in your browser</a></small>

This preview was generated automatically from the PR branch ZIP.`;
}
