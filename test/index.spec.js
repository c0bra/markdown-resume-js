const md2resume = require('../src/');

// NOTE: event name is camelCase as per node convention
process.on('unhandledRejection', function(reason, promise) {
    // See Promise.onPossiblyUnhandledRejection for parameter documentation
});

describe('markdown-resume', () => {
  it('should require a markdown-type file', (done) => {
    var p = md2resume('foo.bar').then();

    p.finally(() => {
      expect(p.isRejected()).toBeTruthy();
      expect(p.reason()).toMatch('Only markdown files are supported');
      done();
    });
  });

  it('should require file to exist', (done) => {
    var p = md2resume('foo.md').then();

    p.finally(() => {
      expect(p.isRejected()).toBeTruthy();
      expect(p.reason()).toMatch('does not exist');
      done();
    });
  });
});
