// app.js - handles data, UI, LocalStorage and random draw logic
$(function(){
  const STORAGE_KEY = "classpicker_data_v1";
  const SAMPLE_FILE = "sample.json";

  // Load sample data from JSON file and save to LocalStorage
  function loadSampleToStorage(){
    return $.getJSON(SAMPLE_FILE).then(data => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return data;
    });
  }

  // Get participant data from LocalStorage
  function getParticipantData(){
    const rawData = localStorage.getItem(STORAGE_KEY);
    if(!rawData) return null;
    try { 
      return JSON.parse(rawData); 
    } catch(e){ 
      return null; 
    }
  }

  // Save participant data to LocalStorage
  function saveParticipantData(data){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  // Ensure data exists, load sample if not
  function ensureDataExists(){
    let data = getParticipantData();
    if(!data){
      return loadSampleToStorage().then(loadedData => {
        renderParticipantTable(loadedData);
      });
    } else {
      renderParticipantTable(data);
    }
  }

  // Render participant table
  function renderParticipantTable(data){
    const $tbody = $("#participantTable tbody");
    $tbody.empty();
    
    data.forEach((participant, index) => {
      const $row = $("<tr>").attr("data-id", participant.id);
      $row.append(`<td class="align-middle">${index + 1}</td>`);
      $row.append(`<td class="align-middle"><input class="form-control form-control-sm participant-id-number" data-field="nrp" value="${escapeHtml(participant.nrp)}"></td>`);
      $row.append(`<td class="align-middle"><input class="form-control form-control-sm participant-name" data-field="nama" value="${escapeHtml(participant.nama)}"></td>`);
      $row.append(`<td class="text-center align-middle"><input type="checkbox" class="is-present" ${participant.ck_hadir ? "checked":""}></td>`);
      $row.append(`<td class="text-center align-middle"><input type="checkbox" class="is-eligible" ${participant.ck_dilibatkan ? "checked":""}></td>`);
      $row.append(`<td class="text-center align-middle times-selected">${participant.jumlah_terpilih}</td>`);
      $row.append(`<td class="align-middle"><input type="number" min="0" class="form-control form-control-sm times-answered" value="${participant.jumlah_menjawab}"></td>`);
      $row.append(`<td class="align-middle"><input type="number" min="0" class="form-control form-control-sm times-correct" value="${participant.jumlah_jawaban_benar}"></td>`);
      $row.append(`<td class="align-middle text-end"><button class="btn btn-sm btn-outline-danger btn-delete"><i class="bi bi-trash-fill"></i></button></td>`);
      $tbody.append($row);
    });
  }

  // Escape HTML to prevent XSS
  function escapeHtml(str){ 
    return (str + "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); 
  }

  // Update participant data when input changes
  $("#participantTable").on("change keyup", "input,textarea", function(e){
    const $row = $(this).closest("tr");
    const participantId = Number($row.attr("data-id"));
    let data = getParticipantData();
    const participant = data.find(p => p.id === participantId);
    
    if($(this).is(":checkbox")){
      if($(this).hasClass("is-present")) {
        participant.ck_hadir = $(this).prop("checked");
      }
      if($(this).hasClass("is-eligible")) {
        participant.ck_dilibatkan = $(this).prop("checked");
      }
    } else {
      const fieldName = $(this).data("field");
      if(fieldName) {
        participant[fieldName] = $(this).val();
      } else if($(this).hasClass("times-answered")) {
        participant.jumlah_menjawab = Number($(this).val()) || 0;
      } else if($(this).hasClass("times-correct")) {
        participant.jumlah_jawaban_benar = Number($(this).val()) || 0;
      }
    }
    
    saveParticipantData(data);
    renderParticipantTable(data);
  });

  // Delete single participant
  $("#participantTable").on("click", ".btn-delete", function(){
    const $row = $(this).closest("tr");
    const participantId = Number($row.attr("data-id"));
    
    if(!confirm("Are you sure you want to delete this participant?")) return;
    
    let data = getParticipantData();
    data = data.filter(p => p.id !== participantId);
    saveParticipantData(data);
    renderParticipantTable(data);
  });

  // Add new participant
  $("#btnAddParticipant").on("click", function(){
    let data = getParticipantData() || [];
    const newId = data.length ? Math.max(...data.map(p => p.id)) + 1 : 1;
    const newParticipant = { 
      id: newId, 
      nrp: "", 
      nama: "New Participant", 
      ck_hadir: true, 
      ck_dilibatkan: true, 
      jumlah_terpilih: 0, 
      jumlah_menjawab: 0, 
      jumlah_jawaban_benar: 0 
    };
    
    data.push(newParticipant);
    saveParticipantData(data);
    renderParticipantTable(data);
    
    // Focus on name input of newly added participant
    setTimeout(() => { 
      $(`#participantTable tbody tr[data-id='${newId}'] .participant-name`).focus(); 
    }, 50);
  });

  // Reset data from sample.json
  $("#btnResetData").on("click", function(){
    if(!confirm("Resetting will overwrite current data with sample.json. Continue?")) return;
    
    loadSampleToStorage().then(data => {
      renderParticipantTable(data);
    });
  });

  // Clear all participants
  $("#btnClearAll").on("click", function(){
    if(!confirm("Clear all participants? This cannot be undone.")) return;
    
    localStorage.removeItem(STORAGE_KEY);
    renderParticipantTable([]);
  });

  // Export to CSV with file picker
  async function exportToCSV() {
    const data = getParticipantData() || [];
    const headers = ["id","nrp","nama","ck_hadir","ck_dilibatkan","jumlah_terpilih","jumlah_menjawab","jumlah_jawaban_benar"];
    const rows = data.map(participant => headers.map(header => {
      let value = participant[header];
      if(typeof value === "boolean") value = value ? "1" : "0";
      return `"${String(value).replace(/"/g,'""')}"`;
    }).join(","));
    const csvContent = [headers.join(","), ...rows].join("\n");

    try {
      // Ask user to choose filename and location
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: "participants.csv",
        types: [{
          description: "CSV Files",
          accept: { "text/csv": [".csv"] }
        }]
      });

      // Write file to selected location
      const writable = await fileHandle.createWritable();
      await writable.write(csvContent);
      await writable.close();

      alert("File saved successfully!");
    } catch (err) {
      console.log("Cancelled or error:", err);
    }
  }

  // Export CSV button
  $("#btnExportCSV").on("click", function(){
    exportToCSV();
  });

  // Import CSV
  $("#fileImport").on("change", function(e){
    const file = e.target.files[0];
    if(!file) return;
    
    const reader = new FileReader();
    reader.onload = function(event){
      const csvText = event.target.result;
      try {
        const parsedData = parseCSV(csvText);
        
        if(parsedData.length){
          // Map CSV columns to expected fields
          const data = parsedData.map((row, idx) => ({
            id: Number(row.id) || (idx + 1),
            nrp: row.nrp || row.NRP || "",
            nama: row.nama || row.NAMA || row.Nama || "",
            ck_hadir: row.ck_hadir === "1" || row.ck_hadir === "true" || row.ck_hadir === "TRUE" || row.ck_hadir === true,
            ck_dilibatkan: row.ck_dilibatkan === "1" || row.ck_dilibatkan === "true" || row.ck_dilibatkan === true,
            jumlah_terpilih: Number(row.jumlah_terpilih) || 0,
            jumlah_menjawab: Number(row.jumlah_menjawab) || 0,
            jumlah_jawaban_benar: Number(row.jumlah_jawaban_benar) || 0
          }));
          
          saveParticipantData(data);
          renderParticipantTable(data);
          alert("CSV imported successfully.");
        }

      } catch(err){
        alert("Failed to import CSV: " + err.message);
      }
    };
    reader.readAsText(file, "UTF-8");
    
    // Reset input
    $(this).val("");
  });

  // Parse CSV into array of objects (assumes header row)
  function parseCSV(csvText){
    const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== "");
    if(lines.length === 0) return [];
    
    const headers = splitCSVLine(lines[0]);
    const dataArray = [];
    
    for(let i = 1; i < lines.length; i++){
      const values = splitCSVLine(lines[i]);
      const rowObject = {};
      for(let j = 0; j < headers.length; j++){
        rowObject[headers[j].trim()] = values[j] !== undefined ? values[j] : "";
      }
      dataArray.push(rowObject);
    }
    return dataArray;
  }

  // Split CSV line respecting quoted fields
  function splitCSVLine(line){
    const result = [];
    let currentField = "";
    let insideQuotes = false;
    
    for(let i = 0; i < line.length; i++){
      const char = line[i];
      
      if(char === '"'){
        if(insideQuotes && line[i + 1] === '"'){
          currentField += '"';
          i++;
          continue;
        }
        insideQuotes = !insideQuotes;
        continue;
      }
      
      if(char === ',' && !insideQuotes){
        result.push(currentField);
        currentField = "";
        continue;
      }
      
      currentField += char;
    }
    result.push(currentField);
    return result;
  }

  // Reset eligibility: set is_eligible = is_present for all participants
  $("#btnResetEligibility").on("click", function(){
    const data = getParticipantData() || [];
    data.forEach(participant => {
      participant.ck_dilibatkan = !!participant.ck_hadir;
    });
    saveParticipantData(data);
    renderParticipantTable(data);
  });

  // Random draw logic
  $("#btnDrawWinner").on("click", function(){
    const data = getParticipantData() || [];
    const eligibleCandidates = data.filter(p => p.ck_dilibatkan);
    
    if(eligibleCandidates.length === 0){
      alert("No eligible participants for the draw.");
      return;
    }
    
    // Show slot machine modal
    $("#modalSlot").modal("show");
    
    // Slot animation: cycle random names for ~2200ms then pick winner
    const slotElements = [$("#slot1"), $("#slot2"), $("#slot3")];
    const namePool = eligibleCandidates.map(p => p.nama || p.nrp);
    let animationIntervals = [];
    
    slotElements.forEach((element, idx) => {
      animationIntervals[idx] = setInterval(() => {
        const randomName = namePool[Math.floor(Math.random() * namePool.length)];
        element.text(randomName);
      }, 80 + idx * 20);
    });
    
    // After 2200ms, select winner
    setTimeout(() => {
      // Pick random winner from eligible candidates
      const winnerIndex = Math.floor(Math.random() * eligibleCandidates.length);
      const winner = eligibleCandidates[winnerIndex];
      
      // Stop all animations
      animationIntervals.forEach(interval => clearInterval(interval));
      
      // Display winner in all slots
      $("#slot1").text(winner.nama);
      $("#slot2").text(winner.nama);
      $("#slot3").text(winner.nama);
      $("#slotResult").text(`Selected: ${winner.nama} (${winner.nrp})`);
      
      // Update participant data
      const fullData = getParticipantData();
      const selectedParticipant = fullData.find(p => p.id === winner.id);
      
      if(selectedParticipant){
        selectedParticipant.jumlah_terpilih = Number(selectedParticipant.jumlah_terpilih || 0) + 1;
        selectedParticipant.ck_dilibatkan = false;  // Temporal exclusion
        saveParticipantData(fullData);
        renderParticipantTable(fullData);
        
        // Highlight and scroll to winner's row
        const $winnerRow = $(`#participantTable tbody tr[data-id='${winner.id}']`);
        
        // Smooth scroll to winner
        $winnerRow[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Add highlight class
        $winnerRow.find("td").addClass("highlight-selected");
        
        // Remove highlight after 4 seconds
        setTimeout(() => $winnerRow.find("td").removeClass("highlight-selected"), 4000);
      }
    }, 2200);
  });

  // When modal hides, clear slot texts
  $("#modalSlot").on("hidden.bs.modal", function(){
    $("#slot1, #slot2, #slot3, #slotResult").text("");
  });

  // Initialize application
  ensureDataExists();
});