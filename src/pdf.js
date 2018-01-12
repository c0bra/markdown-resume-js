const pdf = require('html-pdf');

module.exports = function generate(html) {
  const generated = pdf.create(html);

  return new Promise((resolve, reject) => {
    generated.toStream((err, stream) => {
      if (err) return reject(err);

      return resolve(stream);
    });
  });
};
