import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  createAction,
  EntityState,
  PayloadAction,
} from "@reduxjs/toolkit";

export const MARKETING_FEATURE_KEY = "marketing";

/*
 * Update these interfaces according to your requirements.
 */
export interface MarketingEntity {
  id: number;
}

export interface MarketingState extends EntityState<MarketingEntity> {
  loadingStatus: "not loaded" | "loading" | "loaded" | "error";
  error: string;
  drawerOpen: boolean;
}

export const marketingAdapter = createEntityAdapter<MarketingEntity>();

/**
 * Export an effect using createAsyncThunk from
 * the Redux Toolkit: https://redux-toolkit.js.org/api/createAsyncThunk
 *
 * e.g.
 * ```
 * import React, { useEffect } from 'react';
 * import { useDispatch } from 'react-redux';
 *
 * // ...
 *
 * const dispatch = useDispatch();
 * useEffect(() => {
 *   dispatch(fetchMarketing())
 * }, [dispatch]);
 * ```
 */
export const fetchMarketing = createAsyncThunk(
  "marketing/fetchStatus",
  async (_, thunkAPI) => {
    /**
     * Replace this with your custom fetch call.
     * For example, `return myApi.getMarketings()`;
     * Right now we just return an empty array.
     */
    return Promise.resolve([]);
  }
);

export const toggleDrawer = createAction('[LAYOUT] toggle drawer', ( drawerOpen: boolean ) => ({ payload: drawerOpen }));

export const initialMarketingState: MarketingState = marketingAdapter.getInitialState(
  {
    loadingStatus: "not loaded",
    error: null,
    drawerOpen: false
  }
);

export const marketingSlice = createSlice({
  name: MARKETING_FEATURE_KEY,
  initialState: initialMarketingState,
  reducers: {
    add: marketingAdapter.addOne,
    remove: marketingAdapter.removeOne,
    toggleDrawer: (state: MarketingState, { payload }: PayloadAction<boolean>) => {
        state.drawerOpen = payload;
    }

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarketing.pending, (state: MarketingState) => {
        state.loadingStatus = "loading";
      })
      .addCase(
        fetchMarketing.fulfilled,
        (state: MarketingState, action: PayloadAction<MarketingEntity[]>) => {
          marketingAdapter.setAll(state, action.payload);
          state.loadingStatus = "loaded";
        }
      )
      .addCase(fetchMarketing.rejected, (state: MarketingState, action) => {
        state.loadingStatus = "error";
        state.error = action.error.message;
      });
  },
});

/*
 * Export reducer for store configuration.
 */
export const marketingReducer = marketingSlice.reducer;

/*
 * Export action creators to be dispatched. For use with the `useDispatch` hook.
 *
 * e.g.
 * ```
 * import React, { useEffect } from 'react';
 * import { useDispatch } from 'react-redux';
 *
 * // ...
 *
 * const dispatch = useDispatch();
 * useEffect(() => {
 *   dispatch(marketingActions.add({ id: 1 }))
 * }, [dispatch]);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#usedispatch
 */
export const marketingActions = marketingSlice.actions;

export type MarketingActions = typeof marketingActions;

/*
 * Export selectors to query state. For use with the `useSelector` hook.
 *
 * e.g.
 * ```
 * import { useSelector } from 'react-redux';
 *
 * // ...
 *
 * const entities = useSelector(selectAllMarketing);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#useselector
 */
const { selectAll, selectEntities } = marketingAdapter.getSelectors();

export const getMarketingState = (rootState: unknown): MarketingState =>
  rootState[MARKETING_FEATURE_KEY];

export const selectAllMarketing = createSelector(getMarketingState, selectAll);

export const selectMarketingEntities = createSelector(
  getMarketingState,
  selectEntities
);

export const selectDrawerOpen = createSelector(getMarketingState, (state) => state.drawerOpen);