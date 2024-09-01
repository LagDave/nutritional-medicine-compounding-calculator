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
  ingredientsName: string;

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
  ingredientsName,
  totalIngredients,
  totalPerDose,
  totalPerPrescription,
  ingredientsTotal,
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
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();

    // Set the page size to A4
    const page = pdfDoc.addPage([a4Width, a4Height]); // A4 dimensions in points

    // Embed the fonts
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Reset yCounter
    yCounter = a4Height - 30;

    forPractitioners &&
      createText(page, `Practitioner export for ${patientName}`, 14, fontBold);
    !forPractitioners &&
      createText(page, `Export for ${patientName}`, 14, fontBold);
    /* for patient */ createText(
      page,
      `Formula Name: ${formulaName}`,
      10,
      font
    );
    forPractitioners && createText(page, `Date: ${date}`, 10, font);
    /* for patient */ createText(
      page,
      `Doses per day: ${dosesPerDay}`,
      10,
      font
    );
    forPractitioners &&
      createText(page, `Number of days: ${numberOfDays}`, 10, font);
    forPractitioners &&
      createText(page, `Number of doses: ${totalDoses}`, 10, font);

    yCounter -= 15;

    /* for patient */ createText(page, `Ingredients`, 10, fontBold); //
    /* for patient */ createText(
      page,
      `Ingredients: ${ingredientsName}`,
      10,
      font
    ); //
    forPractitioners &&
      createText(page, `Total Ingredients(mg): ${totalIngredients}`, 10, font);
    forPractitioners &&
      createText(page, `Total per dose(g): ${totalPerDose}`, 10, font);
    forPractitioners &&
      createText(
        page,
        `Total per prescription(g): ${totalPerPrescription}`,
        10,
        font
      );
    forPractitioners &&
      createText(
        page,
        `Total prescription price(g): ${ingredientsTotal}`,
        10,
        font
      );

    if (forPractitioners) yCounter -= 15;

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
    /* for patient */ createText(page, `Instructions`, 10, fontBold);
    createText(page, `${instructions}`, 10, font);

    // Serialize the document to bytes
    const pdfBytes = await pdfDoc.save();

    // Create a download link
    const link = document.createElement("a");
    link.href = URL.createObjectURL(
      new Blob([pdfBytes], { type: "application/pdf" })
    );
    link.download = "export.pdf";

    // Trigger the download
    link.click();

    // Clean up
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
