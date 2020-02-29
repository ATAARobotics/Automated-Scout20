const { Matrix } = require('ml-matrix');
const fs = require("fs");
const DB_USERNAME = fs.readFileSync('DB_USERNAME', "utf8");
const DB_PASSWORD = fs.readFileSync('DB_PASSWORD', "utf8");
const DB_ADDRESS = fs.readFileSync('DB_ADDRESS', "utf8");
const nano = require("nano")(`http://${DB_USERNAME}:${DB_PASSWORD}@${DB_ADDRESS}:5984`);
const moment = require("moment");

function getPointsEarned(full) {
    var totalPoints = 0;
    totalPoints += (full.autoCellsLow) * 2;
    totalPoints += (full.autoCellsHigh) * 4;
    totalPoints += (full.autoCellsInner) * 6;
    totalPoints += (full.teleopCellsLow) * 1;
    totalPoints += (full.teleopCellsHigh) * 2;
    totalPoints += (full.teleopCellsInner) * 3;
    if (full.movedBaseline == 1) {
        totalPoints += 5;
    }
    if (full.rotationControl == "1") {
        totalPoints += 10;
    }
    if (full.positionControl == "1") {
        totalPoints += 20;
    }
    if (full.selfClimb == "1") {
        totalPoints += 25;
    }
    if (full.selfPark == "1") {
        totalPoints += 5;
    }
    return totalPoints;
}

function addData(orig) {
    orig.totalCellsLow = orig.autoCellsLow + orig.teleopCellsLow;
    orig.totalCellsHigh = orig.autoCellsHigh + orig.teleopCellsHigh;
    orig.totalCellsInner = orig.autoCellsInner + orig.teleopCellsInner;
    orig.totalCells = orig.autoCellsLow + orig.teleopCellsLow + orig.autoCellsHigh + orig.teleopCellsHigh + orig.autoCellsInner + orig.teleopCellsInner;
    orig.autoCellSuccessPercent = +(((orig.autoCellsLow + orig.autoCellsHigh + orig.autoCellsInner) / (orig.autoCellsLow + orig.autoCellsHigh + orig.autoCellsInner + orig.autoCellsDropped) * 100).toFixed(2)) || 0;
    orig.teleopCellSuccessPercent = +(((orig.teleopCellsLow + orig.teleopCellsHigh + orig.teleopCellsInner) / (orig.teleopCellsLow + orig.teleopCellsHigh + orig.teleopCellsInner + orig.teleopCellsDropped) * 100).toFixed(2)) || 0;
    orig.totalCellSuccessPercent = + (((orig.autoCellsLow + orig.teleopCellsLow + orig.autoCellsHigh + orig.teleopCellsHigh + orig.autoCellsInner + orig.teleopCellsInner) / (orig.autoCellsLow + orig.teleopCellsLow + orig.autoCellsHigh + orig.teleopCellsHigh + orig.autoCellsInner + orig.teleopCellsInner + orig.autoCellsDropped + orig.teleopCellsDropped) * 100).toFixed(2)) || 0;
    orig.cellAssistPercent = +(((orig.teleopCellsAssist) / (orig.teleopCellsPickup) * 100).toFixed(2)) || 0;
    orig.pointsEarned = getPointsEarned(orig);
    return orig;
}

async function getTeamMatch (dbName, teamNumber, matchType, matchNumber) {
    try {
        const db = await nano.db.use(dbName);
        let teamMatch = await db.get(`${matchType}${matchNumber}_${teamNumber}`);
        return addData(teamMatch);
    } catch (err) {
        return err;
    }
}

async function getAllTeamMatches (dbName, teamNumber, matchType) {
    try {
        const db = await nano.db.use(dbName);
        if (!matchType) {
            var calculated = [];
            let data = await db.find({"selector": {"_id": {"$regex": `^[q,p][0-9]*_${teamNumber}*$`}}, limit: 10000});
            for (var i = 0; i < data.docs.length; i++) {
                calculated.push(addData(data.docs[i]));
            }
            return calculated;
        } else if (matchType == "p") {
            var calculated = [];
            let data = await db.find({"selector": {"_id": {"$regex": `^p[0-9]*_${teamNumber}*$`}}, limit: 10000});
            for (var i = 0; i < data.docs.length; i++) {
                calculated.push(addData(data.docs[i]));
            }
            return calculated;
        } else if (matchType == "q") {
            var calculated = [];
            let data = await db.find({"selector": {"_id": {"$regex": `^q[0-9]*_${teamNumber}*$`}}, limit: 10000});
            for (var i = 0; i < data.docs.length; i++) {
                calculated.push(addData(data.docs[i]));
            }
            return calculated;
        } else {
            return "Invalid match type"
        }
    } catch (err) {
        return err;
    }
}

async function getTeamPit (dbName, teamNumber) {
    try {
        const db = await nano.db.use(dbName);
        let revs = await db.get(`pit_${teamNumber}`, {revs_info: true});
        var allRevs = [];
        for (var i = 0; i<revs._revs_info.length; i++) {
            if (revs._revs_info[i].status == "available") {
                allRevs.push(await db.get(`pit_${teamNumber}`, {rev: revs._revs_info[i].rev, attachments: true}))
            }
        }
        return allRevs;
    } catch (err) {
        return err;
    }
}

async function getAll (dbName) {
    try {
        const db = await nano.db.use(dbName);
        var all = await db.find({"selector": {"_id": {"$regex": `^[q,p][0-9]*_[0-9]*$`}}, limit: 10000});
        var list = [];
        for (var i = 0; i < all.docs.length; i++) {
            list.push(addData(all.docs[i]))
        }
        return list
    } catch (err) {
        return err;
    }
}

function mode(arr){
    return arr.sort((a,b) =>
          arr.filter(v => v===a).length
        - arr.filter(v => v===b).length
    ).pop();
}

async function getTeamAverage (dbName, teamNumber, matchType) {
    try {
        let matches = await getAllTeamMatches(dbName, teamNumber, matchType);
        var movedBaseline = 0;
        var autoCellsPickup = 0;
        var autoCellsDropped = 0;
        var autoCellsLow = 0;
        var autoCellsHigh = 0;
        var autoCellsInner = 0;
        var autoCellsAssist = 0;
        var teleopCellsPickup = 0;
        var teleopCellsDropped = 0;
        var teleopCellsLow = 0;
        var teleopCellsHigh = 0;
        var teleopCellsInner = 0;
        var teleopCellsAssist = 0;
        var rotationControl = 0;
        var positionControl = 0;
        var selfClimb = 0;
        var selfPark = 0;
        var climbBalanced = 0;
        var speed = 0;
        var stability = 0;
        var defense = 0;
        var primaryDefense = 0;
        var anythingBreak = 0;
        var dead = 0;
        var totalCellsLow = 0;
        var totalCellsHigh = 0;
        var totalCellsInner = 0;
        var totalCells = 0;
        var autoCellSuccessPercent = 0;
        var teleopCellSuccessPercent = 0;
        var totalCellSuccessPercent = 0;
        var cellAssistPercent = 0;
        var pointsEarned = 0;
        var defenseNA = 0;
        for (i = 0; i < matches.length; i++) {
            var climbBalancedMatch = matches[i].selfClimb * matches[i].balanced;
            movedBaseline += matches[i].movedBaseline;
            autoCellsPickup += matches[i].autoCellsPickup;
            autoCellsDropped += matches[i].autoCellsDropped;
            autoCellsLow += matches[i].autoCellsLow;
            autoCellsHigh += matches[i].autoCellsHigh;
            autoCellsInner += matches[i].autoCellsInner;
            autoCellsAssist += matches[i].autoCellsAssist;
            teleopCellsPickup += matches[i].teleopCellsPickup;
            teleopCellsDropped += matches[i].teleopCellsDropped;
            teleopCellsLow += matches[i].teleopCellsLow;
            teleopCellsHigh += matches[i].teleopCellsHigh;
            teleopCellsInner += matches[i].teleopCellsInner;
            teleopCellsAssist += matches[i].teleopCellsAssist;
            rotationControl += matches[i].rotationControl;
            positionControl += matches[i].positionControl;
            selfClimb += matches[i].selfClimb;
            selfPark += matches[i].selfPark;
            climbBalanced += climbBalancedMatch;
            speed += matches[i].speed;
            stability += matches[i].stability;
            if (matches[i].defense != 0) {
                defense += matches[i].defense;
            } else {
                defenseNA++;
            }
            primaryDefense += matches[i].primaryDefense;
            anythingBreak += matches[i].anythingBreak;
            dead += matches[i].dead;
            totalCellsLow += matches[i].totalCellsLow;
            totalCellsHigh += matches[i].totalCellsHigh;
            totalCellsInner += matches[i].totalCellsInner;
            totalCells += matches[i].totalCells;
            autoCellSuccessPercent += matches[i].autoCellSuccessPercent;
            teleopCellSuccessPercent += matches[i].teleopCellSuccessPercent;
            totalCellSuccessPercent += matches[i].totalCellSuccessPercent;
            cellAssistPercent += matches[i].cellAssistPercent;
            pointsEarned += matches[i].pointsEarned;
        }
        return {
            teamNumber: teamNumber,
            movedBaseline: +((movedBaseline / matches.length) * 100).toFixed(2) || 0,
            autoCellsPickup: +(autoCellsPickup / matches.length).toFixed(2) || 0,
            autoCellsDropped: +(autoCellsDropped / matches.length).toFixed(2) || 0,
            autoCellsLow: +(autoCellsLow / matches.length).toFixed(2) || 0,
            autoCellsHigh: +(autoCellsHigh / matches.length).toFixed(2) || 0,
            autoCellsInner: +(autoCellsInner / matches.length).toFixed(2) || 0,
            autoCellsAssist: +(autoCellsAssist / matches.length).toFixed(2) || 0,
            teleopCellsPickup: +(teleopCellsPickup / matches.length).toFixed(2) || 0,
            teleopCellsDropped: +(teleopCellsDropped / matches.length).toFixed(2) || 0,
            teleopCellsLow: +(teleopCellsLow / matches.length).toFixed(2) || 0,
            teleopCellsHigh: +(teleopCellsHigh / matches.length).toFixed(2) || 0,
            teleopCellsInner: +(teleopCellsInner / matches.length).toFixed(2) || 0,
            teleopCellsAssist: +(teleopCellsAssist / matches.length).toFixed(2) || 0,
            rotationControl: +((rotationControl / matches.length) * 100).toFixed(2) || 0,
            positionControl: +((positionControl / matches.length) * 100).toFixed(2) || 0,
            selfClimb: +((selfClimb / matches.length) * 100).toFixed(2) || 0,
            selfPark: +((selfPark / matches.length) * 100).toFixed(2) || 0,
            climbBalanced: +((climbBalanced / matches.length) * 100).toFixed(2) || 0,
            speed: +(speed / matches.length).toFixed(2) || 0,
            stability: +(stability / matches.length).toFixed(2) || 0,
            defense: +(defense / (matches.length - defenseNA)).toFixed(2) || 0,
            primaryDefense: +(primaryDefense / matches.length * 100).toFixed(2) || 0,
            defenseNA: +((defenseNA / matches.length) * 100).toFixed(2) || 0,
            anythingBreak: +((anythingBreak / matches.length) * 100).toFixed(2) || 0,
            dead: +((dead / matches.length) * 100).toFixed(2) || 0,
            totalCellsLow: +(totalCellsLow / matches.length).toFixed(2) || 0,
            totalCellsHigh: +(totalCellsHigh / matches.length).toFixed(2) || 0,
            totalCellsInner: +(totalCellsInner / matches.length).toFixed(2) || 0,
            totalCells: +(totalCells / matches.length).toFixed(2) || 0,
            autoCellSuccessPercent: +(autoCellSuccessPercent / matches.length).toFixed(2) || 0,
            teleopCellSuccessPercent: +(teleopCellSuccessPercent / matches.length).toFixed(2) || 0,
            totalCellSuccessPercent: +(totalCellSuccessPercent / matches.length).toFixed(2) || 0,
            cellAssistPercent: +(cellAssistPercent / matches.length).toFixed(2) || 0,
            pointsEarned: +(pointsEarned / matches.length).toFixed(2) || 0
        }
    } catch (err) {
        return err;
    }
}
async function getPointCont (dbName, teams, matchType) {
    try {
        var teamPointCont = {};
        const db = await nano.db.use(dbName);
        for (var i = 0; i < teams.length; i++) {
            if (!matchType) {
                var teamPoints = 0;
                let data = await db.find({"selector": {"_id": {"$regex": `^[q,p][0-9]*_${teams[i].team_number}*$`}}, limit: 10000});
                for (var b = 0; b < data.docs.length; b++) {
                    teamPoints += getPointsEarned(data.docs[b]);
                }
                teamPointCont[teams[i].key] = +(teamPoints / data.docs.length).toFixed(2)
            } else if (matchType == "p") {
                var teamPoints = 0;
                let data = await db.find({"selector": {"_id": {"$regex": `^p[0-9]*_${teams[i].team_number}*$`}}, limit: 10000});
                for (var p = 0; p < data.docs.length; p++) {
                    teamPoints += getPointsEarned(data.docs[p]);
                }
                teamPointCont[teams[i].key] = +(teamPoints / data.docs.length).toFixed(2)
            } else if (matchType == "q") {
                var teamPoints = 0;
                let data = await db.find({"selector": {"_id": {"$regex": `^q[0-9]*_${teams[i].team_number}*$`}}, limit: 10000});
                for (var q = 0; q < data.docs.length; q++) {
                    teamPoints += getPointsEarned(data.docs[q]);
                }
                teamPointCont[teams[i].key] = +(teamPoints / data.docs.length).toFixed(2)
            } else {
                return "Invalid match type"
            }
        }
        return teamPointCont;
    } catch (err) {
        return err;
    }
}

async function getAlliancePrediction (dbName, red, blue) {
    var redScore = 0;
    var blueScore = 0;
    for (var i = 0; i < red.length; i++) {
        try {
            var points = await getTeamAverage(dbName, red[i]);
            redScore += points.pointsEarned;
        } catch {
            redScore = null;
            break;
        }
    }
    if (blue) {
        for (var i = 0; i < blue.length; i++) {
            try {
                var points = await getTeamAverage(dbName, blue[i]);
                blueScore += points.pointsEarned;
            } catch {
                blueScore = null;
                break;
            }
        }
    }
    return {
        red: +redScore.toFixed(1),
        blue: +blueScore.toFixed(1)
    }
}

/* async function getDefenseOffensivePowerRanking (dbName, team, alliance) {
    
    var matchSchedule = new.matrix()
    
}
*/ 

module.exports = {
    getTeamMatch,
    getAllTeamMatches,
    getTeamPit,
    getAll,
    getTeamAverage,
    getPointCont,
    getAlliancePrediction
}