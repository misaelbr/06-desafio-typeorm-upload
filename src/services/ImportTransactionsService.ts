import path from 'path';

import loadCSV from '../utils/loadCSV';
import uploadConfig from '../config/upload';

import Transaction from '../models/Transaction';
import CreateTransaction from './CreateTransactionService';

interface Request {
  filename: string;
}
interface CSVImport {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}
class ImportTransactionsService {
  async execute({ filename }: Request): Promise<Transaction[]> {
    const csvFilePath = path.join(uploadConfig.directory, filename);

    const createTransaction = new CreateTransaction();

    const queueTransaction: any[] = [];
    const transactions: Transaction[] = [];

    const data = await loadCSV(csvFilePath);

    data.forEach(column => {
      const obj = {
        title: column[0],
        type: column[1],
        value: Number(column[2]),
        category: column[3],
      };
      queueTransaction.push(obj);
    });

    for (const transaction of queueTransaction) {
      const newTransaction = await createTransaction.execute({
        ...transaction,
      });

      transactions.push(newTransaction);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
