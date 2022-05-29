import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import * as React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider as ThemeProvider_ } from 'styled-components';
import './App.less';
import { Fallback } from './components/Fallback';
import { Landing } from './components/Landing';
import { NewVersionNotifier } from './components/NewVersionNotifier';
import { NotFound } from './components/NotFound';
import { Nothing } from './components/Nothing';
import { AuthProvider } from './ctx/auth';
import { DeviceProvider } from './ctx/device';
import { MetaProvider } from './ctx/meta';
import { RouteInfoProvider } from './ctx/route-info';
import { ViewportProvider } from './ctx/viewport';
import { withAuthRequirement } from './hocs/withAuthRequirement';
import { useRoutingBehavior } from './hooks/useRoutingBehavior';
import { useScrollToTopOnRouteChange } from './hooks/useScrollToTopOnRouteChange';
import { theme } from './theme';
import { compose } from './util/compose';
import { AuthRequirement } from './util/types';

const ThemeProvider = ThemeProvider_ as any;

const Library = compose(withAuthRequirement(AuthRequirement.NONE))(React.lazy(() => import('./components/Library')));
const NotationShow = compose(withAuthRequirement(AuthRequirement.NONE))(
  React.lazy(() => import('./components/NotationShow'))
);
const NotationEdit = compose(withAuthRequirement(AuthRequirement.LOGGED_IN_AS_TEACHER))(
  React.lazy(() => import('./components/NotationEdit'))
);
const Signup = compose(withAuthRequirement(AuthRequirement.LOGGED_OUT))(
  React.lazy(() => import('./components/Signup'))
);
const Login = compose(withAuthRequirement(AuthRequirement.LOGGED_OUT))(React.lazy(() => import('./components/Login')));
const ConfirmEmail = compose(withAuthRequirement(AuthRequirement.LOGGED_IN))(
  React.lazy(() => import('./components/ConfirmEmail'))
);
const ForgotPassword = compose(withAuthRequirement(AuthRequirement.LOGGED_OUT))(
  React.lazy(() => import('./components/ForgotPassword'))
);
const ResetPassword = compose(withAuthRequirement(AuthRequirement.LOGGED_OUT))(
  React.lazy(() => import('./components/ResetPassword'))
);
const Upload = compose(withAuthRequirement(AuthRequirement.LOGGED_IN_AS_TEACHER))(
  React.lazy(() => import('./components/Upload'))
);
const UserIndex = compose(withAuthRequirement(AuthRequirement.LOGGED_IN_AS_ADMIN))(
  React.lazy(() => import('./components/UserIndex'))
);
const TagIndex = compose(withAuthRequirement(AuthRequirement.LOGGED_IN_AS_ADMIN))(
  React.lazy(() => import('./components/TagIndex'))
);

const Routing: React.FC = () => {
  const { shouldRedirectFromLandingToLibrary, recordLandingVisit } = useRoutingBehavior();

  useScrollToTopOnRouteChange();

  return (
    <Routes>
      <Route path="/index.html" element={<Navigate to="/" replace />} />
      <Route
        path="/"
        element={
          shouldRedirectFromLandingToLibrary ? (
            <Navigate to="/library" replace />
          ) : (
            <Landing onMount={recordLandingVisit} />
          )
        }
      ></Route>
      <Route path="/library" element={<Library />} />
      <Route path="/n/:id" element={<NotationShow />} />
      <Route path="/n/:id/edit" element={<NotationEdit />} />
      <Route path="/users" element={<UserIndex />} />
      <Route path="/tags" element={<TagIndex />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/confirm-email" element={<ConfirmEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/200.html" element={<Nothing />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <MetaProvider>
        <ConfigProvider locale={enUS}>
          <ThemeProvider theme={theme}>
            <ViewportProvider>
              <DeviceProvider>
                <AuthProvider>
                  <RouteInfoProvider>
                    <NewVersionNotifier />
                    <React.Suspense fallback={<Fallback />}>
                      <Routing />
                    </React.Suspense>
                  </RouteInfoProvider>
                </AuthProvider>
              </DeviceProvider>
            </ViewportProvider>
          </ThemeProvider>
        </ConfigProvider>
      </MetaProvider>
    </BrowserRouter>
  );
};
