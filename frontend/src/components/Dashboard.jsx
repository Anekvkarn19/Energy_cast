import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  BrainCircuit,
  Clock3,
  Gauge,
  Menu,
  Server,
  TrendingUp,
  Zap,
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
import {
  getMetrics,
  getForecast,
  getHealth,
  getCurrentDemand,
} from "../services/api";

function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [currentDemand, setCurrentDemand] = useState(null);
  const [status, setStatus] = useState("Checking...");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [
              healthResponse,
              metricsResponse,
             forecastResponse,
            currentDemandResponse,
            ] = await Promise.all([
            getHealth(),
             getMetrics(),
            getForecast(),
            getCurrentDemand(),
              ]);
        setStatus(healthResponse.data.status);
        setMetrics(metricsResponse.data);
        setForecast(forecastResponse.data.forecast);
        setCurrentDemand(currentDemandResponse.data);
      } catch (error) {
        console.error("Dashboard API error:", error);
        setStatus("Offline");
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  const chartData = useMemo(() => {
    return forecast.map((item) => ({
      time: new Date(item.datetime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      consumption: item.predicted_MW,
    }));
  }, [forecast]);

  const averageForecast = useMemo(() => {
    if (!forecast.length) return 0;

    return (
      forecast.reduce((sum, item) => sum + item.predicted_MW, 0) /
      forecast.length
    );
  }, [forecast]);

  const peakForecast = useMemo(() => {
    if (!forecast.length) return null;
    return forecast.reduce((max, item) =>
      item.predicted_MW > max.predicted_MW ? item : max
    );
  }, [forecast]);
  const peakTime = useMemo(() => {
  if (!peakForecast) return "--";

  return new Date(peakForecast.datetime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}, [peakForecast]);

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
      {/* Main content */}
      <main>
        {/* Topbar */}
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur md:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="rounded-lg border border-slate-200 p-2 lg:hidden">
                <Menu size={20} />
              </button>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-blue-600">
                  Energy Analytics
                </p>
                <h2 className="text-xl font-bold text-slate-900">
                  Forecast Dashboard
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold">
                  XGBoost Model
                </p>
                <p className="text-xs text-slate-500">
                  Production Forecasting
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <BrainCircuit size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <section className="p-6 md:p-8">
          {/* Hero */}
          <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 p-7 text-white shadow-lg">
            <div className="max-w-2xl">
              <div className="mb-3 flex items-center gap-2 text-sm text-blue-300">
                <Zap size={17} />
                24-HOUR ENERGY OUTLOOK
              </div>
              <h1 className="text-3xl font-bold md:text-4xl">
                Energy Demand Forecast
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-300 md:text-base">
                Monitor upcoming electricity demand and identify peak
                consumption periods with hourly forecasts.
              </p>
            </div>
          </div>
          {/* KPI cards */}
<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

  {/* Current Demand */}
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Zap size={20} />
      </div>

      <span className="text-xs font-medium text-slate-400">
        LATEST ACTUAL
      </span>
    </div>

    <p className="mt-5 text-sm text-slate-500">
      Current Demand
    </p>

    <p className="mt-1 text-2xl font-bold">
      {currentDemand
        ? `${Math.round(currentDemand.current_demand_MW).toLocaleString()} MW`
        : "--"}
    </p>

    {currentDemand && (
      <p className="mt-1 text-xs text-slate-500">
        Latest available reading
      </p>
    )}
  </div>


  {/* Peak Demand */}
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
        <TrendingUp size={20} />
      </div>

      <span className="text-xs font-medium text-slate-400">
        NEXT 24 HOURS
      </span>
    </div>

    <p className="mt-5 text-sm text-slate-500">
      Peak Demand
    </p>

    <p className="mt-1 text-2xl font-bold">
      {peakForecast
        ? `${Math.round(peakForecast.predicted_MW).toLocaleString()} MW`
        : "--"}
    </p>

    <p className="mt-1 text-xs text-slate-500">
      Highest predicted demand
    </p>
  </div>


  {/* Peak Time */}
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
        <Clock3 size={20} />
      </div>

      <span className="text-xs font-medium text-slate-400">
        PEAK PERIOD
      </span>
    </div>

    <p className="mt-5 text-sm text-slate-500">
      Peak Time
    </p>

    <p className="mt-1 text-2xl font-bold">
      {peakTime}
    </p>

    <p className="mt-1 text-xs text-slate-500">
      Expected highest demand
    </p>
  </div>


  {/* Average Demand */}
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
        <Gauge size={20} />
      </div>

      <span className="text-xs font-medium text-slate-400">
        NEXT 24 HOURS
      </span>
    </div>

    <p className="mt-5 text-sm text-slate-500">
      Average Demand
    </p>

    <p className="mt-1 text-2xl font-bold">
      {averageForecast
        ? `${Math.round(averageForecast).toLocaleString()} MW`
        : "--"}
    </p>

    <p className="mt-1 text-xs text-slate-500">
      Expected average consumption
    </p>
  </div>

</div>

          {/* Chart + Peak */}
          <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_300px]">
            {/* Chart */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">
                    Next 24 Hours
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Predicted hourly energy consumption
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-600">
                  <Clock3 size={15} />
                  24H Forecast
                </div>
              </div>
              <div className="h-[330px]">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{
                        top: 10,
                        right: 10,
                        left: 0,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="time"
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) =>
                          `${Math.round(value / 1000)}K`
                        }
                      />
                      <Tooltip
                        formatter={(value) => [
                          `${Number(value).toLocaleString()} MW`,
                          "Forecast",
                        ]}
                      />
                      <Line
                        type="monotone"
                        dataKey="consumption"
                        stroke="#2563eb"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-400">
                    {loading
                      ? "Loading forecast..."
                      : "Forecast data unavailable"}
                  </div>
                )}
              </div>
            </div>

            {/* Demand Insights */}
<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

  <p className="text-sm font-medium text-slate-500">
    Forecast Overview
  </p>

  <h3 className="mt-2 text-xl font-bold">
    Demand Insights
  </h3>

  <div className="mt-6 space-y-4">

    {/* Peak Demand */}
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs text-slate-500">
        Peak predicted demand
      </p>

      <p className="mt-1 text-xl font-bold">
        {peakForecast
          ? `${peakForecast.predicted_MW.toLocaleString()} MW`
          : "--"}
      </p>

      {peakForecast && (
        <p className="mt-1 text-xs text-slate-500">
          {new Date(peakForecast.datetime).toLocaleString()}
        </p>
      )}
    </div>

    {/* Peak Time */}
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs text-slate-500">
        Peak period
      </p>

      <p className="mt-1 text-xl font-bold">
        {peakTime}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        Expected highest demand
      </p>
    </div>

    {/* Average Demand */}
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs text-slate-500">
        Average expected demand
      </p>

      <p className="mt-1 text-xl font-bold">
        {averageForecast
          ? `${Math.round(averageForecast).toLocaleString()} MW`
          : "--"}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        Across the next 24 hours
      </p>
    </div>

  </div>
</div>
          </div>

          {/* Hourly forecast table */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-lg font-bold">
                Hourly Forecast
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Detailed predictions for the next 24 hours
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400">
                    <th className="px-4 py-3">
                      Time
                    </th>
                    <th className="px-4 py-3">
                      Date
                    </th>
                    <th className="px-4 py-3">
                      Predicted Consumption
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {forecast.map((item, index) => {
                    const date = new Date(item.datetime);
                    return (
                      <tr
                        key={index}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                      >
                        <td className="px-4 py-3 text-sm font-medium">
                          {date.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-500">
                          {date.toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold">
                          {item.predicted_MW.toLocaleString()} MW
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;