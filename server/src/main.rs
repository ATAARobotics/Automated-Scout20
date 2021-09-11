use warp::Filter;

#[tokio::main]
async fn main() {
	let dist = warp::path("dist").and(warp::fs::dir("../client/dist"));
	let assets = warp::any().and(warp::fs::dir("../client/assets"));

	let routes = warp::get().and(dist.or(assets));

	warp::serve(routes).run(([0, 0, 0, 0], 9060)).await;
}
