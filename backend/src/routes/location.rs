use eve_data_core::TypeID;
use rocket::serde::json::Json;
use serde::Serialize;

use crate::{
    app::Application,
    core::auth::{authorize_character, AuthenticatedAccount},
    data::implants,
    util::madness::Madness,
};

#[derive(Serialize, Debug)]
struct ImplantsResponse {
    implants: Vec<TypeID>,
}

#[get("/api/location?<character_id>")]
async fn get_location(
    app: &rocket::State<Application>,
    account: AuthenticatedAccount,
    character_id: i64,
) -> Result<Json<ImplantsResponse>, Madness> {
    authorize_character(app.get_db(), &account, character_id, None).await?;

    let fetched = location::get_location(app, character_id).await?;
    Ok(ImplantsResponse { location: fetched })
}

pub fn routes() -> Vec<rocket::Route> {
    routes![get_location]
}
