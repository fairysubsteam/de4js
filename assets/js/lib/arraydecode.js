/* global utils */
// eslint-disable-next-line no-unused-vars
function ArrayDecode(source, options) {
  const detectPattern = /^var\s+((?!\d)[a-z_\d$]*)\s*=\s*\[.*?\];/;
  let _var = source.match(detectPattern);

  if (!_var || _var.length !== 2) throw 'Not matched';

  const _name = _var[1],
    keyPattern = new RegExp(_name.replace(/\$/g, '\\$') + '\\[(\\d+)\\]', 'g');
  let _code = source.replace(detectPattern, '');

  _var = _var[0].replace(/[\s\S]*?\[/, '[');
  _var = eval(_var);

  _code = _code.split(';');
  _code = _code.map((piece) =>
    piece.replace(keyPattern, (key, index) => {
      const item = _var[index],
        q = utils.strWrap(item);

      return q + utils.escapeRegExp(item, q) + q;
    }),
  );
  _code = _code.join(';');

  if (options.strMerge) _code = utils.strMerge(_code);
  if (options.methodChain) _code = utils.methodChain(_code);

  return _code;
}
