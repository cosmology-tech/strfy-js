import { jsStringify, chooseQuotes } from '../src';

it('handles strings with newlines and other special chars', () => {
  const obj = {
    "title": "AIOZ Network is a DePIN for Web3 AI, Storage and Streaming.\n\nAIOZ empowers a faster, secure and decentralized future.\n\nPowered by a global network of DePINs, AIOZ rewards you for sharing your computational resources for storing, transcoding, and streaming digital media content and powering decentralized AI computation.",
    "description": "AIOZ Network is a DePIN for Web3 AI, Storage and Streaming.\n\t\rAIOZ empowers a faster, secure and decentralized future.\n\nPowered by a global network of DePINs, AIOZ rewards you for sharing your computational resources for storing, transcoding, and streaming digital media content and powering decentralized AI computation."
  };
  const options = {};
  const output = jsStringify(obj, options);
  expect(output).toMatchSnapshot();
});

describe('chooseQuotes', () => {
  test('handles strings with no special characters using single quotes', () => {
    const str = "Hello world";
    expect(chooseQuotes(str, 'single')).toBe("'Hello world'");
  });

  test('handles strings with no special characters using double quotes', () => {
    const str = "Hello world";
    expect(chooseQuotes(str, 'double')).toBe('"Hello world"');
  });

  test('handles strings with no special characters using backticks', () => {
    const str = "Hello world";
    expect(chooseQuotes(str, 'backtick')).toBe('`Hello world`');
  });

  test('handles strings with single quotes', () => {
    const str = "It's a sunny day";
    expect(chooseQuotes(str, 'single')).toBe("'It\\'s a sunny day'");
    expect(chooseQuotes(str, 'double')).toBe('"It\'s a sunny day"');
    expect(chooseQuotes(str, 'backtick')).toBe('`It\'s a sunny day`');
  });

  test('handles strings with double quotes', () => {
    const str = 'She said, "Hello"';
    expect(chooseQuotes(str, 'single')).toBe("'She said, \"Hello\"'");
    expect(chooseQuotes(str, 'double')).toBe('"She said, \\"Hello\\""');
    expect(chooseQuotes(str, 'backtick')).toBe('`She said, "Hello"`');
  });

  test('handles strings with backticks', () => {
    const str = '`Hello` world';
    expect(chooseQuotes(str, 'single')).toBe("'`Hello` world'");
    expect(chooseQuotes(str, 'double')).toBe('"`Hello` world"');
    expect(chooseQuotes(str, 'backtick')).toBe('`\\`Hello\\` world`');
  });

  test('handles strings with single and double quotes', () => {
    const str = "It's a \"wonderful\" day";
    expect(chooseQuotes(str, 'single')).toBe("'It\\'s a \"wonderful\" day'");
    expect(chooseQuotes(str, 'double')).toBe('"It\'s a \\"wonderful\\" day"');
    expect(chooseQuotes(str, 'backtick')).toBe('`It\'s a "wonderful" day`');
  });

  test('handles strings with single quotes and backticks', () => {
    const str = "It's `great`";
    expect(chooseQuotes(str, 'single')).toBe("'It\\'s `great`'");
    expect(chooseQuotes(str, 'double')).toBe('"It\'s `great`"');
    expect(chooseQuotes(str, 'backtick')).toBe('`It\'s \\`great\\``');
  });

  test('handles strings with double quotes and backticks', () => {
    const str = "`Hello`, he said, \"Good morning!\"";
    expect(chooseQuotes(str, 'single')).toBe("'`Hello`, he said, \"Good morning!\"'");
    expect(chooseQuotes(str, 'double')).toBe('"`Hello`, he said, \\"Good morning!\\""');
    expect(chooseQuotes(str, 'backtick')).toBe('`\\`Hello\\`, he said, "Good morning!"`');
  });

  test('handles strings with all types of quotes', () => {
    const str = "It's `really` a \"wonderful\" day";
    expect(chooseQuotes(str, 'single')).toBe("'It\\'s `really` a \"wonderful\" day'");
    expect(chooseQuotes(str, 'double')).toBe('"It\'s `really` a \\"wonderful\\" day"');
    expect(chooseQuotes(str, 'backtick')).toBe('`It\'s \\`really\\` a "wonderful" day`');
  });
});
