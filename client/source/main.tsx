import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

/**
 * Render the app.
 */
function render() {
	ReactDOM.render(
		<React.StrictMode>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</React.StrictMode>,
		document.getElementById("root"),
	);
}

window.addEventListener("load", render);
