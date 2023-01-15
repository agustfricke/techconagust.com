import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// Navigation Component
import Sidebar from "./components/navigation/Sidebar";
import Header from "./components/navigation/Header";
import Lowbar from "./components/navigation/Lowbar";

// Core Components
import Home from "./components/core/Home";
import Curso from "./components/core/Curso";
import Video from "./components/core/Video";

function App() {
  return (
    <div className="bg-blue w-full min-h-screen">
      <Sidebar />
      <Lowbar/>
      <Router>
        {/* <Header /> */}
        <Switch>
          <main className="lg:pl-32 lg:pr-38 pb-20">
            <div className="md:p-8 p-4">
              <Header/> 

              <Route path="/" component={Home} exact />
              <Route path='/curso/' component={Curso} />
              <Route path='/video/' component={Video} />

            </div>
          </main>

        </Switch>
        {/* <Footer/> */}
      </Router>
    </div>
  );
}

export default App;
