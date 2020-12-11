import React from "react";
import { render } from "@testing-library/react";

import DrawerList from "./drawer-list";

describe("DrawerList", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<DrawerList items={[{ text: 'Inbox', link: 'index' }, { text: 'Starred', link: 'starred' }, { text: 'Send Email', link: 'sendEmail' }, { text: 'Drafts', link: 'drafts' }]} />);
    expect(baseElement).toBeTruthy();
  });
});
