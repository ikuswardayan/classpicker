// app.js - handles data, UI, LocalStorage and undian logic
$(function(){
  const LS_KEY = "class_spinner_data_v1";
  const SAMPLE = "sample.json";

  function loadSampleToLocal(){
    return $.getJSON(SAMPLE).then(data=>{
      localStorage.setItem(LS_KEY, JSON.stringify(data));
      return data;
    });
  }

  function getData(){
    const raw = localStorage.getItem(LS_KEY);
    if(!raw) return null;
    try { return JSON.parse(raw); } catch(e){ return null; }
  }

  function saveData(data){
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  }

  function ensureData(){
    let data = getData();
    if(!data){
      return loadSampleToLocal().then(d=>{
        renderTable(d);
      });
    } else {
      renderTable(data);
    }
  }

  function renderTable(data){
    const $tbody = $("#daftar_seluruh_peserta tbody");
    $tbody.empty();
    data.forEach((row, idx)=>{
      const tr = $("<tr>").attr("data-id", row.id);
      tr.append(`<td class="align-middle">${idx+1}</td>`);
      tr.append(`<td class="align-middle"><input class="form-control form-control-sm nrp" data-field="nrp" value="${escapeHtml(row.nrp)}"></td>`);
      tr.append(`<td class="align-middle"><input class="form-control form-control-sm nama" data-field="nama" value="${escapeHtml(row.nama)}"></td>`);
      tr.append(`<td class="text-center align-middle"><input type="checkbox" class="ck_hadir" ${row.ck_hadir ? "checked":""}></td>`);
      tr.append(`<td class="text-center align-middle"><input type="checkbox" class="ck_dilibatkan" ${row.ck_dilibatkan ? "checked":""}></td>`);
      tr.append(`<td class="text-center align-middle jumlah_terpilih">${row.jumlah_terpilih}</td>`);
      tr.append(`<td class="align-middle"><input type="number" min="0" class="form-control form-control-sm jumlah_menjawab" value="${row.jumlah_menjawab}"></td>`);
      tr.append(`<td class="align-middle"><input type="number" min="0" class="form-control form-control-sm jumlah_jawaban_benar" value="${row.jumlah_jawaban_benar}"></td>`);
      tr.append(`<td class="align-middle text-end"><button class="btn btn-sm btn-outline-danger btn-hapus"><i class="bi bi-trash-fill"></i></button></td>`);
      $tbody.append(tr);
    });
  }

  function escapeHtml(s){ return (s+"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

  // update a single field then save
  $("#daftar_seluruh_peserta").on("change keyup", "input,textarea", function(e){
    const $tr = $(this).closest("tr");
    const id = Number($tr.attr("data-id"));
    let data = getData();
    const row = data.find(r=>r.id===id);
    const cls = $(this).attr("class");
    if($(this).is(":checkbox")){
      if($(this).hasClass("ck_hadir")) row.ck_hadir = $(this).prop("checked");
      if($(this).hasClass("ck_dilibatkan")) row.ck_dilibatkan = $(this).prop("checked");
    } else {
      const field = $(this).data("field");
      if(field) row[field] = $(this).val();
      else if($(this).hasClass("jumlah_menjawab")) row.jumlah_menjawab = Number($(this).val())||0;
      else if($(this).hasClass("jumlah_jawaban_benar")) row.jumlah_jawaban_benar = Number($(this).val())||0;
    }
    saveData(data);
    renderTable(data); // re-render to reflect numbering and any formatting
  });

  // delete single
  $("#daftar_seluruh_peserta").on("click", ".btn-hapus", function(){
    const $tr = $(this).closest("tr");
    const id = Number($tr.attr("data-id"));
    if(!confirm("Are you sure to delete this participat ??")) return;
    let data = getData();
    data = data.filter(r=>r.id!==id);
    saveData(data);
    renderTable(data);
  });

  // add new
  $("#btn_tambahData").on("click", function(){
    let data = getData() || [];
    const newId = data.length ? Math.max(...data.map(d=>d.id))+1 : 1;
    const baru = { id: newId, nrp: "", nama: "New Name", ck_hadir:true, ck_dilibatkan:true, jumlah_terpilih:0, jumlah_menjawab:0, jumlah_jawaban_benar:0 };
    data.push(baru);
    saveData(data);
    renderTable(data);
    // focus last input
    setTimeout(()=>{ $(`#daftar_seluruh_peserta tbody tr[data-id='${newId}'] .nama`).focus(); },50);
  });

  // reset data from sample.json
  $("#btn_ResetData").on("click", function(){
    if(!confirm("Resetting the data will overwrite the current data with sample.json. Continue?")) return;
    loadSampleToLocal().then(d=>{
      renderTable(d);
    });
  });

  // delete all
  $("#btn_HapusSemua").on("click", function(){
    if(!confirm("Clear all participants ? Cant be undone")) return;
    localStorage.removeItem(LS_KEY);
    renderTable([]);
  });

	
async function exportCSV() {
/*
  // Ambil data tabel
  let csv = [];
  document.querySelectorAll("#daftar_seluruh_peserta tr").forEach(tr => {
    let row = [];
    tr.querySelectorAll("th, td").forEach(td => {
      let text = td.textContent.replace(/"/g, '""');
      row.push('"' + text + '"');
    });
    csv.push(row.join(","));
  });
  let csvContent = csv.join("\n");
*/
    const data = getData() || [];
    const headers = ["id","nrp","nama","ck_hadir","ck_dilibatkan","jumlah_terpilih","jumlah_menjawab","jumlah_jawaban_benar"];
    const rows = data.map(r=> headers.map(h => {
      let v = r[h];
      if(typeof v === "boolean") v = v ? "1":"0";
      return `"${String(v).replace(/"/g,'""')}"`;
    }).join(","));
    const csvContent = [headers.join(","), ...rows].join("\n");	

	
  try {
    // Minta pengguna memilih nama file & lokasi
    const handle = await window.showSaveFilePicker({
      suggestedName: "participants.csv",
      types: [{
        description: "CSV Files",
        accept: { "text/csv": [".csv"] }
      }]
    });

    // Tulis file ke lokasi yang dipilih
    const writable = await handle.createWritable();
    await writable.write(csvContent);
    await writable.close();

    alert("File berhasil disimpan!");
  } catch (err) {
    console.log("Dibatalkan atau error:", err);
  }
}	
	
  // Export CSV
  $("#btn_ExportCSV").on("click", function(){
	  exportCSV();
/*	  
    const data = getData() || [];
    const headers = ["id","nrp","nama","ck_hadir","ck_dilibatkan","jumlah_terpilih","jumlah_menjawab","jumlah_jawaban_benar"];
    const rows = data.map(r=> headers.map(h => {
      let v = r[h];
      if(typeof v === "boolean") v = v ? "1":"0";
      return `"${String(v).replace(/"/g,'""')}"`;
    }).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], {type:"text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "peserta_export.csv";
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
*/
  });

  // Import CSV
  $("#fileImport").on("change", function(e){
    const f = e.target.files[0];
    if(!f) return;
    const reader = new FileReader();
    reader.onload = function(ev){
      const txt = ev.target.result;
      try {
        const parsed = parseCSV(txt);
        // parsed is array of objects if headers present
        if(parsed.length){
          // map to expected fields
          const data = parsed.map((r, idx)=>({
            id: Number(r.id) || (idx+1),
            nrp: r.nrp || r.NRP || "",
            nama: r.nama || r.NAMA || r.Nama || "",
            ck_hadir: r.ck_hadir === "1" || r.ck_hadir === "true" || r.ck_hadir === "TRUE" || r.ck_hadir === true,
            ck_dilibatkan: r.ck_dilibatkan === "1" || r.ck_dilibatkan === "true" || r.ck_dilibatkan === true,
            jumlah_terpilih: Number(r.jumlah_terpilih) || 0,
            jumlah_menjawab: Number(r.jumlah_menjawab) || 0,
            jumlah_jawaban_benar: Number(r.jumlah_jawaban_benar) || 0
          }));
          saveData(data);
          renderTable(data);
          alert("Import CSV berhasil.");
        }
      } catch(err){
        alert("Gagal mengimpor CSV: "+err.message);
      }
    };
    reader.readAsText(f, "UTF-8");
    // reset input
    $(this).val("");
  });

  // parse simple CSV into array of objects (assumes header row)
  function parseCSV(txt){
    const lines = txt.split(/\r?\n/).filter(l=>l.trim()!=="");
    if(lines.length===0) return [];
    const header = splitCSVLine(lines[0]);
    const arr = [];
    for(let i=1;i<lines.length;i++){
      const parts = splitCSVLine(lines[i]);
      const obj = {};
      for(let j=0;j<header.length;j++){
        obj[ header[j].trim() ] = parts[j] !== undefined ? parts[j] : "";
      }
      arr.push(obj);
    }
    return arr;
  }

  function splitCSVLine(line){
    // naive CSV splitter that respects quoted fields
    const res = [];
    let cur = "", inQuotes=false;
    for(let i=0;i<line.length;i++){
      const ch = line[i];
      if(ch === '"' ){
        if(inQuotes && line[i+1]==='"'){ cur += '"'; i++; continue; }
        inQuotes = !inQuotes; continue;
      }
      if(ch === ',' && !inQuotes){ res.push(cur); cur = ""; continue;}
      cur += ch;
    }
    res.push(cur);
    return res;
  }

  // btn_reset: set ck_dilibatkan = ck_hadir for all rows
  $("#btn_reset").on("click", function(){
    const data = getData() || [];
    data.forEach(r => r.ck_dilibatkan = !!r.ck_hadir);
    saveData(data);
    renderTable(data);
  });

  // Undian logic
  $("#btn_undian").on("click", function(){
    const data = getData() || [];
    const candidates = data.filter(r => r.ck_dilibatkan);
    if(candidates.length === 0){ alert("Tidak ada peserta yang dilibatkan untuk undian."); return; }
    // show slot modal
    $("#modalSlot").modal("show");
    // slot animation: cycle random names for ~2200ms then pick real one
    const slotEls = [$("#slot1"), $("#slot2"), $("#slot3")];
    const namePool = candidates.map(c => c.nama || c.nrp);
    let intervals = [];
    slotEls.forEach((el, idx)=>{
      intervals[idx] = setInterval(()=> {
        const n = namePool[Math.floor(Math.random()*namePool.length)];
        el.text(n);
      }, 80 + idx*20);
    });
    // after delay pick winner
    setTimeout(()=>{
      // pick random candidate weighted equally
      const winner = candidates[Math.floor(Math.random()*candidates.length)];
      // stop intervals and set final
      intervals.forEach(i=>clearInterval(i));
      $("#slot1").text(winner.nama);
      $("#slot2").text(winner.nama);
      $("#slot3").text(winner.nama);
      $("#slotResult").text(`Selected: ${winner.nama} (${winner.nrp})`);
      // update data: increment jumlah_terpilih and uncheck dilibatkan
      const full = getData();
      const row = full.find(r=>r.id === winner.id);
      if(row){
        row.jumlah_terpilih = Number(row.jumlah_terpilih || 0) + 1;
        row.ck_dilibatkan = false;
        saveData(full);
        renderTable(full);
        // highlight row and scroll into view
        const $tr = $(`#daftar_seluruh_peserta tbody tr[data-id='${winner.id}']`);
        $("html,body").animate({ scrollTop: $tr.offset().top - 80 }, 400);
		  
		// fokus scroll ke baris peserta terpilih
    	$tr[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
//		$tr.addClass("highlight-terpilih");
		  $tr.find("td").addClass("highlight-terpilih");
		  
        setTimeout(()=> $tr.removeClass("highlight"), 4000);
      }
    }, 2200);
  });

  // when modal hides, clear texts
  $("#modalSlot").on("hidden.bs.modal", function(){
    $("#slot1,#slot2,#slot3,#slotResult").text("");
  });

  // initial
  ensureData();
});
