import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './features/auth/Login';
import DashLayout from './components/DashLayout'
import Welcome from './features/auth/Welcome'
import UsersList from './features/users/UsersList'
import NewUserForm from './features/users/NewUserForm'
import MailsList from './features/mails/MailsList'
import BundlesList from './features/bundles/BundlesList'
import EditMail from './features/mails/EditMail'
import NewMail from './features/mails/NewMail'
import BranchesList from './features/branches/BranchesList'
import Prefetch from './features/auth/Prefetch'
import PersistLogin from './features/auth/PersistLogin'
import RequireAuth from './features/auth/RequireAuth'
import { ROLES } from './config/roles'
import useTitle from './hooks/useTitle';

function App() {
  useTitle('POST')

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route index element={<Login />} />
        <Route path="login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>
            <Route element={<Prefetch />}>
              <Route path="dash" element={<DashLayout />}>

                <Route index element={<Welcome />} />

                <Route element={<RequireAuth allowedRoles={[ROLES.Manager, ROLES.Admin]} />}>
                  <Route path="users">
                    <Route index element={<UsersList />} />
                    <Route path="new" element={<NewUserForm />} />
                  </Route>
                </Route>
                <Route path="branches">
                    <Route index element={<BranchesList />} />
                    {/* <Route path=":id" element={<EditUser />} />
                    <Route path="new" element={<NewUserForm />} /> */}
                  </Route>
                <Route path="mails">
                  <Route index element={<MailsList />} />
                  <Route path=":id" element={<EditMail />} />
                  <Route path="new" element={<NewMail />} />
                </Route>
                <Route path="bundles">
                  <Route index element={<BundlesList />} />
                  <Route path=":id" element={<EditMail />} />
                  <Route path="new" element={<NewMail />} />
                </Route>
              </Route>{/* End Dash */}
            </Route>
          </Route>
        </Route>{/* End Protected Routes */}

      </Route>
    </Routes >
  );
}

export default App;
