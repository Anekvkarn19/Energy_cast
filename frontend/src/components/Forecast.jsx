import { useEffect, useState } from "react";
import {
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Activity,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { getForecast } from "../services/api";

function Forecast() {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadForecast = async () => {
    try {
      setLoading(true);

      const response = await getForecast();

      setForecast(response.data.forecast);
    } catch (error) {
      console.error("Forecast error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForecast();
  }, []);

  const values = forecast.map((item) => item.predicted_MW);

  const peak = values.length ? Math.max(...values) : 0;
  const minimum = values.length ? Math.min(...values) : 0;
  const average = values.length
    ? values.reduce((sum, value) => sum + value, 0) / values.length
    : 0;

  const peakHour = forecast.find(
    (item) => item.predicted_MW === peak
  );

  const minimumHour = forecast.find(
    (item) => item.predicted_MW === minimum
  );

  const chartData = forecast.map((item, index) => ({
    hour: `Hour ${index + 1}`,
    consumption: Math.round(item.predicted_MW),
  }));

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-6 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            24-Hour Forecast
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Predicted electricity demand for the next 24 hours
          </p>
        </div>

        <button
          onClick={loadForecast}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />
          Refresh Forecast
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        
        {/* Peak */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Peak Consumption
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {peak.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })} MW
              </p>

              {peakHour && (
                <p className="mt-1 text-xs text-slate-400">
                  {peakHour.datetime}
                </p>
              )}
            </div>

            <div className="rounded-xl bg-red-50 p-3 text-red-600">
              <TrendingUp size={22} />
            </div>
          </div>
        </div>

        {/* Minimum */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Minimum Consumption
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {minimum.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })} MW
              </p>

              {minimumHour && (
                <p className="mt-1 text-xs text-slate-400">
                  {minimumHour.datetime}
                </p>
              )}
            </div>

            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <TrendingDown size={22} />
            </div>
          </div>
        </div>

        {/* Average */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Average Consumption
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {average.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })} MW
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Next 24 hours
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Activity size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Forecast Trend
          </h2>
          <p className="text-sm text-slate-500">
            Hourly predicted electricity consumption
          </p>
        </div>

        <div className="h-[360px] w-full">
          {loading ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">
              Loading forecast...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="hour" />

                <YAxis
                  tickFormatter={(value) =>
                    `${Math.round(value / 1000)}k`
                  }
                />

                <Tooltip
                  formatter={(value) => [
                    `${Number(value).toLocaleString()} MW`,
                    "Consumption",
                  ]}
                />

                <Line
                  type="monotone"
                  dataKey="consumption"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Hourly Forecast
          </h2>
          <p className="text-sm text-slate-500">
            Detailed electricity demand predictions
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">Hour</th>
                <th className="px-5 py-3">Predicted Consumption</th>
              </tr>
            </thead>

            <tbody>
              {forecast.map((item, index) => (
                <tr
                  key={index}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-5 py-3 font-medium text-slate-700">
                    {item.datetime}
                  </td>

                  <td className="px-5 py-3 font-semibold text-slate-900">
                    {Math.round(item.predicted_MW).toLocaleString()} MW
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </main>
  );
}

export default Forecast;