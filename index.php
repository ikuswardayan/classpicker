<?php
// index.php - Class Random Picker
?><!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Class Picker - Enhance Participant Engagement</title>
  <!-- Bootstrap 5 & jQuery CDN -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body class="bg-light">
  <div class="container py-4">
    <div class="d-flex align-items-center mb-3">
      <h1 class="h4 flex-grow-1 mb-0">ClassPicker — Participant Draw</h1>
      <div class="btn-group" role="group" aria-label="control-buttons">
        <button id="btn_ExportCSV" class="btn btn-outline-primary" title="Export to CSV">
          <i class="bi bi-download"></i> Export CSV
        </button>
        <label class="btn btn-outline-secondary mb-0" for="fileImport" title="Import from CSV">
          <i class="bi bi-upload"></i> Import CSV
        </label>
        <input id="fileImport" type="file" accept=".csv" style="display:none">
        <button id="btn_ResetData" class="btn btn-outline-warning" title="Reset from sample">
          <i class="bi bi-arrow-counterclockwise"></i> Reset Participant
        </button>
        <button id="btn_HapusSemua" class="btn btn-outline-danger" title="Clear all participant">
          <i class="bi bi-trash"></i> Clear All
        </button>
        <button id="btn_tambahData" class="btn btn-outline-success" title="Add participant">
          <i class="bi bi-person-plus"></i> Add
        </button>
      </div>
    </div>

    <div class="table-responsive border rounded bg-white shadow-sm">
      <table id="daftar_seluruh_peserta" class="table table-hover mb-0">
        <thead class="table-light sticky-top">
          <tr>
            <th style="width:50px">#</th>
            <th>NRP</th>
            <th>Name</th>
            <th><i class="bi bi-person-raised-hand" style="cursor:pointer;"
     title="The participant is present"></i></th>
            <th><i class="bi bi-person-check-fill" style="cursor:pointer;"
     title="The participant is included in the draw"></i></th>
            <th><i class="bi bi-dice-5-fill" style="cursor:pointer;"
     title="How many times being selected"></i></th>
            <th><i class="bi bi-chat-left-dots-fill"  style="cursor:pointer;"
     title="How many times the participant answered the question"></i> Answered</th>
            <th><i class="bi bi-check-lg"  style="cursor:pointer;"
     title="How many times the participant answered correctly"></i> Right Answer</th>
            <th></th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>

  </div>

  <!-- Sticky bottom controls -->
  <div class="sticky-bottom-controls">
    <div class="container d-flex justify-content-end py-2">
      <div class="btn-group">
        <button id="btn_reset" class="btn btn-secondary" title="Reset ck_dilibatkan = ck_hadir">
          <i class="bi bi-arrow-repeat"></i> Reset
        </button>
        <button id="btn_undian" class="btn btn-primary btn-lg ms-2" title="Do Spin">
          <i class="bi bi-dice-5-fill"></i></i> Spin
        </button>
      </div>
    </div>
  </div>

  <!-- Modal slot machine -->
  <div class="modal fade" id="modalSlot" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content text-center p-3">
        <div class="modal-body">
          <div class="slot-lines">
            <div class="slot-line" id="slot1"></div>
            <div class="slot-line" id="slot2"></div>
            <div class="slot-line" id="slot3"></div>
          </div>
          <h5 class="mt-3" id="slotResult"></h5>
        </div>
      </div>
    </div>
  </div>

  <!-- Icons Bootstrap (via CDN for icons) -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.4/font/bootstrap-icons.css">

  <script src="assets/js/app.js"></script>
</body>
</html>
