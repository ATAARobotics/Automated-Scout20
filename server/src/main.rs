mod data;
mod database;

use crate::data::MatchInfo;
use crate::database::Database;
use actix_web::http::header::ContentType;
use actix_web::http::{header, StatusCode};
use actix_web::web::Data;
use actix_web::{get, options, put, web, App, HttpResponse, HttpServer};
use futures_util::stream::StreamExt as _;
use simplelog::TermLogger;
use std::path::PathBuf;
use std::str::FromStr;
use std::sync::Arc;

#[options("/api/push")]
async fn push_options(_params: ()) -> HttpResponse {
	HttpResponse::build(StatusCode::OK)
		.append_header((header::ACCESS_CONTROL_ALLOW_ORIGIN, "*"))
		.append_header((header::ACCESS_CONTROL_ALLOW_METHODS, "PUT"))
		.append_header((header::ACCESS_CONTROL_ALLOW_HEADERS, "Content-Type"))
		.body("")
}

#[put("/api/push")]
async fn push_data(data: Data<Arc<Database>>, mut body: web::Payload) -> HttpResponse {
	// FIXME: for some reason web::Json isn't working.
	let mut bytes = web::BytesMut::new();
	while let Some(item) = body.next().await {
		bytes.extend_from_slice(&item.unwrap());
	}
	let string = String::from_utf8(bytes.to_vec()).unwrap();
	let json: Vec<MatchInfo> = serde_json::from_str(&string).unwrap();
	println!("Got some info: {:?}", json);
	for match_info in json {
		data.write_match(&match_info).unwrap();
	}

	HttpResponse::build(StatusCode::OK)
		.content_type(ContentType::json())
		.append_header((header::ACCESS_CONTROL_ALLOW_ORIGIN, "*"))
		.body(r#"{"success": true}"#)
}

#[get("/api/pull")]
async fn pull_data(data: Data<Arc<Database>>) -> HttpResponse {
	let matches: Vec<MatchInfo> = data.get_all_matches().map(|data| data.unwrap()).collect();
	let json = serde_json::to_string(&matches).unwrap();
	HttpResponse::build(StatusCode::OK)
		.content_type(ContentType::json())
		.append_header((header::ACCESS_CONTROL_ALLOW_ORIGIN, "*"))
		.body(format!("{{\"success\": true, \"data\": {}}}", json))
}

#[get("/api/csv")]
async fn get_csv(data: Data<Arc<Database>>) -> HttpResponse {
	let mut csv = MatchInfo::HEADER.to_string();
	for match_info in data.get_all_matches() {
		csv.push_str(&match_info.unwrap().write_csv_line());
	}
	HttpResponse::build(StatusCode::OK)
		.content_type(ContentType::plaintext())
		.append_header((header::ACCESS_CONTROL_ALLOW_ORIGIN, "*"))
		.body(csv)
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
	let database = Arc::new(Database::open(&PathBuf::from_str("database").unwrap()));
	HttpServer::new(move || {
		let database = database.clone();
		App::new()
			.app_data(Data::new(database))
			.service(push_data)
			.service(push_options)
			.service(pull_data)
			.service(get_csv)
	})
	.bind("0.0.0.0:4421")
	.unwrap()
	.run()
	.await
	.unwrap();
}
