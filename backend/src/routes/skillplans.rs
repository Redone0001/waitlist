use eve_data_core::{SkillLevel, TypeDB, TypeID};
use rocket::serde::json::Json;
use serde::Serialize;

use crate::{
    core::auth::AuthenticatedAccount,
    data::skillplans::{self, SkillPlan, SkillPlanError, SkillPlanLevel},
    util::types::Hull,
};

#[derive(Debug, Serialize)]
struct SkillPlansResponse {
    plans: Vec<SkillPlansResponsePlan>,
}

#[derive(Debug, Serialize)]
struct SkillPlansResponsePlan {
    source: SkillPlan,
    levels: Vec<(TypeID, SkillLevel)>,
    ships: Vec<Hull>,
}

fn build_data() -> Result<SkillPlansResponse, SkillPlanError> {
    let plans = skillplans::load_plans_from_file();
    let mut result = Vec::new();

    for plan in plans {
        let levels = match skillplans::build_plan(&plan) {
            Ok(levels) => levels,
            Err(e) => {
                eprintln!("Warning: Failed to build plan '{}': {}", plan.name, e);
                continue; // ✅ Skip the plan instead of failing everything
            }
        };

        let mut ships = Vec::new();
        for level in &plan.plan {
            match level {
                SkillPlanLevel::Skills { from, tier: _ } => {
                    if let Ok(ship_id) = TypeDB::id_of(from) {
                        if !ships.contains(&ship_id) {
                            ships.push(ship_id);
                        }
                    } else {
                        eprintln!("Warning: Ship '{}' not found in TypeDB", from);
                    }
                }
                SkillPlanLevel::Fit { hull, fit: _ } => {
                    if let Ok(ship_id) = TypeDB::id_of(hull) {
                        if !ships.contains(&ship_id) {
                            ships.push(ship_id);
                        }
                    } else {
                        eprintln!("Warning: Hull '{}' not found in TypeDB", hull);
                    }
                }
                _ => (),
            }
        }

        let ships_lookup = match TypeDB::load_types(&ships) {
            Ok(lookup) => lookup,
            Err(e) => {
                eprintln!("Warning: Failed to load ship types: {}", e);
                continue; // ✅ Skip this plan instead of panicking
            }
        };

        let mut hulls = Vec::new();
        for ship in ships {
            if let Some(Some(hull)) = ships_lookup.get(&ship) {
                hulls.push(Hull {
                    id: ship,
                    name: hull.name.clone(),
                });
            } else {
                eprintln!("Warning: Ship ID {} is missing in lookup", ship);
            }
        }

        result.push(SkillPlansResponsePlan {
            source: plan,
            levels,
            ships: hulls,
        });
    }

    Ok(SkillPlansResponse { plans: result })
}


lazy_static::lazy_static! {
    static ref PLAN_DATA: SkillPlansResponse = build_data().unwrap();
}

#[get("/api/skills/plans")]
fn get_skill_plans(_account: AuthenticatedAccount) -> Json<&'static SkillPlansResponse> {
    Json(&PLAN_DATA)
}

pub fn routes() -> Vec<rocket::Route> {
    routes![get_skill_plans]
}
