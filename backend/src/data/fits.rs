//use regex::Regex;
use std::collections::{BTreeMap, BTreeSet};

use eve_data_core::{Fitting, TypeID};

type FitData = BTreeMap<TypeID, Vec<DoctrineFit>>;

lazy_static::lazy_static! {
    static ref FITS: FitData = load_fits();
}

#[derive(Debug)]
pub struct DoctrineFit {
    pub name: String,
    pub fit: Fitting,
}

fn load_fits() -> FitData {
    let mut fits = BTreeMap::new();

    let folder_path = "./data/saved_fits/";

    let entries = std::fs::read_dir(folder_path).unwrap();

    for entry in entries {
        let file_path = entry.unwrap().path();
        let fit_name = file_path.file_stem().unwrap().to_string_lossy();
		let fit_data = match std::fs::read_to_string(&file_path) {
            Ok(data) => data,
            Err(e) => {
                eprintln!("Warning: Failed to read fit file '{}': {}", file_path.display(), e);
                continue;
            }
        };

        match Fitting::from_eft(fit_data.as_str()) {
            Ok(fittings) => {
                if let Some(parsed) = fittings.into_iter().nth(0) {
                    fits.entry(parsed.hull)
                        .or_insert_with(Vec::new)
                        .push(DoctrineFit {
                            name: fit_name.to_string(),
                            fit: parsed,
                        });
                } else {
                    eprintln!("Warning: No valid fits found in file '{}'", file_path.display());
                }
            }
            Err(e) => {
                eprintln!("Warning: Failed to parse fit file '{}': {}", file_path.display(), e);
            }
        }
    }

    fits
}

pub fn get_fits() -> &'static FitData {
    &FITS
}

pub fn used_module_ids() -> Vec<TypeID> {
    let mut ids = BTreeSet::new();
    for (&hull, fits) in get_fits() {
        ids.insert(hull);
        for fit in fits {
            for &id in fit.fit.modules.keys() {
                ids.insert(id);
            }
            for &id in fit.fit.cargo.keys() {
                ids.insert(id);
            }
        }
    }
    ids.into_iter().collect()
}

#[cfg(test)]
mod tests {
    #[test]
    fn test_load_fits() {
        let _loaded = super::get_fits();
    }
}
