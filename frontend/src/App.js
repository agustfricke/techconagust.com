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
// Categorys
import Backend from "./components/core/Backend";
import Fontend from "./components/core/Fontend";
import FullStack from "./components/core/FullStack";
import Blockchain from "./components/core/Blockchain";
import Hacking from "./components/core/Hacking";

// Auth Components
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Activation from "./components/auth/Activation";
import ResetPassword from "./components/auth/ResetPassword";
import ResetPasswordConfirm from "./components/auth/ResetPasswordConfirm";
import MiPerfil from "./components/auth/MiPerfil";
import UpdateEmail from "./components/auth/UpdateEmail";
import EditProfile from "./components/auth/EditProfile";
// Route Stuff
import PrivateRoute from "./components/auth/PrivateRoute";

// Admin Components
import AdminCursos from "./components/admin/AdminCursos";
import AdminFormCursos from "./components/admin/AdminFormCursos";
import Episodios from "./components/admin/Episodios";
import EditEpisodio from "./components/admin/EditEpisodio";
import Users from "./components/admin/Users";

// Shopping Stuff
import PremiumUser from "./components/shopping/PremiumUser";
import SuccessPremium from "./components/shopping/SuccessPremium";



function App() {

  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin

  return (
    <div className="bg-blue w-full min-h-screen">
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
        <Switch>
          {userInfo ? (
            <>
              <main className="lg:pl-32 lg:pr-38 pb-20">
                <div className="md:p-8 p-4">
                  <Header />
                  <Route path="/" component={Home} exact />
                  <Route path='/backend/' component={Backend} />
                  <Route path='/fontend/' component={Fontend} />
                  <Route path='/blockchain/' component={Blockchain} />
                  <Route path='/fullstack/' component={FullStack} />
                  <Route path='/hacking/' component={Hacking} />
                  <Route path='/curso/:id' component={Curso} />
                  <PrivateRoute path='/video/:epi/:curso' component={Video} />
                  <Route path='/reviews/:id' component={Reviews} />
                  <Route path='/login/' component={Login} />
                  <Route path='/register/' component={Register} />
                  <PrivateRoute path='/cursos/admin/' component={AdminCursos} />
                  <PrivateRoute path='/cursos/:id/form' component={AdminFormCursos} />
                  <Route path='/activate/:uid/:token' component={Activation} />
                  <Route path='/reset-password' component={ResetPassword} />
                  <Route path='/password/reset/confirm/:uid/:token/' component={ResetPasswordConfirm} />
                  <PrivateRoute path='/MiPerfil/' component={MiPerfil} />
                  <Route path='/reset-password' component={ResetPassword} />
                  <PrivateRoute path='/epi/:id' component={Episodios} />
                  <PrivateRoute path='/episodio/:id/form' component={EditEpisodio} />
                  <PrivateRoute path='/update/email/' component={UpdateEmail} />
                  <PrivateRoute path='/users/admin/' component={Users} />
                  <PrivateRoute path='/edit/profile' component={EditProfile} />
                  <PrivateRoute path='/premium/user/payment' component={PremiumUser} />
                  <PrivateRoute path='/success/premium/' component={SuccessPremium} />
                </div>
              </main>
            </>
          ) : (
            <div className="md:p-8 p-4">
                  <Header />
                  <Route path="/" component={Home} exact />
                  <Route path='/backend/' component={Backend} />
                  <Route path='/fontend/' component={Fontend} />
                  <Route path='/blockchain/' component={Blockchain} />
                  <Route path='/fullstack/' component={FullStack} />
                  <Route path='/hacking/' component={Hacking} />
                  <Route path='/curso/:id' component={Curso} />
                  <PrivateRoute path='/video/:epi/:curso' component={Video} />
                  <Route path='/reviews/all/:id' component={ReviewAll} />
                  <Route path='/login/' component={Login} />
                  <Route path='/register/' component={Register} />
                  <PrivateRoute path='/cursos/admin/' component={AdminCursos} />
                  <PrivateRoute path='/cursos/:id/form' component={AdminFormCursos} />
                  <Route path='/activate/:uid/:token' component={Activation} />
                  <Route path='/reset-password' component={ResetPassword} />
                  <Route path='/password/reset/confirm/:uid/:token/' component={ResetPasswordConfirm} />
                  <PrivateRoute path='/MiPerfil/' component={MiPerfil} />
                  <Route path='/reset-password' component={ResetPassword} />
                  <PrivateRoute path='/epi/:id' component={Episodios} />
                  <PrivateRoute path='/episodio/:id/form' component={EditEpisodio} />
                  <PrivateRoute path='/update/email/' component={UpdateEmail} />
                  <PrivateRoute path='/users/admin/' component={Users} />
                  <PrivateRoute path='/edit/profile' component={EditProfile} />
                  <PrivateRoute path='/premium/user/payment' component={PremiumUser} />
                  <PrivateRoute path='/success/premium/' component={SuccessPremium} />
            </div>
          )}
        </Switch>
      </Router>
    </div>
  );
}

export default App;
