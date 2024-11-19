import {
  PDFDocument,
  rgb,
  StandardFonts,
  type PDFFont,
  type PDFPage,
} from "pdf-lib";

const a4Width = 595.28;
const a4Height = 841.89;
let yCounter = a4Height - 30; // initially 841.89

type exportForPractitionersType = {
  forPractitioners: boolean;
  formulaName: string;
  patientName: string;
  date: string;
  instructions: string;
  dosesPerDay: number;
  numberOfDays: number;
  totalDoses: number;
  ingredientsNameAndDoseMap: {
    name: string;
    totalPerDose: string;
    totalPerPrescription: string;
  }[];

  totalIngredients: string;
  totalPerDose: string;
  totalPerPrescription: string;
  ingredientsTotal: string;

  container: number;
  scoop: number;
  consumablesTotal: number;

  materialsMarkup: number;
  materialsMarkupTotal: number;
  compoundingFee: number;
  totalAdditionals: number;

  priceToPatient: number;
};

export async function exportForPractitioners({
  forPractitioners,
  formulaName,
  patientName,
  date,
  instructions,
  dosesPerDay,
  numberOfDays,
  totalDoses,
  ingredientsNameAndDoseMap,
  container,
  scoop,
  consumablesTotal,
  materialsMarkup,
  materialsMarkupTotal,
  compoundingFee,
  totalAdditionals,
  priceToPatient,
}: exportForPractitionersType) {
  setTimeout(async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([a4Width, a4Height]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    yCounter = a4Height - 30;

    forPractitioners &&
      createText(page, `Practitioner export for ${patientName}`, 14, fontBold);
    !forPractitioners &&
      createText(page, `Export for ${patientName}`, 14, fontBold);

    createText(page, `Formula Name: ${formulaName}`, 10, font);
    forPractitioners && createText(page, `Date: ${date}`, 10, font);
    createText(page, `Doses per day: ${dosesPerDay}`, 10, font);
    forPractitioners &&
      createText(page, `Number of days: ${numberOfDays}`, 10, font);
    forPractitioners &&
      createText(page, `Number of doses: ${totalDoses}`, 10, font);

    yCounter -= 15;

    createText(page, `Ingredients:`, 10, fontBold);

    if (!forPractitioners) {
      ingredientsNameAndDoseMap.forEach((item, index) => {
        createText(page, `${index + 1}. ${item.name}`, 10, font);
      });
    }

    // Ingredients Table Section
    if (forPractitioners) {
      const startX = 10; // Left alignment
      // Adjusted cell widths based on content
      const cellWidths = [
        90, // Ingredient
        80, // Weight per dose
        120, // Weight per prescription (wider for longer text)
        80, // Actual weight
        80, // Batch no.
        80, // Expiry date
      ];
      const cellHeight = 25;
      const headers = [
        "Ingredient",
        "Weight per dose",
        "Weight per prescription",
        "Actual weight",
        "Batch no.",
        "Expiry date",
      ];

      let startY = yCounter;
      let currentX = startX;

      // Draw header cells
      headers.forEach((header, index) => {
        // Draw header cell
        page.drawRectangle({
          x: currentX,
          y: startY - cellHeight,
          width: cellWidths[index],
          height: cellHeight,
          borderColor: rgb(0, 0, 0),
          borderWidth: 1,
        });

        // Draw header text
        page.drawText(header, {
          x: currentX + 5,
          y: startY - 15,
          size: 8,
          font: fontBold,
        });

        currentX += cellWidths[index];
      });

      startY -= cellHeight;

      // Draw data rows
      ingredientsNameAndDoseMap.forEach((item) => {
        currentX = startX; // Reset X position for new row

        // Draw row cells
        headers.forEach((_, colIndex) => {
          page.drawRectangle({
            x: currentX,
            y: startY - cellHeight,
            width: cellWidths[colIndex],
            height: cellHeight,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
          });

          // Prepare cell content
          let cellText = "";
          switch (colIndex) {
            case 0: // Ingredient
              cellText = item.name;
              break;
            case 1: // Weight per dose
              cellText = `${Number(item.totalPerDose).toFixed(2)} mg`;
              break;
            case 2: // Weight per prescription
              cellText = `${Number(item.totalPerPrescription).toFixed(2)} mg`;
              break;
            // Leave other cells empty for now
          }

          // Draw cell text if it exists

          page.drawText(cellText, {
            x: currentX + 5,
            y: startY - 15,
            size: 8,
            font: font,
          });

          currentX += cellWidths[colIndex];
        });

        startY -= cellHeight;
      });

      // Update yCounter for the rest of the document
      yCounter = startY - 30;
    }

    forPractitioners && createText(page, `Consumables`, 10, fontBold);
    forPractitioners && createText(page, `Container: ${container}`, 10, font);
    forPractitioners && createText(page, `Scoop: ${scoop}`, 10, font);
    forPractitioners &&
      createText(page, `Consumables total: $${consumablesTotal}`, 10, font);

    if (forPractitioners) yCounter -= 15;

    forPractitioners && createText(page, `Additionals`, 10, fontBold);
    forPractitioners &&
      createText(page, `Materials Markup: ${materialsMarkup}%`, 10, font);
    forPractitioners &&
      createText(
        page,
        `Materials Markup Total: $${materialsMarkupTotal}`,
        10,
        font
      );
    forPractitioners &&
      createText(page, `Compounding Fee: $${compoundingFee}`, 10, font);
    forPractitioners &&
      createText(page, `Total Additionals: $${totalAdditionals}`, 10, font);

    if (forPractitioners) yCounter -= 15;
    forPractitioners &&
      createText(
        page,
        `Price to patient (ex-GST): $${priceToPatient}`,
        10,
        fontBold
      );

    yCounter -= 15;
    createText(page, `Instructions`, 10, fontBold);
    createText(page, `${instructions}`, 10, font);

    const pdfBytes = await pdfDoc.save();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(
      new Blob([pdfBytes], { type: "application/pdf" })
    );
    link.download = `${patientName} - ${
      forPractitioners ? "Practitioner" : "Patient"
    } File.pdf`;
    link.click();
    URL.revokeObjectURL(link.href);
  }, 1000);
}

function createText(
  page: PDFPage,
  text: string,
  size: number,
  font: PDFFont
): void {
  page.drawText(text, {
    x: 10,
    y: yCounter,
    size: size,
    font: font,
    color: rgb(0, 0, 0),
  });
  yCounter -= size + 10;
}
