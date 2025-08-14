import { BrowserRouter } from "react-router-dom";
import SystemRoutes from "./components/SystemRoutes";

const App = () => {
  return (
    <BrowserRouter>
      <SystemRoutes />
    </BrowserRouter>
  );
};

export default App;
