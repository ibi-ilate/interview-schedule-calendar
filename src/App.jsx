import React, { useEffect, useMemo, useState } from "react";

/**
 * Interview Calendar - React version
 *
 * - Days: Mon-Fri
 * - Times: 09:00 - 17:30 (30min increments)
 * - engineerAvailability: object map of engineer -> [ "Day HH:MM", ... ]
 * - Candidate select option values are "DAY START-END" (e.g. "Tue 14:00-15:00")
 *
 * Behavior:
 * - Click a slot to select it
 * - Select candidate availability range -> highlights candidate slots
 * - Overlap slots (engineer + candidate) show .overlap
 * - Confirm button checks and shows confirmation or an error
 */

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const generateTimes = () => {
  const times = [];
  for (let h = 9; h < 18; h++) {
    times.push(`${String(h).padStart(2, "0")}:00`);
    times.push(`${String(h).padStart(2, "0")}:30`);
  }
  return times;
};

const TIMES = generateTimes();

const DEFAULT_ENGINEER_AVAILABILITY = {
  "Engineer A": ["Mon 09:00", "Tue 14:00", "Wed 10:00"],
  "Engineer B": ["Tue 14:00", "Wed 11:00", "Fri 13:00"],
  "Engineer C": ["Tue 15:00", "Thu 11:00", "Fri 13:30"],
};

// Example candidate ranges for the dropdown.
// value format: "DAY START-END" (same format the original script expected)
const CANDIDATE_OPTIONS = [
  { label: "Select candidate range...", value: "" },
  { label: "Candidate 1 — Mon 09:00-11:00", value: "Mon 09:00-11:00" },
  { label: "Candidate 2 — Tue 14:00-15:30", value: "Tue 14:00-15:30" },
  { label: "Candidate 3 — Wed 10:00-12:00", value: "Wed 10:00-12:00" },
  { label: "Candidate 4 — Fri 13:00-14:00", value: "Fri 13:00-14:00" },
];

export default function App() {
  const [engineerAvailability] = useState(DEFAULT_ENGINEER_AVAILABILITY);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedCandidateOption, setSelectedCandidateOption] = useState("");
  const [selectedCandidateLabel, setSelectedCandidateLabel] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // computed map of engineer availability for quick lookup
  const engineerSlots = useMemo(() => {
    const map = new Set();
    Object.values(engineerAvailability).forEach((arr) =>
      arr.forEach((s) => map.add(s))
    );
    return map;
  }, [engineerAvailability]);

  // highlights state: we can compute classes on render rather than store all slot states
  const isEngineerAvailable = (slotKey) => engineerSlots.has(slotKey);

  // candidate parsing helpers
  const toMinutes = (timeStr) => {
    const [hh, mm] = timeStr.split(":").map(Number);
    return hh * 60 + mm;
  };

  // given selectedCandidateOption, compute candidate day + start/end in minutes
  const candidateRange = useMemo(() => {
    if (!selectedCandidateOption) return null;
    // format: "Tue 14:00-15:30"
    const [day, range] = selectedCandidateOption.split(" ");
    if (!day || !range) return null;
    const [start, end] = range.split("-");
    return {
      day,
      start,
      end,
      startM: toMinutes(start),
      endM: toMinutes(end),
    };
  }, [selectedCandidateOption]);

  // when candidate selection changes, set label and clear previous messages
  useEffect(() => {
    setConfirmation("");
    setErrorMessage("");
    const found = CANDIDATE_OPTIONS.find((o) => o.value === selectedCandidateOption);
    setSelectedCandidateLabel(found ? found.label.split(" — ")[0] : "");
    // also clear selectedSlot (optional)
    // setSelectedSlot(null);
  }, [selectedCandidateOption]);

  // helper to check if a slot is within candidate range
  const isSlotInCandidateRange = (slotKey) => {
    if (!candidateRange) return false;
    const [slotDay, slotTime] = slotKey.split(" ");
    if (slotDay !== candidateRange.day) return false;
    const t = toMinutes(slotTime);
    return t >= candidateRange.startM && t < candidateRange.endM;
  };

  // Confirm interview logic (matches original logic)
  const confirmInterview = () => {
    setErrorMessage("");
    setConfirmation("");

    if (!selectedCandidateOption) {
      setErrorMessage("Please select a candidate time range.");
      return;
    }

    if (!selectedSlot) {
      setErrorMessage("Please select a time slot.");
      return;
    }

    // determine if selected slot is overlap (engineer + candidate)
    const slotDivKey = selectedSlot; // e.g. "Tue 14:00"
    const overlap = isEngineerAvailable(slotDivKey) && isSlotInCandidateRange(slotDivKey);

    if (!overlap) {
      setErrorMessage("Selected time is not available for both candidate and engineers.");
      return;
    }

    // find which engineer(s) are available for that slot
    let assignedEngineer = "Unknown Engineer";
    for (const [eng, slots] of Object.entries(engineerAvailability)) {
      if (slots.includes(slotDivKey)) {
        assignedEngineer = eng;
        break;
      }
    }

    setConfirmation(
      `Interview confirmed with ${selectedCandidateLabel || "Candidate"} and ${assignedEngineer} at ${selectedSlot}.`
    );
  };

  // render
  return (
    <div className="app-root">
      <div className="panel">
        <h1>Interview Scheduling</h1>

        <div className="controls">
          <label>
            Candidate availability:
            <select
              id="candidate"
              value={selectedCandidateOption}
              onChange={(e) => setSelectedCandidateOption(e.target.value)}
            >
              {CANDIDATE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <div className="legend">
            <span className="legend-item">
              <span className="dot engineer-available" /> Engineer
            </span>
            <span className="legend-item">
              <span className="dot candidate-available" /> Candidate
            </span>
            <span className="legend-item">
              <span className="dot overlap" /> Overlap
            </span>
          </div>
        </div>

        <div id="calendar" className="calendar-grid">
          {DAYS.map((day) => (
            <div key={day} className="day-column">
              <div className="day-header">{day}</div>
              {TIMES.map((time) => {
                const slotKey = `${day} ${time}`;
                const engAvail = isEngineerAvailable(slotKey);
                const candAvail = isSlotInCandidateRange(slotKey);
                const overlap = engAvail && candAvail;
                const selected = selectedSlot === slotKey;

                const classes = [
                  "slot",
                  engAvail ? "engineer-available" : "",
                  candAvail ? "candidate-available" : "",
                  overlap ? "overlap" : "",
                  selected ? "selected" : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <div
                    key={slotKey}
                    className={classes}
                    data-slot={slotKey}
                    onClick={() => {
                      setSelectedSlot(slotKey);
                      setConfirmation("");
                      setErrorMessage("");
                    }}
                  >
                    <div className="slot-time">{time}</div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="actions">
          <button onClick={confirmInterview}>Confirm Interview</button>
          <div id="errorMessage" className="error">
            {errorMessage}
          </div>
          <div id="confirmation" className="confirmation">
            {confirmation}
          </div>
        </div>
      </div>
    </div>
  );
}
