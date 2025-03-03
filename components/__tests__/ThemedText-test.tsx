import * as React from "react";
import renderer from "react-test-renderer";

import { ThemedText } from "../ui/ThemedText";

it(`renders correctly`, () => {
  const tree = renderer.create(<ThemedText variant="extra-large">Snapshot test!</ThemedText>).toJSON();

  expect(tree).toMatchSnapshot();
});
