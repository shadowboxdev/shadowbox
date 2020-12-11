import { Layout } from 'react-grid-layout';

export interface DashboardCtx {
  className: 'layout'
  items: number;
  cols: number;
  rowHeight: number;
  onLayoutChange: (layout: Layout[]) => void
}