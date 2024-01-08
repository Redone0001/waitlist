use rocket::serde::json::Json;
use serde::Serialize;
use std::collections::HashMap;

use crate::{
    app::Application,
    core::auth::{authorize_character, AuthenticatedAccount},
	data,
    util::madness::Madness,
};

#[derive(Serialize, Debug)]
struct LocationResponse {
    loc: HashMap<String, i64>,
}

#[get("/api/location?<character_id>")]
async fn list_location(
    app: &rocket::State<Application>,
    account: AuthenticatedAccount,
    character_id: i64,
) -> Result<Json<HashMap<String, i64>>, Madness> {
    authorize_character(app.get_db(), &account, character_id, None).await?;

    let fetched = data::location::get_location(app, character_id).await?;
    Ok(Json(fetched))
}

pub fn routes() -> Vec<rocket::Route> {
    routes![list_location]
}
