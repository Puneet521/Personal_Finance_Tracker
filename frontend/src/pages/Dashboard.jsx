import React, { useEffect, useMemo, useState } from "react";
import api from "../api/api";
import { Pie, Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend);

export default function Dashboard(){
  const [monthly, setMonthly] = useState([]);
  const [categories, setCategories] = useState([]);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try{
      const [m, c, t] = await Promise.all([
        api.get('/analytics/monthly'),
        api.get('/analytics/categories'),
        api.get('/analytics/trends')
      ]);
      setMonthly(m.data.monthlyOverview || []);
      setCategories(c.data.categoryBreakdown || []);
      setTrends(t.data.trends || []);
    }catch(err){ console.error(err); }
    finally{ setLoading(false); }
  };

  useEffect(()=>{ fetchAll(); }, []);

  const pieData = useMemo(()=>({
    labels: categories.map(c => c.category),
    datasets: [{ data: categories.map(c => Number(c.total) || 0), backgroundColor: categories.map((_,i)=>`hsl(${i*40%360} 70% 50%)`) }]
  }), [categories]);

  const lineData = useMemo(()=>({
    labels: monthly.map(m => new Date(m.month).toLocaleString('default',{month:'short',year:'numeric'})).reverse(),
    datasets: [
      { label: 'Income', data: monthly.map(m=>Number(m.total_income||0)).reverse(), tension:0.3 },
      { label: 'Expense', data: monthly.map(m=>Number(m.total_expense||0)).reverse(), tension:0.3 }
    ]
  }), [monthly]);

  const barData = useMemo(()=>({
    labels: trends.map(t=> new Date(t.month).toLocaleString('default',{month:'short',year:'numeric'}) ),
    datasets: [
      { label: 'Income', data: trends.map(t=>Number(t.income||0)) },
      { label: 'Expense', data: trends.map(t=>Number(t.expense||0)) }
    ]
  }), [trends]);

  if (loading) return <div className="container">Loading analytics…</div>;

  return (
    <div className="container">
      <h2>Dashboard</h2>
      <div style={{ marginBottom: 12 }}>
        <button onClick={fetchAll}>🔄 Refresh</button>
      </div>

      <div className="grid-analytics">
        <div className="card">
          <h4>Category distribution</h4>
          <Pie data={pieData} />
        </div>
        <div className="card">
          <h4>Monthly income vs expense</h4>
          <Line data={lineData} />
        </div>
        <div className="card full">
          <h4>Income vs Expense trends</h4>
          <Bar data={barData} />
        </div>
      </div>
    </div>
  );
}
