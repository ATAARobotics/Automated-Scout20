use crate::data::{MatchInfo, MatchType};
use std::array::TryFromSliceError;
use std::path::Path;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum DatabaseError {
	#[error("Internal database error: {0}")]
	Sled(#[from] sled::Error),
	#[error("Failed to decode data in database: {0}")]
	Serde(#[from] bincode::Error),
	#[error("Failed to decode data in database: {0}")]
	TryFromSlice(#[from] TryFromSliceError),
}

#[derive(Debug, Clone)]
pub struct Database {
	backend: sled::Db,
}

pub struct MatchIter {
	inner: sled::Iter,
}

impl MatchIter {
	fn from_sled(iter: sled::Iter) -> Self {
		MatchIter { inner: iter }
	}
}

impl Iterator for MatchIter {
	type Item = Result<MatchInfo, DatabaseError>;

	fn next(&mut self) -> Option<Self::Item> {
		self.inner.next().map(|i| {
			let (_key, value) = i?;
			bincode::deserialize(&value).map_err(DatabaseError::Serde)
		})
	}
}

impl Database {
	pub fn open(file: &Path) -> Self {
		Database {
			backend: sled::open(file).unwrap(),
		}
	}
	pub fn get_match_id(match_info: &MatchInfo) -> Vec<u8> {
		Vec::from(format!(
			"match_{}_{:?}",
			match_info.match_number, match_info.match_category
		))
	}
	pub fn write_match(&self, match_info: &MatchInfo) -> Result<(), DatabaseError> {
		let id = Self::get_match_id(match_info);
		let data = bincode::serialize(match_info)?;
		self.backend.insert(id, data)?;
		Ok(())
	}
	pub fn get_match(
		&self,
		match_number: u32,
		match_category: MatchType,
	) -> Result<Option<MatchInfo>, DatabaseError> {
		let id = Vec::from(format!("match_{}_{:?}", match_number, match_category));
		let data = self.backend.get(&id)?;
		Ok(match data {
			Some(data) => Some(bincode::deserialize(&data)?),
			None => None,
		})
	}
	pub fn get_all_matches(&self) -> MatchIter {
		MatchIter::from_sled(self.backend.scan_prefix(b"match_"))
	}
}
