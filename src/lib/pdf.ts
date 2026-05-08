import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TravelForm } from '@/types/travel-form';

function formatDate(value: string) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString();
}

function formatDateTime(value: string) {
  if (!value) return '-';
  return new Date(value).toLocaleString();
}

function statusLabel(status: TravelForm['status']) {
  switch (status) {
    case 'FinanceApproved':
      return 'Finance Approved';
    case 'Pending':
      return 'Pending Approval';
    default:
      return status;
  }
}

function textValue(value: string | number | boolean | '') {
  if (value === '' || value === null || value === undefined) return '-';
  return String(value);
}

function drawHeader(doc: jsPDF, form: TravelForm) {
  // Simple in-document logo mark to keep output professional even without an image asset.
  doc.setFillColor(30, 58, 95);
  doc.roundedRect(14, 10, 24, 16, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('CO', 20, 20);

  doc.setTextColor(30, 58, 95);
  doc.setFontSize(15);
  doc.text('COMPANY TRAVEL', 44, 17);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Travel Requisition Form', 44, 23);

  doc.setDrawColor(226, 232, 240);
  doc.line(14, 29, 196, 29);

  autoTable(doc, {
    startY: 33,
    theme: 'grid',
    styles: { fontSize: 9 },
    headStyles: { fillColor: [30, 58, 95] },
    body: [
      ['Trip Number', form.tripNo, 'Status', statusLabel(form.status)],
      ['Applicant', form.applicantName, 'Last Updated', formatDateTime(form.updatedAt)],
    ],
  });
}

export function downloadTravelFormPdf(form: TravelForm) {
  const doc = new jsPDF();
  drawHeader(doc, form);
  let y = (doc as jsPDF & { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY ?? 40;
  y += 6;

  autoTable(doc, {
    startY: y,
    theme: 'grid',
    styles: { fontSize: 9 },
    headStyles: { fillColor: [30, 58, 95] },
    head: [['Section 1: Application Information', 'Details']],
    body: [
      ['Name of Applicant', textValue(form.applicantName)],
      ['Travel From Date', formatDate(form.travelFromDate)],
      ['Travel To Date', formatDate(form.travelToDate)],
      ['Cost Code', textValue(form.costCode)],
      ['Purpose of Travel', textValue(form.purpose)],
    ],
  });

  autoTable(doc, {
    startY: (doc as jsPDF & { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY
      ? ((doc as jsPDF & { lastAutoTable?: { finalY?: number } }).lastAutoTable!.finalY as number) + 6
      : y + 20,
    theme: 'grid',
    styles: { fontSize: 8.5 },
    headStyles: { fillColor: [30, 58, 95] },
    head: [['Section 2.1: Flights', 'Date', 'From', 'To', 'Flight No.', 'Departure', 'Arrival']],
    body: form.flights.length
      ? form.flights.map((flight) => [
          '',
          formatDate(flight.date),
          textValue(flight.from),
          textValue(flight.to),
          textValue(flight.flightNo),
          textValue(flight.departureTime),
          textValue(flight.arrivalTime),
        ])
      : [['No flight entries', '-', '-', '-', '-', '-', '-']],
  });

  autoTable(doc, {
    startY:
      ((doc as jsPDF & { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY as number) + 6,
    theme: 'grid',
    styles: { fontSize: 8.5 },
    headStyles: { fillColor: [30, 58, 95] },
    head: [['Section 2.2: Hotel Accommodation', 'Date In', 'Date Out', 'Location', 'Hotel', 'Board', 'Cost (ZAR)']],
    body: form.hotels.length
      ? form.hotels.map((hotel) => [
          '',
          formatDate(hotel.dateIn),
          formatDate(hotel.dateOut),
          textValue(hotel.location),
          textValue(hotel.hotelName),
          textValue(hotel.boardBasis),
          textValue(hotel.estimatedCost),
        ])
      : [['No hotel entries', '-', '-', '-', '-', '-', '-']],
  });

  autoTable(doc, {
    startY:
      ((doc as jsPDF & { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY as number) + 6,
    theme: 'grid',
    styles: { fontSize: 8.5 },
    headStyles: { fillColor: [30, 58, 95] },
    head: [['Section 2.3: Car Hire', 'Pick-up Date', 'Drop-off Date', 'Location']],
    body: form.carHires.length
      ? form.carHires.map((car) => [formatDate(car.pickupDate), formatDate(car.dropoffDate), textValue(car.location)])
      : [['-', '-', '-', 'No car hire entries']],
  });

  autoTable(doc, {
    startY:
      ((doc as jsPDF & { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY as number) + 6,
    theme: 'grid',
    styles: { fontSize: 8.5 },
    headStyles: { fillColor: [30, 58, 95] },
    head: [['Section 2.4: Shuttle Services', 'Pick-up Date', 'Company', 'Route', 'Mobile']],
    body: form.shuttles.length
      ? form.shuttles.map((shuttle) => [
          formatDate(shuttle.pickupDate),
          textValue(shuttle.shuttleCompany),
          `${textValue(shuttle.pickupAddress)} -> ${textValue(shuttle.dropoffAddress)}`,
          textValue(shuttle.mobileNumber),
        ])
      : [['-', '-', 'No shuttle entries', '-', '-']],
  });

  autoTable(doc, {
    startY:
      ((doc as jsPDF & { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY as number) + 6,
    theme: 'grid',
    styles: { fontSize: 9 },
    headStyles: { fillColor: [30, 58, 95] },
    head: [['Section 3: Daily Allowances', 'Nights', 'Amount (ZAR)']],
    body: [
      [
        'International Travel',
        textValue(form.dailyAllowances.international.nightsAway),
        textValue(form.dailyAllowances.international.amount),
      ],
      ['Local Travel', textValue(form.dailyAllowances.local.nightsAway), textValue(form.dailyAllowances.local.stAmount)],
    ],
  });

  autoTable(doc, {
    startY:
      ((doc as jsPDF & { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY as number) + 6,
    theme: 'grid',
    styles: { fontSize: 8.5 },
    headStyles: { fillColor: [30, 58, 95] },
    head: [['Section 4: Approval Status', 'Approver', 'Stage', 'Date', 'Comment']],
    body: form.approvals.length
      ? form.approvals.map((approval) => [
          statusLabel(form.status),
          approval.approverName,
          approval.stage === 'finance' ? 'Finance' : 'Final',
          formatDateTime(approval.date),
          textValue(approval.comment || ''),
        ])
      : [[statusLabel(form.status), '-', '-', '-', '-']],
  });

  if (form.rejection) {
    autoTable(doc, {
      startY:
        ((doc as jsPDF & { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY as number) + 6,
      theme: 'grid',
      styles: { fontSize: 8.5 },
      headStyles: { fillColor: [220, 38, 38] },
      head: [['Rejection Information', 'Details']],
      body: [
        ['Rejected By', form.rejection.rejectedBy],
        ['Stage', form.rejection.stage],
        ['Date', formatDateTime(form.rejection.date)],
        ['Reason', form.rejection.comment],
      ],
    });
  }

  doc.save(`${form.tripNo}-travel-requisition.pdf`);
}
