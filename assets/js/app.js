// app.js - handles data, UI, LocalStorage and draw logic
$(function () {
  const STORAGE_KEY = "class_spinner_data_v1";
  const SAMPLE_FILE = "sample.json";

  function loadSampleToLocal() {
    return $.getJSON(SAMPLE_FILE).then(data => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return data;
    });
  }

  function getData() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }

  function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function ensureData() {
    let data = getData();
    if (!data) {
      return loadSampleToLocal().then(loadedData => {
        renderTable(loadedData);
      });
    } else {
      renderTable(data);
    }
  }

  function renderTable(data) {
    const $tableBody = $("#participantTable tbody");
    $tableBody.empty();
    data.forEach((row, index) => {
      const tableRow = $("<tr>").attr("data-id", row.id);
      tableRow.append(`<td class="align-middle">${index + 1}</td>`);
      tableRow.append(`<td class="align-middle"><input class="form-control id-number-input" data-field="idNumber" value="${escapeHtml(row.idNumber)}"></td>`);
      tableRow.append(`<td class="align-middle"><input class="form-control name-input" data-field="name" value="${escapeHtml(row.name)}"></td>`);
      tableRow.append(`<td class="text-center align-middle"><input type="checkbox" class="check-present" ${row.isPresent ? "checked" : ""}></td>`);
      tableRow.append(`<td class="text-center align-middle"><input type="checkbox" class="check-included" ${row.isIncluded ? "checked" : ""}></td>`);
      tableRow.append(`<td class="text-center align-middle count-selected">${row.timesSelected}</td>`);
      tableRow.append(`<td class="align-middle"><input type="number" min="0" class="form-control form-control-sm count-answered text-center" value="${row.timesAnswered}"></td>`);
      tableRow.append(`<td class="align-middle"><input type="number" min="0" class="form-control form-control-sm count-correct text-center" value="${row.timesCorrect}"></td>`);
      tableRow.append(`<td class="align-middle text-end"><button class="btn btn-sm btn-outline-danger btn-delete"><i class="bi bi-trash-fill"></i></button></td>`);
      $tableBody.append(tableRow);
    });
  }

  function escapeHtml(str) { return (str + "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  // update a single field then save
  $("#participantTable").on("change keyup", "input,textarea", function (e) {
    const $currentRow = $(this).closest("tr");
    const rowId = Number($currentRow.attr("data-id"));
    let data = getData();
    const participantRow = data.find(record => record.id === rowId);
    const classList = $(this).attr("class");
    if ($(this).is(":checkbox")) {
      if ($(this).hasClass("check-present")) participantRow.isPresent = $(this).prop("checked");
      if ($(this).hasClass("check-included")) participantRow.isIncluded = $(this).prop("checked");
    } else {
      const fieldName = $(this).data("field");
      if (fieldName) participantRow[fieldName] = $(this).val();
      else if ($(this).hasClass("count-answered")) participantRow.timesAnswered = Number($(this).val()) || 0;
      else if ($(this).hasClass("count-correct")) participantRow.timesCorrect = Number($(this).val()) || 0;
    }
    saveData(data);
    // renderTable(data); // Removed to prevent focus loss while typing
  });

  // delete single participant
  $("#participantTable").on("click", ".btn-delete", function () {
    const $currentRow = $(this).closest("tr");
    const rowId = Number($currentRow.attr("data-id"));
    if (!confirm("Are you sure to delete this participant?")) return;
    let data = getData();
    data = data.filter(record => record.id !== rowId);
    saveData(data);
    renderTable(data);
  });

  // add new participant
  $("#btnAddParticipant").on("click", function () {
    let data = getData() || [];
    const newId = data.length ? Math.max(...data.map(participant => participant.id)) + 1 : 1;
    const newParticipant = {
      id: newId,
      idNumber: "",
      name: "New Name",
      isPresent: true,
      isIncluded: true,
      timesSelected: 0,
      timesAnswered: 0,
      timesCorrect: 0
    };
    data.push(newParticipant);
    saveData(data);
    renderTable(data);
    // focus last input
    setTimeout(() => { $(`#participantTable tbody tr[data-id='${newId}'] .name-input`).focus(); }, 50);
  });

  // reset data from sample.json
  $("#btnResetData").on("click", function () {
    if (!confirm("Resetting the data will overwrite the current data with sample.json. Continue?")) return;
    loadSampleToLocal().then(loadedData => {
      renderTable(loadedData);
    });
  });

  // clear all participants
  $("#btnClearAll").on("click", function () {
    if (!confirm("Clear all participants? Can't be undone")) return;
    localStorage.removeItem(STORAGE_KEY);
    renderTable([]);
  });


  async function exportCSV() {
    const data = getData() || [];
    const headers = ["id", "idNumber", "name", "isPresent", "isIncluded", "timesSelected", "timesAnswered", "timesCorrect"];
    const rows = data.map(participant => headers.map(header => {
      let value = participant[header];
      if (typeof value === "boolean") value = value ? "1" : "0";
      return `"${String(value).replace(/"/g, '""')}"`;
    }).join(","));
    const csvContent = [headers.join(","), ...rows].join("\n");

    try {
      // Ask user to choose filename & location
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: "participants.csv",
        types: [{
          description: "CSV Files",
          accept: { "text/csv": [".csv"] }
        }]
      });

      // Write file to chosen location
      const writable = await fileHandle.createWritable();
      await writable.write(csvContent);
      await writable.close();

      alert("File successfully saved!");
    } catch (errorMessage) {
      console.log("Cancelled or error:", errorMessage);
    }
  }

  // Export CSV
  $("#btnExportCSV").on("click", function () {
    exportCSV();
  });

  // Import CSV
  $("#fileImport").on("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (event) {
      const fileText = event.target.result;
      try {
        const parsedData = parseCSV(fileText);
        // parsedData is array of objects if headers present
        if (parsedData.length) {
          // map to expected fields
          const data = parsedData.map((record, index) => ({
            id: Number(record.id) || (index + 1),
            idNumber: record.idNumber || "",
            name: record.name || "",
            isPresent: record.isPresent === "1" || record.isPresent === "true" || record.isPresent === true,
            isIncluded: record.isIncluded === "1" || record.isIncluded === "true" || record.isIncluded === true,
            timesSelected: Number(record.timesSelected) || 0,
            timesAnswered: Number(record.timesAnswered) || 0,
            timesCorrect: Number(record.timesCorrect) || 0
          }));
          saveData(data);
          renderTable(data);
          alert("CSV import successful.");
        }
      } catch (errorMessage) {
        alert("Failed to import CSV: " + errorMessage.message);
      }
    };
    reader.readAsText(file, "UTF-8");
    // reset input
    $(this).val("");
  });

  // parse simple CSV into array of objects (assumes header row)
  function parseCSV(text) {
    const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
    if (lines.length === 0) return [];
    const headerRow = splitCSVLine(lines[0]);
    const resultArray = [];
    for (let lineIndex = 1; lineIndex < lines.length; lineIndex++) {
      const parts = splitCSVLine(lines[lineIndex]);
      const record = {};
      for (let columnIndex = 0; columnIndex < headerRow.length; columnIndex++) {
        record[headerRow[columnIndex].trim()] = parts[columnIndex] !== undefined ? parts[columnIndex] : "";
      }
      resultArray.push(record);
    }
    return resultArray;
  }

  function splitCSVLine(line) {
    // naive CSV splitter that respects quoted fields
    const result = [];
    let current = "", inQuotes = false;
    for (let charIndex = 0; charIndex < line.length; charIndex++) {
      const char = line[charIndex];
      if (char === '"') {
        if (inQuotes && line[charIndex + 1] === '"') { current += '"'; charIndex++; continue; }
        inQuotes = !inQuotes; continue;
      }
      if (char === ',' && !inQuotes) { result.push(current); current = ""; continue; }
      current += char;
    }
    result.push(current);
    return result;
  }

  // btnResetSelection: set isIncluded = isPresent for all rows
  $("#btnResetSelection").on("click", function () {
    const data = getData() || [];
    data.forEach(participant => participant.isIncluded = !!participant.isPresent);
    saveData(data);
    renderTable(data);
  });

  // Draw/Lottery logic
  $("#btnStartDraw").on("click", function () {
    const data = getData() || [];
    const eligibleCandidates = data.filter(participant => participant.isIncluded);
    if (eligibleCandidates.length === 0) {
      alert("No participants are included for the draw.");
      return;
    }
    // show slot modal
    $("#modalSlot").modal("show");
    // slot animation: cycle random names for ~2200ms then pick real one
    const slotElements = [$("#slot1"), $("#slot2"), $("#slot3")];
    const namePool = eligibleCandidates.map(candidate => candidate.name || candidate.idNumber);
    let animationIntervals = [];
    slotElements.forEach((element, slotIndex) => {
      animationIntervals[slotIndex] = setInterval(() => {
        const randomName = namePool[Math.floor(Math.random() * namePool.length)];
        element.text(randomName);
      }, 80 + slotIndex * 20);
    });
    // after delay pick winner
    setTimeout(() => {
      // pick random candidate weighted equally
      const winnerIndex = Math.floor(Math.random() * eligibleCandidates.length);
      const winnerParticipant = eligibleCandidates[winnerIndex];

      // stop intervals and set final
      animationIntervals.forEach(interval => clearInterval(interval));

      // Determine neighbors (wheel logic)
      const len = eligibleCandidates.length;
      const topName = eligibleCandidates[(winnerIndex - 1 + len) % len].name;
      const bottomName = eligibleCandidates[(winnerIndex + 1) % len].name;

      $("#slot1").text(topName).removeClass("slot-winner").css("opacity", "0.5");
      $("#slot2").text(winnerParticipant.name).addClass("slot-winner").css("opacity", "1");
      $("#slot3").text(bottomName).removeClass("slot-winner").css("opacity", "0.5");
      $("#slotResult").text(`Selected: ${winnerParticipant.name} (${winnerParticipant.idNumber})`);
      // update data: increment timesSelected and uncheck isIncluded
      const fullData = getData();
      const selectedRow = fullData.find(record => record.id === winnerParticipant.id);
      if (selectedRow) {
        selectedRow.timesSelected = Number(selectedRow.timesSelected || 0) + 1;
        selectedRow.isIncluded = false;
        saveData(fullData);
        renderTable(fullData);
        // highlight row and scroll into view
        const $selectedRow = $(`#participantTable tbody tr[data-id='${winnerParticipant.id}']`);
        $("html,body").animate({ scrollTop: $selectedRow.offset().top - 80 }, 400);

        // focus scroll to selected participant row
        $selectedRow[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        $selectedRow.find("td").addClass("highlight-selected");

        setTimeout(() => $selectedRow.removeClass("highlight"), 4000);
      }
    }, 2200);
  });

  // when modal hides, clear texts and styles
  $("#modalSlot").on("hidden.bs.modal", function () {
    $("#slot1,#slot2,#slot3,#slotResult").text("");
    $("#slot1, #slot2, #slot3").removeClass("slot-winner").css("opacity", "");
  });

  // initial load
  ensureData();
});
