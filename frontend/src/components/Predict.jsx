import { useState } from "react";
import { BrainCircuit, Zap, AlertCircle } from "lucide-react";
import API from "../services/api";

function Predict() {
  const [formData, setFormData] = useState({
    Hour: 12,
    DayOfWeek: 0,
    Month: 8,
    DayOfYear: 215,
    Lag_1: 40000,
    Lag_24: 39000,
    Lag_168: 41000,
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handlePredict = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setPrediction(null);

      const hour = formData.Hour;
      const month = formData.Month;

      const payload = {
        ...formData,

        Hour_sin: Math.sin((2 * Math.PI * hour) / 24),
        Hour_cos: Math.cos((2 * Math.PI * hour) / 24),

        Month_sin: Math.sin((2 * Math.PI * month) / 12),
        Month_cos: Math.cos((2 * Math.PI * month) / 12),
      };

      const response = await API.post("/predict", payload);
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
            <BrainCircuit size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Energy Prediction
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Enter demand-related features to generate a prediction
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        {/* Input Form */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="mb-6 text-lg font-semibold text-slate-900">
            Prediction Inputs
          </h2>

          <form
            onSubmit={handlePredict}
            className="grid gap-5 sm:grid-cols-2"
          >

            {/* Hour */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Hour
              </label>

              <input
                type="number"
                name="Hour"
                min="0"
                max="23"
                value={formData.Hour}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Day of Week */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Day of Week
              </label>

              <input
                type="number"
                name="DayOfWeek"
                min="0"
                max="6"
                value={formData.DayOfWeek}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-1 text-xs text-slate-400">
                0 = Monday, 6 = Sunday
              </p>
            </div>

            {/* Month */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Month
              </label>

              <input
                type="number"
                name="Month"
                min="1"
                max="12"
                value={formData.Month}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Day of Year */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Day of Year
              </label>

              <input
                type="number"
                name="DayOfYear"
                min="1"
                max="366"
                value={formData.DayOfYear}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Lag 1 */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Previous Hour Demand (Lag 1)
              </label>

              <input
                type="number"
                name="Lag_1"
                value={formData.Lag_1}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Lag 24 */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Previous Day Demand (Lag 24)
              </label>

              <input
                type="number"
                name="Lag_24"
                value={formData.Lag_24}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Lag 168 */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Previous Week Demand (Lag 168)
              </label>

              <input
                type="number"
                name="Lag_168"
                value={formData.Lag_168}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Button */}
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Zap size={18} />

                {loading ? "Predicting..." : "Predict Energy Consumption"}
              </button>
            </div>

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
                  size={28}
                  className="mx-auto text-blue-600"
                />

                <p className="mt-4 text-sm text-slate-500">
                  Predicted Energy Consumption
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

              <p className="mt-5 text-xs leading-5 text-slate-500">
                Prediction generated by the deployed XGBoost regression
                model using the provided temporal and lag-based features.
              </p>

            </div>
          ) : (
            <div className="mt-8 text-center text-sm text-slate-400">
              Enter the required values and click
              <span className="font-medium text-slate-600">
                {" "}Predict Energy Consumption
              </span>.
            </div>
          )}

          {error && (
            <div className="mt-5 flex gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-600">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}

export default Predict;