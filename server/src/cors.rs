use warp::http::header::{
    ACCESS_CONTROL_ALLOW_CREDENTIALS, ACCESS_CONTROL_ALLOW_ORIGIN, ACCESS_CONTROL_EXPOSE_HEADERS,
};
use warp::Reply;

pub(crate) fn allow_credentials(reply: impl warp::Reply) -> impl warp::Reply {
    warp::reply::with_header(reply, ACCESS_CONTROL_ALLOW_CREDENTIALS, "true")
}

pub(crate) fn allow_origin(reply: impl warp::Reply, origin: String) -> impl warp::Reply {
    warp::reply::with_header(reply, ACCESS_CONTROL_ALLOW_ORIGIN, origin)
}

pub(crate) fn expose_all_headers(reply: impl warp::Reply) -> impl warp::Reply {
    let reply = reply.into_response();
    let response_headers = reply
        .headers()
        .keys()
        .map(|k| k.as_str())
        .collect::<Vec<&str>>()
        .join(", ");

    if response_headers.is_empty() {
        reply
    } else {
        warp::reply::with_header(reply, ACCESS_CONTROL_EXPOSE_HEADERS, response_headers)
            .into_response()
    }
}