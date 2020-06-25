import csvParse from 'csv-parse';
import fs from 'fs';
import AppError from '../errors/AppError';

export default async function loadCSV(csvFilePath: string): Promise<any[]> {
  if (!(await fs.promises.stat(csvFilePath))) {
    throw new AppError('File not found');
  }
  const readCSVStream = fs.createReadStream(csvFilePath);

  const parseStream = csvParse({
    from_line: 2,
    ltrim: true,
    rtrim: true,
  });

  const parseCSV = readCSVStream.pipe(parseStream);

  const lines: any[] = [];

  parseCSV.on('data', line => {
    lines.push(line);
  });

  await new Promise(resolve => {
    parseCSV.on('end', resolve);
  });

  await fs.promises.unlink(csvFilePath);

  return lines;
}
