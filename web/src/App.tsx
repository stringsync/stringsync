import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import * as React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import './App.less';
import { Fallback } from './components/Fallback';
import { Landing } from './components/Landing';
import { NewVersionNotifier } from './components/NewVersionNotifier';
import { NotFound } from './components/NotFound';
import { Nothing } from './components/Nothing';
import { ScrollBehavior } from './components/ScrollBehavior';
import { AuthProvider } from './ctx/auth';
import { DeviceProvider } from './ctx/device';
import { MetaProvider } from './ctx/meta';
import { RouteInfoProvider } from './ctx/route-info';
import { ViewportProvider } from './ctx/viewport';
import { withAuthRequirement } from './hocs/withAuthRequirement';
import { theme } from './theme';
import { compose } from './util/compose';
import { AuthRequirement } from './util/types';

// TODO(jared): Remove after types get fixed.
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/59765
const ThemeProviderProxy: any = ThemeProvider;

const Library = compose(withAuthRequirement(AuthRequirement.NONE))(React.lazy(() => import('./components/Library')));
const N = compose(withAuthRequirement(AuthRequirement.NONE))(React.lazy(() => import('./components/N')));
const NEdit = compose(withAuthRequirement(AuthRequirement.LOGGED_IN_AS_TEACHER))(
  React.lazy(() => import('./components/NEdit'))
);
const NExport = compose(withAuthRequirement(AuthRequirement.LOGGED_IN_AS_ADMIN))(
  React.lazy(() => import('./components/NExport'))
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

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <MetaProvider>
        <ConfigProvider locale={enUS}>
          <ThemeProviderProxy theme={theme}>
            <ViewportProvider>
              <DeviceProvider>
                <AuthProvider>
                  <RouteInfoProvider>
                    <NewVersionNotifier />
                    <ScrollBehavior />
                    <React.Suspense fallback={<Fallback />}>
                      <Routes>
                        <Route path="/index.html" element={<Navigate to="/" replace />} />
                        <Route path="/" element={<Landing />}></Route>
                        <Route path="/library" element={<Library />} />
                        <Route path="/n/:id" element={<N />} />
                        <Route path="/n/:id/edit" element={<NEdit />} />
                        <Route path="/n/:id/export" element={<NExport />} />
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
                    </React.Suspense>
                  </RouteInfoProvider>
                </AuthProvider>
              </DeviceProvider>
            </ViewportProvider>
          </ThemeProviderProxy>
        </ConfigProvider>
      </MetaProvider>
    </BrowserRouter>
  );
};
