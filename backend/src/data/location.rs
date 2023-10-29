use crate::{
    app::Application,
    core::esi::{ESIError, ESIScope},
};
use eve_data_core::TypeID;

pub async fn get_location(app: &Application, character_id: i64) -> Result<locationData, ESIError> {
    let path = format!("/v2/characters/{}/location/", character_id);
    let result = app
        .esi_client
        .get(&path, character_id, ESIScope::Current_Location)
        .await?;
	println!("get_location result: {:?}", result);
	Ok()
}
