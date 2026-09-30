import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppLayout from "./components/AppLayout";
import Dashboard from "./components/Dashboard";
import ModelPerformance from "./components/ModelPerformance";
import Forecast from "./components/Forecast";
import Analytics from "./components/Analytics";
import Predict from "./components/Predict";

function App() {
  return (
    <BrowserRouter>

      <AppLayout>

        <Routes>

          <Route path="/" element={<Dashboard />} />
          <Route path="/forecast" element={<Forecast />} />
          <Route path="/predict" element={<Predict />} />
          <Route
            path="/model-performance"
            element={<ModelPerformance />}
          />
          <Route path="/analytics" element={<Analytics />} />

        </Routes>

      </AppLayout>

    </BrowserRouter>
  );
}

export default App;