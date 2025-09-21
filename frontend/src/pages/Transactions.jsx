import { useEffect, useState } from 'react';
import api from '../api/api';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await api.get('/transactions/my');
      setTransactions(res.data.transactions);
    }
    fetchData();
  }, []);

  return (
    <div>
      <h2>My Transactions</h2>
      <ul>
        {transactions.map((t) => (
          <li key={t.id}>
            {t.type}: {t.amount} (Category {t.category_id})
          </li>
        ))}
      </ul>
    </div>
  );
}
