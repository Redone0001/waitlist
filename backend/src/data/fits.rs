use regex::Regex;
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

    let folder_path = "./data/saved_fits/"

    let entries = std::fs::read_dir(folder_path).unwrap();

    for entry in entries {
        let file_path = entry.unwrap().path();
        let fit_name = file_path.file_stem().unwrap().to_string_lossy();
        let fit_data = std::fs::read_to_string(&file_path).unwrap();
        let fittings = from_eft(&fit_data).unwrap();
        let parsed = fittings.first().unwrap();
        fits.entry(parsed.hull)
            .or_insert_with(Vec::new)
            .push(DoctrineFit {
                name: fit_name.to_string(),
                fit: parsed,
            });
    }
/* 
    let fit_data = std::fs::read_to_string("./data/fits.dat").expect("Could not load fits.dat");
    let fit_regex = Regex::new(r#"<a href="fitting:([0-9:;_]+)">([^<]+)</a>"#).unwrap();

    for fit_match in fit_regex.captures_iter(&fit_data) {
        let dna = fit_match.get(1).unwrap().as_str();
        let fit_name = fit_match.get(2).unwrap().as_str();
        let parsed = Fitting::from_dna(dna).unwrap();
        fits.entry(parsed.hull)
            .or_insert_with(Vec::new)
            .push(DoctrineFit {
                name: fit_name.to_string(),
                fit: parsed,
            });
    }
*/
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
