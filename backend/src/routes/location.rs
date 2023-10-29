use eve_data_core::TypeID;
use rocket::serde::json::Json;
use serde::Serialize;

use crate::{
    app::Application,
    core::auth::{authorize_character, AuthenticatedAccount},
    util::madness::Madness,
	data::location
};

#[derive(Serialize, Debug)]
struct LocationResponse {
    location: Vec<TypeID>,
}

#[get("/api/location?<character_id>")]
async fn get_location(
    app: &rocket::State<Application>,
    account: AuthenticatedAccount,
    character_id: i64,
) -> Result<Json<LocationResponse>, Madness> {
    authorize_character(app.get_db(), &account, character_id, None).await?;

    let fetched = location::get_location(app, character_id).await?;
    Ok(Json(LocationResponse { location: fetched }))
}

pub fn routes() -> Vec<rocket::Route> {
    routes![get_location]
}
