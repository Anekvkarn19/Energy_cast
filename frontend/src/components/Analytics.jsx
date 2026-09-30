import { useEffect, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Activity,
  CalendarDays,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { getForecast } from "../services/api";

function Analytics() {
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await getForecast();
        setForecast(response.data.forecast);
      } catch (error) {
        console.error("Analytics error:", error);
      }
    };

    loadData();
  }, []);

  const values = forecast.map((item) => item.predicted_MW);

  const peak = values.length ? Math.max(...values) : 0;
  const minimum = values.length ? Math.min(...values) : 0;

  const average = values.length
    ? values.reduce((sum, value) => sum + value, 0) / values.length
    : 0;

  const chartData = forecast.map((item) => ({
    time: item.datetime.slice(11, 16),
    consumption: Math.round(item.predicted_MW),
  }));

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-6 sm:px-6 lg:px-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Energy Analytics
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Insights from the latest 24-hour energy demand forecast
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Activity size={21} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Average Demand
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                {Math.round(average).toLocaleString()} MW
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-red-50 p-3 text-red-600">
              <TrendingUp size={21} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Peak Demand
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                {Math.round(peak).toLocaleString()} MW
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <BarChart3 size={21} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Minimum Demand
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                {Math.round(minimum).toLocaleString()} MW
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
              <CalendarDays size={21} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Forecast Horizon
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                24 Hours
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Main Chart */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Demand Pattern
          </h2>

          <p className="text-sm text-slate-500">
            Hour-by-hour predicted electricity consumption
          </p>
        </div>

        <div className="h-[380px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="time" />

              <YAxis
                tickFormatter={(value) =>
                  `${Math.round(value / 1000)}k`
                }
              />

              <Tooltip
                formatter={(value) => [
                  `${Number(value).toLocaleString()} MW`,
                  "Demand",
                ]}
              />

              <Line
                type="monotone"
                dataKey="consumption"
                stroke="#2563eb"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Hourly Bar Chart */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Hourly Demand Distribution
          </h2>

          <p className="text-sm text-slate-500">
            Comparison of predicted demand across hours
          </p>
        </div>

        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="time" />

              <YAxis
                tickFormatter={(value) =>
                  `${Math.round(value / 1000)}k`
                }
              />

              <Tooltip
                formatter={(value) => [
                  `${Number(value).toLocaleString()} MW`,
                  "Demand",
                ]}
              />

              <Bar
                dataKey="consumption"
                fill="#0f766e"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

    </main>
  );
}

export default Analytics;