use serde::{Deserialize, Serialize};
use std::fmt::{Display, Formatter};

#[derive(Debug, Copy, Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub enum MatchType {
	Qualification,
	Practice,
}

impl Display for MatchType {
	fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
		match self {
			MatchType::Qualification => write!(f, "Qualification"),
			MatchType::Practice => write!(f, "Practice"),
		}
	}
}

#[derive(Debug, Copy, Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub enum StartingLocation {
	Left,
	Middle,
	Right,
}

impl Display for StartingLocation {
	fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
		match self {
			StartingLocation::Left => write!(f, "Left"),
			StartingLocation::Middle => write!(f, "Middle"),
			StartingLocation::Right => write!(f, "Right"),
		}
	}
}

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Auto {
	pub exited_tarmac: bool,
	pub starting_location: Option<StartingLocation>,
	pub cells_acquired: u32,
	pub cells_dropped: u32,
	pub low_goal_shots: u32,
	pub high_goal_shots: u32,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Teleop {
	pub cells_acquired: u32,
	pub cells_dropped: u32,
	pub low_goal_shots: u32,
	pub high_goal_shots: u32,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Climb {
	pub highest_attempted: u32,
	pub highest_scored: u32,
	pub fell: bool,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MatchInfo {
	#[serde(rename = "match")]
	pub match_number: u32,
	pub match_category: MatchType,
	pub team: Option<u32>,
	pub auto: Auto,
	pub teleop: Teleop,
	pub climb: Climb,
	pub speed: Option<f32>,
	pub stability: Option<f32>,
	pub defense: Option<f32>,
	pub is_primary_defence: Option<bool>,
	pub was_broken: Option<bool>,
	pub was_disabled: Option<bool>,
	pub notes: Option<String>,
}

impl MatchInfo {
	pub const HEADER: &'static str = "match_number,match_category,team,auto_exited_tarmac,auto_starting_location,auto_cells_acquired,auto_cells_dropped,auto_low_goal_shots,auto_high_goal_shots,teleop_cells_acquired,teleop_cells_dropped,teleop_low_goal_shots,teleop_high_goal_shots,highest_climb_attempted,highest_climb_scored,fell,speed,stability,defense,is_primary_defence,was_broken,was_disabled,notes\n";
	pub fn write_csv_line(&self) -> String {
		vec![
			self.match_number.to_string(),
			self.match_category.to_string(),
			self.team
				.map(|t| t.to_string())
				.unwrap_or_else(|| "".to_string()),
			self.auto.exited_tarmac.to_string(),
			self.auto
				.starting_location
				.map(|s| s.to_string())
				.unwrap_or_else(|| "".to_string()),
			self.auto.cells_acquired.to_string(),
			self.auto.cells_dropped.to_string(),
			self.auto.low_goal_shots.to_string(),
			self.auto.high_goal_shots.to_string(),
			self.teleop.cells_acquired.to_string(),
			self.teleop.cells_dropped.to_string(),
			self.teleop.low_goal_shots.to_string(),
			self.teleop.high_goal_shots.to_string(),
			self.climb.highest_attempted.to_string(),
			self.climb.highest_scored.to_string(),
			self.climb.fell.to_string(),
			self.speed
				.map(|s| s.to_string())
				.unwrap_or_else(|| "".to_string()),
			self.stability
				.map(|s| s.to_string())
				.unwrap_or_else(|| "".to_string()),
			self.defense
				.map(|s| s.to_string())
				.unwrap_or_else(|| "".to_string()),
			self.is_primary_defence
				.map(|s| s.to_string())
				.unwrap_or_else(|| "".to_string()),
			self.was_broken
				.map(|s| s.to_string())
				.unwrap_or_else(|| "".to_string()),
			self.was_disabled
				.map(|s| s.to_string())
				.unwrap_or_else(|| "".to_string()),
			self.notes.clone().unwrap_or_else(|| "".to_string()),
		]
		.join(",") + "\n"
	}
}
