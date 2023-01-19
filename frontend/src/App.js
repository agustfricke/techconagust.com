import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';

// Navigation Component
import Sidebar from "./components/navigation/Sidebar";
import Header from "./components/navigation/Header";
import Lowbar from "./components/navigation/Lowbar";

// Core Components
import Home from "./components/core/Home";
import Curso from "./components/core/Curso";
import Video from "./components/core/Video";
import Reviews from "./components/core/Reviews";
import ReviewAll from "./components/core/ReviewAll";

// Auth Components
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Activation from "./components/auth/Activation";
import ResetPassword from "./components/auth/ResetPassword";
import ResetPasswordConfirm from "./components/auth/ResetPasswordConfirm";
import MiPerfil from "./components/auth/MiPerfil";
import UpdateEmail from "./components/auth/UpdateEmail";
import EditProfile from "./components/auth/EditProfile";


// Admin Components
import AdminCursos from "./components/admin/AdminCursos";
import AdminFormCursos from "./components/admin/AdminFormCursos";
import Episodios from "./components/admin/Episodios";
import EditEpisodio from "./components/admin/EditEpisodio";
import Users from "./components/admin/Users";

// Shopping Stuff
import PremiumUser from "./components/shopping/PremiumUser";
import SuccessPremium from "./components/shopping/SuccessPremium";
import SoloCurso from "./components/shopping/SoloCurso";


function App() {

  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin


  return (
    <div className="bg-blue w-full min-h-screen">
      {/* Remove Side and low if user is not log in */}
      {userInfo ? (
        <>
          <Sidebar />
          <Lowbar />
        </>
      ) : (
        <>
        </>
      )}
      <Router>
        {/* <Header /> */}
        <Switch>
          {/* Remove this div if user is not log in */}
          {userInfo ? (
            <>
              <main className="lg:pl-32 lg:pr-38 pb-20">

                <div className="md:p-8 p-4">
                  <Header />

                  <Route path="/" component={Home} exact />
                  <Route path='/curso/:id' component={Curso} />
                  <Route path='/video/:epi/:curso' component={Video} />
                  <Route path='/reviews/:id' component={Reviews} />
                  <Route path='/revisiones/all/:id' component={ReviewAll} />
                  <Route path='/login/' component={Login} />
                  <Route path='/register/' component={Register} />
                  <Route path='/admin/cursos/' component={AdminCursos} />
                  <Route path='/cursos/:id/form' component={AdminFormCursos} />
                  <Route path='/activate/:uid/:token' component={Activation} />
                  <Route path='/reset-password' component={ResetPassword} />
                  <Route path='/password/reset/confirm/:uid/:token/' component={ResetPasswordConfirm} />
                  <Route path='/MiPerfil/' component={MiPerfil} />
                  <Route path='/reset-password' component={ResetPassword} />
                  <Route path='/epi/:id' component={Episodios} />
                  <Route path='/episodio/:id/form' component={EditEpisodio} />
                  <Route path='/update/email/' component={UpdateEmail} />
                  <Route path='/users/admin/' component={Users} />
                  <Route path='/edit/profile' component={EditProfile} />
                  <Route path='/premium/user/payment' component={PremiumUser} />
                  <Route path='/success/premium/' component={SuccessPremium} />
                  <Route path='/solo/curso/payment/:id' component={SoloCurso} />








                </div>
              </main>
            </>

          ) : (
            <div className="md:p-8 p-4">
              <Header />

              <Route path="/" component={Home} exact />
              <Route path='/curso/:id' component={Curso} />
              <Route path='/video/' component={Video} />
              <Route path='/reviews/:id' component={Reviews} />

              <Route path='/login/' component={Login} />
              <Route path='/register/' component={Register} />
              <Route path='/admin/cursos/' component={AdminCursos} />
              <Route path='/activate/:uid/:token' component={Activation} />
              <Route path='/reset-password' component={ResetPassword} />
              <Route path='/password/reset/confirm/:uid/:token/' component={ResetPasswordConfirm} />
              <Route path='/MiPerfil/' component={MiPerfil} />

            </div>

          )}

        </Switch>
        {/* <Footer/> */}
      </Router>
    </div>
  );
}

export default App;
