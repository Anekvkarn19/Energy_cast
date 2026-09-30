import { useState } from "react";
import { CalendarDays, Clock3, Zap, AlertCircle } from "lucide-react";
import API from "../services/api";

function Predict() {
  const [date, setDate] = useState("2018-08-03");
  const [time, setTime] = useState("01:00");

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePredict = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setPrediction(null);

      const response = await API.post("/predict-by-datetime", {
        date,
        time,
      });

      if (response.data.error) {
        setError(response.data.error);
        return;
      }

      setPrediction(response.data.predicted_energy_consumption_MW);
    } catch (err) {
      console.error(err);
      setError("Prediction failed. Please check the backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-6 sm:px-6 lg:px-8">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
            <Zap size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Predict Energy Demand
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Select a date and time to estimate electricity demand
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        {/* Prediction Form */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Forecast Selection
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Choose a date and time from the available forecast window.
            </p>
          </div>

          <form onSubmit={handlePredict} className="space-y-6">

            {/* Date */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                <CalendarDays size={17} />
                Forecast Date
              </label>

              <input
                type="date"
                value={date}
                min="2018-08-03"
                max="2018-08-04"
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Time */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                <Clock3 size={17} />
                Forecast Time
              </label>

              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-2 text-xs text-slate-400">
                Forecasts are available for the next 24 hours from the latest
                historical data point.
              </p>
            </div>

            {/* Data availability notice */}
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-sm font-medium text-blue-800">
                Historical Data Availability
              </p>

              <p className="mt-1 text-xs leading-5 text-blue-700">
                The model is trained on historical PJM electricity demand data
                available through August 3, 2018. Predictions are limited to
                the available 24-hour forecast window.
              </p>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Zap size={18} />

              {loading ? "Predicting..." : "Predict Energy Demand"}
            </button>

          </form>
        </div>

        {/* Result */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <p className="text-sm font-medium text-slate-500">
            Prediction Result
          </p>

          {prediction !== null ? (
            <div className="mt-8">

              <div className="rounded-2xl bg-blue-50 p-6 text-center">

                <Zap
                  size={30}
                  className="mx-auto text-blue-600"
                />

                <p className="mt-4 text-sm text-slate-500">
                  Expected Energy Demand
                </p>

                <p className="mt-2 text-4xl font-bold text-slate-900">
                  {Number(prediction).toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                </p>

                <p className="mt-1 font-medium text-blue-600">
                  MW
                </p>

              </div>

              <div className="mt-5 rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">
                  Forecast for
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {date} at {time}
                </p>
              </div>

            </div>
          ) : (
            <div className="mt-8 text-center text-sm text-slate-400">
              Select a date and time, then click{" "}
              <span className="font-medium text-slate-600">
                Predict Energy Demand
              </span>{" "}
              to generate a forecast.
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-5 flex gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-600">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}

export default Predict;