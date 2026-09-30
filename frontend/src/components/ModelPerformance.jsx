import { ArrowLeft, BrainCircuit, CheckCircle2 } from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function ModelPerformance() {
  const models = [
    {
      name: "Random Forest",
      mae: 315.07,
      rmse: 428.57,
      r2: 0.9956,
    },
    {
      name: "XGBoost",
      mae: 300.79,
      rmse: 405.8,
      r2: 0.9961,
    },
  ];

  const maeData = models.map((model) => ({
    model: model.name,
    MAE: model.mae,
  }));

  const rmseData = models.map((model) => ({
    model: model.name,
    RMSE: model.rmse,
  }));
 return (
  <div className="min-h-screen bg-[#f5f7fb]">

      {/* Header */}
      <header className="border-b border-slate-200 bg-white px-6 py-5 md:px-8">

        <div className="flex items-center gap-4">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <BrainCircuit size={22} />
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-blue-600">
              Machine Learning
            </p>

            <h1 className="text-2xl font-bold text-slate-900">
              Model Performance
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Compare forecasting models using test-set evaluation metrics.
            </p>
          </div>

        </div>

      </header>


      <main className="p-6 md:p-8">

        {/* Summary */}
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-slate-900 to-blue-900 p-6 text-white">

          <div className="flex items-start gap-4">

            <CheckCircle2
              className="mt-1 text-emerald-400"
              size={25}
            />

            <div>

              <h2 className="text-xl font-bold">
                Evaluated Forecasting Models
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
                Random Forest and XGBoost were evaluated using the same
                chronological train-test split and the same engineered
                features. Lower MAE and RMSE indicate smaller prediction
                errors, while a higher R² indicates greater explained
                variance.
              </p>

            </div>

          </div>

        </div>


        {/* Model cards */}
        <div className="grid gap-5 md:grid-cols-2">

          {models.map((model) => (

            <div
              key={model.name}
              className={`rounded-2xl border bg-white p-6 shadow-sm ${
                model.name === "XGBoost"
                  ? "border-blue-300 ring-2 ring-blue-100"
                  : "border-slate-200"
              }`}
            >

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm text-slate-500">
                    Forecasting Model
                  </p>

                  <h3 className="mt-1 text-xl font-bold">
                    {model.name}
                  </h3>

                </div>

                {model.name === "XGBoost" && (
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                    Selected for API
                  </span>
                )}

              </div>


              <div className="mt-6 grid grid-cols-3 gap-3">

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">
                    MAE
                  </p>

                  <p className="mt-1 text-lg font-bold">
                    {model.mae}
                  </p>

                  <p className="text-xs text-slate-400">
                    MW
                  </p>
                </div>


                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">
                    RMSE
                  </p>

                  <p className="mt-1 text-lg font-bold">
                    {model.rmse}
                  </p>

                  <p className="text-xs text-slate-400">
                    MW
                  </p>
                </div>


                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">
                    R²
                  </p>

                  <p className="mt-1 text-lg font-bold">
                    {model.r2}
                  </p>

                  <p className="text-xs text-slate-400">
                    score
                  </p>
                </div>

              </div>

            </div>

          ))}

        </div>


        {/* Charts */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          {/* MAE */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-bold">
              MAE Comparison
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Mean Absolute Error — lower is better
            </p>

            <div className="mt-6 h-[280px]">

              <ResponsiveContainer width="100%" height="100%">

                <BarChart data={maeData}>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis dataKey="model" />

                  <YAxis />

                  <Tooltip
                    formatter={(value) => [
                      `${value} MW`,
                      "MAE",
                    ]}
                  />

                  <Bar
                    dataKey="MAE"
                    fill="#2563eb"
                    radius={[6, 6, 0, 0]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div>


          {/* RMSE */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-bold">
              RMSE Comparison
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Root Mean Squared Error — lower is better
            </p>

            <div className="mt-6 h-[280px]">

              <ResponsiveContainer width="100%" height="100%">

                <BarChart data={rmseData}>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis dataKey="model" />

                  <YAxis />

                  <Tooltip
                    formatter={(value) => [
                      `${value} MW`,
                      "RMSE",
                    ]}
                  />

                  <Bar
                    dataKey="RMSE"
                    fill="#7c3aed"
                    radius={[6, 6, 0, 0]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div>

        </div>


        {/* Evaluation note */}
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">

          <h3 className="font-semibold text-amber-900">
            Evaluation note
          </h3>

          <p className="mt-1 text-sm leading-6 text-amber-800">
            These metrics represent one-step-ahead predictions on the
            chronological test set, where historical lag values are
            available. The deployed 24-hour forecast uses recursive
            predictions, so its multi-step performance should be evaluated
            separately.
          </p>

        </div>

      </main>

    </div>
  );
}

export default ModelPerformance;