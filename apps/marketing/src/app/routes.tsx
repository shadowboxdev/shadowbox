import React, { Suspense, lazy } from 'react';
import { Route, Switch } from "react-router-dom";

import Fallback from './layout/fallback/fallback';

export interface RouteItem {
  text: string;
  link: string;
  component?: (props?: unknown) => JSX.Element
}

export interface Routes {
  primary: RouteItem[];
  secondary: RouteItem[];
}

export const appRoutes: Routes = {
  primary: [
    { text: 'Inbox', link: '/', component: lazy(() => import('./pages/dashboard/dashboard')) },
    { text: 'Starred', link: '/about', component: lazy(() => import('./pages/about/about')) },
    { text: 'Send Email', link: 'sendEmail' },
    { text: 'Drafts', link: 'drafts' }
  ],
  secondary: [
    { text: 'All mail', link: 'allMail' },
    { text: 'Trash', link: 'trash' },
    { text: 'Spam', link: 'spam' }
  ]
}

export const renderRoutes = () => (
  <Suspense fallback={<Fallback />}>
    <Switch>
      {appRoutes.primary.map((route) => (
        
          <Route exact path={route.link} component={route.component} key={route.link}/>
        
      ))}
      {appRoutes.secondary.map((route) => (
        
          <Route exact path={route.link} component={route.component} key={route.link}/>
        
      ))}
    </Switch>
  </Suspense>
);

