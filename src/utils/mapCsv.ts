export const mapCSV = (
  text: string,
  options: {
    delimeter: string;
    stripQuotes: boolean;
  } = {
    delimeter: ',',
    stripQuotes: true,
  },
): Array<{ [key: string | number]: string | number }> => {
  const lines = text.trimEnd().split('\n');
  const headers = lines[0].split(options.delimeter);

  const transactions = lines.slice(1).map(line => {
    const values = line.split(options.delimeter);
    const transaction: { [key: string | number]: string | number } = {};

    headers.forEach((header, index) => {
      if (options.stripQuotes) {
        header = header.replace(/"/g, '').trim();
      }
      transaction[header] = values[index] || '';
    });

    return transaction;
  });

  return transactions;
};
