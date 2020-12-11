import {
  fetchMarketing,
  marketingAdapter,
  marketingReducer,
} from "./marketing.slice";

describe("marketing reducer", () => {
  it("should handle initial state", () => {
    const expected = marketingAdapter.getInitialState({
      loadingStatus: "not loaded",
      error: null,
    });

    expect(marketingReducer(undefined, { type: "" })).toEqual(expected);
  });

  it("should handle fetchMarketings", () => {
    let state = marketingReducer(undefined, fetchMarketing.pending(null, null));

    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: "loading",
        error: null,
        entities: {},
      })
    );

    state = marketingReducer(
      state,
      fetchMarketing.fulfilled([{ id: 1 }], null, null)
    );

    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: "loaded",
        error: null,
        entities: { 1: { id: 1 } },
      })
    );

    state = marketingReducer(
      state,
      fetchMarketing.rejected(new Error("Uh oh"), null, null)
    );

    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: "error",
        error: "Uh oh",
        entities: { 1: { id: 1 } },
      })
    );
  });
});
