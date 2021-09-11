import * as React from "react";
import { Link, RouteComponentProps } from 'react-router-dom';

import TitleIcon from "../components/TitleIcon";

/**
 * Server overview page.
 *
 * @returns The page as a react component.
 */
function Overview(props: RouteComponentProps): React.ReactElement {
	return <div className="content unknown">
		<TitleIcon
			title="Unknown Page · Automated Scout 2022"
			icon="icon-progress.png"
		/>
		<h1>Whoops</h1>
		<h2>Looks like you took a wrong turn.</h2>
		<span>The page you are looking for (<code>{props.location.pathname}</code>) does not exist.</span>
		<span>You can try return to <Link to="/">the homepage</Link>.</span>
	</div>;
}

export default Overview;
