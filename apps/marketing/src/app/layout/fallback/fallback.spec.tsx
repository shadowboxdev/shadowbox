import React from "react";
import { render } from "@testing-library/react";

import Fallback from "./fallback";

describe("Fallback", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<Fallback />);
    expect(baseElement).toBeTruthy();
  });
});
