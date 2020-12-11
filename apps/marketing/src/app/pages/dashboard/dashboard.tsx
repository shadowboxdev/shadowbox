import React from 'react';
import RGL, { WidthProvider, Layout } from 'react-grid-layout';
import { map, mergeRight, range } from 'ramda';
import { ceil, floor, mapIndexed } from 'ramda-adjunct';

const ReactGridLayout = WidthProvider(RGL);

import { DashboardCtx } from './models';
import './dashboard.scss';

import { result } from './utils';
import { DEFAULT_OPTIONS } from './constants';
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core';


export interface DashboardState {
  layout: Layout[];
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dashboard: {
      display: 'flex',
    }
  }),
);

export default function Dashboard(props: DashboardCtx) {
  const theme = useTheme();
  const classes = useStyles(theme);

  console.log(props);

  const generateDOM = (): JSX.Element[] => {
    return map((i) => {
      return (
        <div key={i}>
          <span className="text">{i}</span>
        </div>
      );
    }, range(0, props.items));
  }

  const generateLayout = (): Layout[] => {
    const p = props;
    const layout = new Array(p.items);

    return mapIndexed((_, i) => {
      const value = result(p);

      const y: number = (value as any).y || ceil(Math.random() * 4) + 1;

      return {
        x: (i * 2) % 12,
        y: floor(i / 6) * y,
        w: 2,
        h: y,
        i: i.toString()
      };
    }, layout);
  }

  const onLayoutChange = (layout: Layout[]): void => {
    props.onLayoutChange(layout);
  }

  const layout = generateLayout();
  const state = { layout };

  return (
    <ReactGridLayout
      layout={state.layout}
      onLayoutChange={onLayoutChange}
      {...props}
    >
      {generateDOM()}
    </ReactGridLayout>
  );
}

Dashboard.defaultProps = DEFAULT_OPTIONS;