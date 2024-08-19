import ingredients from "./data/ingredients";
import Ingredient from "./components/Ingredient";
import { useEffect, useState } from "react";
import { PDFDocument } from "pdf-lib";
import html2canvas from "html2canvas";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [isPatientDataDownloaded, setIsPatientDataDownloaded] = useState(false);

  /** DATA */
  const [patientName, setPatientName] = useState("");
  const [formulaName, setFormulaName] = useState("");
  const [date, setDate] = useState("");
  const [instructions, setInstructions] = useState("");
  const [ingredientsName, setIngredientsName] = useState("");

  /** INGREDIENTS */
  const [totalDoses, setTotalDoses] = useState(1);
  const [numberOfDays, setNumberOfDays] = useState(20);
  const [dosesPerDay, setDosesPerDay] = useState(2);
  const [shownIngredients, setShownIngredients] = useState<number[]>([]);

  /** CONSUMABLES */
  const scoopPrice = 0.45;
  const [scoop, setScoop] = useState(1);

  const containerPrice = 0.85;
  const [container, setContainer] = useState(1);

  const [consumablesTotal, setConsumablesTotal] = useState(
    scoopPrice + containerPrice
  );

  /** ADDITIONALS */
  const [materialsMarkup, setMaterialsMarkup] = useState(0);
  const [materialsMarkupTotal, setMaterialsMarkupTotal] = useState(0);
  const [compoundingFee, setCompoundingFee] = useState(0);
  const [totalAdditionals, setTotalAdditionals] = useState(0);

  // Ingredients total ($) - the total of all $/prescription
  const [ingredientsTotalArray, setIngredientsTotalArray] = useState([
    0, 0, 0, 0, 0,
  ]);
  const [ingredientsTotal, setIngredientsTotal] = useState(0);

  // Total/Prescription (g) - the total of all total/prescriotion in g
  const [totalPerPrescriptionArray, setTotalPerPrescriptionArray] = useState([
    0, 0, 0, 0, 0,
  ]);
  const [totalPerPrescription, setTotalPerPrescription] = useState(0);

  // Total Ingredients content in mg
  const [totalIngredientsArray, setTotalIngredientsArray] = useState([
    0, 0, 0, 0, 0,
  ]);
  const [totalIngredients, setTotalIngredients] = useState(0);

  const [priceToPatient, setPriceToPatient] = useState(0);

  useEffect(() => {
    setTotalDoses(numberOfDays * dosesPerDay || 0);
    setIngredientsName(
      shownIngredients.map((i) => `${ingredients[i].name}`).join(", ")
    );
  }, [numberOfDays, dosesPerDay, shownIngredients, totalIngredientsArray]);

  useEffect(() => {
    setIngredientsTotal(
      ingredientsTotalArray.reduce((acc, current, index) => {
        if (shownIngredients.includes(index)) {
          return acc + current;
        }
        return acc;
      }, 0)
    );
  }, [shownIngredients, ingredientsTotalArray]);

  useEffect(() => {
    setTotalPerPrescription(
      totalPerPrescriptionArray.reduce((acc, current, index) => {
        if (shownIngredients.includes(index)) {
          return acc + current;
        }
        return acc;
      }, 0)
    );
  }, [shownIngredients, totalPerPrescriptionArray]);

  useEffect(() => {
    setTotalIngredients(
      totalIngredientsArray.reduce((acc, current, index) => {
        if (shownIngredients.includes(index)) {
          return acc + current;
        }
        return acc;
      }, 0)
    );
  }, [shownIngredients, totalIngredientsArray]);

  /** CONSUMABLES */
  useEffect(() => {
    if (scoop < 0 || container < 0) {
      return;
    }
    const scoopTotal = scoop * scoopPrice;
    const containerTotal = container * containerPrice;
    setConsumablesTotal(scoopTotal + containerTotal);
  }, [scoop, container]);

  /** ADDITIONALS */
  useEffect(() => {
    setMaterialsMarkupTotal(
      (materialsMarkup / 100) * (consumablesTotal + ingredientsTotal)
    );
  }, [materialsMarkup, consumablesTotal, ingredientsTotal]);

  useEffect(() => {
    setTotalAdditionals(materialsMarkupTotal + compoundingFee);
  }, [materialsMarkupTotal, compoundingFee]);

  /** PRICE TO PATIENT */
  useEffect(() => {
    setPriceToPatient(
      ingredientsTotal +
        consumablesTotal +
        materialsMarkupTotal +
        compoundingFee
    );
  }, [
    ingredientsTotal,
    consumablesTotal,
    materialsMarkupTotal,
    compoundingFee,
  ]);

  function handleIngredientElementalDoseChange(
    index: number,
    {
      elementalDose,
      totalPerPrescription,
      dollarPerPrescription,
      totalPerDose,
    }: {
      elementalDose: number;
      totalPerPrescription: number;
      dollarPerPrescription: number;
      totalPerDose: number;
    }
  ) {
    setIngredientsTotalArray((prevArray) => {
      const newArray = [...prevArray];
      newArray[index] = dollarPerPrescription;
      return newArray;
    });
    setTotalPerPrescriptionArray((prevArray) => {
      const newArray = [...prevArray];
      newArray[index] = totalPerPrescription;
      return newArray;
    });
    setTotalIngredientsArray((prevArray) => {
      const newArray = [...prevArray];
      newArray[index] = totalPerDose;
      return newArray;
    });
  }

  function updateShownIngredients(value: number) {
    if (shownIngredients.indexOf(value) > -1) {
      setShownIngredients(shownIngredients.filter((n) => n !== value));
    } else {
      setShownIngredients([...shownIngredients, value]);
    }
  }

  async function exportDocument({
    forPractitioners,
  }: {
    forPractitioners: boolean;
  }) {
    setIsLoading(true);
    if (!forPractitioners) setIsPatientDataDownloaded(true);

    setTimeout(async () => {
      const style = document.createElement("style");
      style.textContent = `
      #calculatorContainer, #calculatorContainer * {
        font-family: sans-serif !important;
      }
    `;
      document.head.appendChild(style);

      // Capture screenshot of the entire page
      const elementId = forPractitioners
        ? "calculatorContainer"
        : "patientDataContainer";
      const canvas = await html2canvas(
        document.getElementById(elementId) || document.body
      );
      console.log(elementId);
      const imgData = canvas.toDataURL("image/png");

      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();

      // Define A4 dimensions (in points)
      const A4_WIDTH = 595.276; // 210 mm in points
      const A4_HEIGHT = 841.89; // 297 mm in points

      // Add a page to the document with A4 size
      const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);

      // Embed the screenshot image
      const image = await pdfDoc.embedPng(imgData);

      // Get image dimensions
      const { width, height } = image.scale(1);

      // Define desired scale factor (e.g., 0.5 for 50% of original size)
      const scaleFactor = 0.3;

      // Calculate scaled dimensions
      const scaledWidth = width * scaleFactor;
      const scaledHeight = height * scaleFactor;

      // Draw the image on the page
      page.drawImage(image, {
        x: 10,
        y: page.getHeight() - scaledHeight,
        width: scaledWidth,
        height: scaledHeight,
      });

      // Serialize the document to bytes
      const pdfBytes = await pdfDoc.save();

      // Create a download link
      const link = document.createElement("a");
      link.href = URL.createObjectURL(
        new Blob([pdfBytes], { type: "application/pdf" })
      );
      link.download = "screenshot.pdf";

      // Trigger the download
      link.click();

      // Clean up
      URL.revokeObjectURL(link.href);
      document.head.removeChild(style);
      if (!forPractitioners) setIsPatientDataDownloaded(false);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }, 1000);
  }

  return (
    <>
      <div id="calculatorContainer" className="max-w-[1280px] mx-auto my-5">
        <h1 className="text-3xl font-bold">
          Extemporaneous Compounding Calculator
        </h1>

        <div className="flex mt-[50px] gap-5">
          <div className="flex flex-col gap-2 w-[500px]">
            <div className="flex gap-2">
              <p>Formula Name:</p>
              <input
                onChange={(e) => setFormulaName(e.target.value)}
                className="border-[1px] px-2 py-1 rounded-md border-gray-400 outline-none ml-auto"
                type="text"
              />
            </div>
            <div className="flex gap-2">
              <p>Patient Name:</p>
              <input
                onChange={(e) => setPatientName(e.target.value)}
                className="border-[1px] px-2 py-1 rounded-md border-gray-400 outline-none ml-auto"
                type="text"
              />
            </div>
            <div className="flex gap-2">
              <p>Date:</p>
              <input
                onChange={(e) => setDate(e.target.value)}
                className="border-[1px] px-2 py-1 rounded-md border-gray-400 outline-none ml-auto"
                type="date"
              />
            </div>
            <div className="flex gap-2">
              <p>Instructions for patient:</p>
              <textarea
                onChange={(e) => setInstructions(e.target.value)}
                className="border-[1px] px-2 py-1 rounded-md border-gray-400 outline-none h-[50px] ml-auto"
              ></textarea>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-[500px]">
            <div className="flex gap-2">
              <p>Doses/day:</p>
              <input
                onChange={(e) => setDosesPerDay(parseInt(e.target.value))}
                className="border-[1px] px-2 py-1 rounded-md border-gray-400 outline-none ml-auto"
                type="number"
                defaultValue={dosesPerDay}
                onKeyDown={(e) => {
                  if (e.which === 109 || e.which === 189 || e.which === 69) {
                    e.preventDefault();
                  }
                }}
              />
            </div>
            <div className="flex gap-2">
              <p># Days:</p>
              <input
                onChange={(e) => setNumberOfDays(parseInt(e.target.value))}
                className="border-[1px] px-2 py-1 rounded-md border-gray-400 outline-none ml-auto"
                type="number"
                defaultValue={numberOfDays}
                onKeyDown={(e) => {
                  if (e.which === 109 || e.which === 189 || e.which === 69) {
                    e.preventDefault();
                  }
                }}
              />
            </div>
            <div className="flex gap-2">
              <p>Total # of doses:</p>
              <p className="ml-auto font-bold">{totalDoses}</p>
            </div>
          </div>
        </div>

        <div className="mt-[50px] mb-5 flex gap-5">
          <p>Select Ingredients:</p>
          {ingredients.map(({ name }, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                className="scale-150"
                type="checkbox"
                onChange={(e) =>
                  updateShownIngredients(parseInt(e.target.value))
                }
                value={index}
                name="ingredients"
              />
              {name}
            </div>
          ))}
        </div>

        <div
          className={`flex gap-5 flex-wrap min-h-[420px] bg-gray-200 items-center p-5 ${
            shownIngredients.length === 0 && "justify-center"
          } rounded-lg`}
        >
          {shownIngredients.length === 0 && (
            <p>Start by enabling ingredients above</p>
          )}
          {ingredients.map(
            (
              {
                name,
                molecular_weight_elemental,
                molecular_weight_total_salt,
                wholesale_price,
                grams_per_pack,
              },
              index
            ) => (
              <div
                className={`${
                  shownIngredients.indexOf(index) === -1 && "hidden"
                }`}
                key={index}
              >
                <Ingredient
                  name={name}
                  molecular_weight_elemental={molecular_weight_elemental}
                  molecular_weight_total_salt={molecular_weight_total_salt}
                  wholesale_price={wholesale_price}
                  grams_per_pack={grams_per_pack}
                  totalDoses={totalDoses}
                  onIngredientElementalDoseChange={({
                    elementalDose,
                    totalPerPrescription,
                    dollarPerPrescription,
                    totalPerDose,
                  }) =>
                    handleIngredientElementalDoseChange(index, {
                      elementalDose,
                      totalPerPrescription,
                      dollarPerPrescription,
                      totalPerDose,
                    })
                  }
                />
              </div>
            )
          )}
        </div>

        <div className="flex gap-5 my-5">
          <div className="w-1/4 border border-gray-400 p-5 rounded-md">
            <div className="flex flex-col gap-2">
              <p className="font-bold">Ingredients: </p>
              <div className="flex gap-2">
                <p>Total Ingredients (mg):</p>
                <p className="font-bold">{totalIngredients.toFixed(1)}mg</p>
              </div>
              <div className="flex gap-2">
                <p>Total per dose (g):</p>
                <p className="font-bold">
                  {(totalIngredients / 1000).toFixed(3)}mg
                </p>
              </div>
              <div className="flex gap-2">
                <p>Total per prescription (g):</p>
                <p className="font-bold">{totalPerPrescription.toFixed(3)}g</p>
                {/* <p>{(totalIngredients / 1000).toFixed(3)}mg</p> */}
              </div>
              <div className="flex gap-2">
                <p>Total Prescription Price:</p>
                <p className="font-bold">${ingredientsTotal.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="w-1/4 border border-gray-400 p-5 rounded-md">
            <div className="flex flex-col gap-2">
              <p className="font-bold">Consumables:</p>
              <div className="flex gap-2 items-center">
                <p>Container:</p>
                <input
                  defaultValue={container}
                  onChange={(e) => setContainer(parseInt(e.target.value))}
                  type="text"
                  className="border-[1px] px-2 py-1 w-[100px] border-gray-400 outline-none rounded-md"
                />
              </div>
              <div className="flex gap-2 items-center">
                <p>Scoop:</p>
                <input
                  defaultValue={scoop}
                  onChange={(e) => setScoop(parseInt(e.target.value))}
                  type="text"
                  className="border-[1px] px-2 py-1 w-[100px] border-gray-400 outline-none rounded-md"
                />
              </div>
              <p>
                Total Consumables: <strong>${consumablesTotal}</strong>
              </p>
            </div>
          </div>
          <div className="w-1/2 border border-gray-400 p-5 rounded-md">
            <div className="flex gap-2">
              <div className="w-[65%]">
                <div className="flex flex-col gap-2">
                  <p className="font-bold">Additionals:</p>
                  <div className="flex gap-2 items-center">
                    <p>Materials Markup (%):</p>
                    <input
                      defaultValue={materialsMarkup}
                      onChange={(e) =>
                        setMaterialsMarkup(parseFloat(e.target.value))
                      }
                      type="text"
                      className="border-[1px] px-2 py-1 w-[100px] border-gray-400 outline-none rounded-md"
                    />
                    <p className="font-bold">
                      ${materialsMarkupTotal.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <p>Compounding Fee ($):</p>
                    <input
                      defaultValue={compoundingFee}
                      onChange={(e) =>
                        setCompoundingFee(parseFloat(e.target.value))
                      }
                      type="text"
                      className="border-[1px] px-2 py-1 w-[100px] border-gray-400 outline-none rounded-md"
                    />
                    <p className="font-bold">${compoundingFee}</p>
                  </div>
                  <p>
                    Total Additionals:{" "}
                    <strong>${totalAdditionals.toFixed(2)}</strong>
                  </p>
                </div>
              </div>
              <div className="w-[35%]">
                <div className="flex flex-col gap-2">
                  <p>
                    <strong>Price to Patient</strong> (exc GST):
                  </p>
                  <p className="text-xl">${priceToPatient.toFixed(2)}</p>
                  <div className="flex flex-col gap-2 mt-5">
                    <button
                      onClick={() =>
                        exportDocument({ forPractitioners: false })
                      }
                      className="bg-gray-800 text-white rounded-md p-2"
                    >
                      Export for Patient
                    </button>
                    <button
                      onClick={() => exportDocument({ forPractitioners: true })}
                      className="bg-gray-400 text-white rounded-md p-2"
                    >
                      Export for Practitioners
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isPatientDataDownloaded && (
        <div
          id="patientDataContainer"
          className="fixed bg-white p-5 top-0 w-[800px] h-[500px]"
        >
          <p className="text-2xl mb-2">Export for {patientName}:</p>
          <p>
            Formula Name: <strong>{formulaName}</strong>
          </p>
          <p>
            Ingredients: <strong>{ingredientsName}</strong>
          </p>
          <p>
            Doses per day: <strong>{dosesPerDay}</strong>
          </p>
          <p>
            Instructions: <strong>{instructions}</strong>
          </p>
        </div>
      )}
      {isLoading && (
        <div
          onClick={() => exportDocument({ forPractitioners: true })}
          className="fixed bg-gray-100 flex items-center justify-center top-0 w-full h-full"
        >
          <p className="text-2xl">Please wait...</p>
        </div>
      )}
    </>
  );
}
