use actix_web::http::header::ContentType;
use actix_web::http::{header, StatusCode};
use actix_web::web::Data;
use actix_web::{options, put, web, App, HttpResponse, HttpServer};
use futures_util::stream::StreamExt as _;
use serde::Deserialize;
use simplelog::TermLogger;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
enum MatchType {
	Qualification,
	Practice,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
enum StartingLocation {
	Left,
	Middle,
	Right,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Auto {
	exited_tarmac: bool,
	starting_location: Option<StartingLocation>,
	cells_acquired: u32,
	cells_dropped: u32,
	low_goal_shots: u32,
	high_goal_shots: u32,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Teleop {
	cells_acquired: u32,
	cells_dropped: u32,
	low_goal_shots: u32,
	high_goal_shots: u32,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Climb {
	highest_attempted: u32,
	highest_scored: u32,
	fell: bool,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct MatchInfo {
	#[serde(rename = "match")]
	match_number: u32,
	match_category: Option<MatchType>,
	team: Option<u32>,
	auto: Auto,
	teleop: Teleop,
	climb: Climb,
	speed: Option<f32>,
	stability: Option<f32>,
	defense: Option<f32>,
	is_primary_defence: Option<bool>,
	was_broken: Option<bool>,
	was_disabled: Option<bool>,
	notes: Option<String>,
}

#[put("/api/push")]
async fn push_data(mut body: web::Payload) -> HttpResponse {
	// FIXME: for some reason web::Json isn't working.
	let mut bytes = web::BytesMut::new();
	while let Some(item) = body.next().await {
		bytes.extend_from_slice(&item.unwrap());
	}
	let string = String::from_utf8(bytes.to_vec()).unwrap();
	let json: Vec<MatchInfo> = serde_json::from_str(&string).unwrap();
	println!("Got some info: {:?}", json);

	HttpResponse::build(StatusCode::OK)
		.content_type(ContentType::json())
		.append_header((header::ACCESS_CONTROL_ALLOW_ORIGIN, "*"))
		.append_header(("X-My-Awesome-Header", "123"))
		.body(r#"{"success": true}"#)
}

#[options("/api/push")]
async fn push_options(data: Data<()>, params: ()) -> HttpResponse {
	HttpResponse::build(StatusCode::OK)
		.append_header((header::ACCESS_CONTROL_ALLOW_ORIGIN, "*"))
		.append_header((header::ACCESS_CONTROL_ALLOW_METHODS, "PUT"))
		.append_header((header::ACCESS_CONTROL_ALLOW_HEADERS, "Content-Type"))
		.body("")
}

#[tokio::main]
async fn main() {
	TermLogger::init(
		simplelog::LevelFilter::Trace,
		simplelog::ConfigBuilder::new()
			.add_filter_allow("automated-scout".to_string())
			.add_filter_allow("actix_web".to_string())
			.build(),
		simplelog::TerminalMode::Stderr,
		simplelog::ColorChoice::Always,
	)
	.unwrap();
	HttpServer::new(move || {
		App::new()
			.app_data(Data::new(()))
			.service(push_data)
			.service(push_options)
	})
	.bind("0.0.0.0:4421")
	.unwrap()
	.run()
	.await
	.unwrap();
}
