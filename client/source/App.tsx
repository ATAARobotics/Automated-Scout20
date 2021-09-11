import * as React from "react";
import { Switch, Route } from "react-router-dom";

import UnknownPage from "./pages/UnknownPage";

/**
 * Entry point component for the app.
 *
 * @returns The app as a react component.
 */
function App(): React.ReactElement {
	return <div className="app">
		<Switch>
			<Route path="/" component={UnknownPage} />
		</Switch>
	</div>;
}

export default App;
