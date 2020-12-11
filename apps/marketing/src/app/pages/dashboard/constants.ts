import { Layout } from 'react-grid-layout';
import { DashboardCtx } from './models';

export const DEFAULT_OPTIONS: DashboardCtx = {
  className: "layout",
  items: 20,
  rowHeight: 30,
  onLayoutChange: (layout: Layout[]) => { },
  cols: 12
};