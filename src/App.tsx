import ingredients from "./data/ingredients";
import Ingredient from "./components/Ingredient";
import { useEffect, useState } from "react";

export default function App() {
  const [totalDoses, setTotalDoses] = useState(1);
  const [numberOfDays, setNumberOfDays] = useState(20);
  const [dosesPerDay, setDosesPerDay] = useState(2);
  const [shownIngredients, setShownIngredients] = useState<number[]>([]);

  // Total Ingredients (mg)
  let [totalIngredientsArray] = useState([0, 0, 0, 0, 0]);
  const [totalIngredients, setTotalIngredients] = useState(0);

  // Total/Prescription (g)
  let [totalPerPrescriptionArray] = useState([0, 0, 0, 0, 0]);
  const [totalPerPrescriptionTotal, setTotalPerPrescriptionTotal] = useState(0);

  // Dollar/Prescription ($)
  let [dollarPerPrescriptionArray, setDollarPerPrescriptionArray] = useState([
    0, 0, 0, 0, 0,
  ]);
  let [dollarPerPrescription, setDollarPerPrescription] = useState(0);

  function updateDollarPerPrescription() {
    setDollarPerPrescriptionArray(
      dollarPerPrescriptionArray.map((item, index) => {
        return shownIngredients.indexOf(index) > -1 ? item : 0;
      })
    );
    setDollarPerPrescription(
      dollarPerPrescriptionArray.reduce((a: number, b: number) => {
        return a + b;
      }, 0)
    );
  }

  useEffect(() => {
    setTotalDoses(numberOfDays * dosesPerDay || 0);
  }, [numberOfDays, dosesPerDay, shownIngredients]);

  useEffect(() => {
    updateDollarPerPrescription();
  }, [shownIngredients]);

  function handleIngredientElementalDoseChange(
    index: number,
    {
      elementalDose,
      totalPerPrescription,
      dollarPerPrescription,
    }: {
      elementalDose: number;
      totalPerPrescription: number;
      dollarPerPrescription: number;
    }
  ): void {
    updateDollarPerPrescription();

    totalIngredientsArray[index] = elementalDose;
    setTotalIngredients(
      totalIngredientsArray.reduce((a: number, b: number) => {
        return a + b;
      }, 0)
    );

    totalPerPrescriptionArray[index] = totalPerPrescription;
    setTotalPerPrescriptionTotal(
      totalPerPrescriptionArray.reduce((a: number, b: number) => {
        return a + b;
      }, 0)
    );

    const dollarPerPrescriptionTemp: number[] = dollarPerPrescriptionArray;
    dollarPerPrescriptionTemp[index] = dollarPerPrescription;
    dollarPerPrescriptionArray = dollarPerPrescriptionTemp;
  }

  function updateShownIngredients(value: number) {
    if (shownIngredients.indexOf(value) > -1) {
      setShownIngredients(shownIngredients.filter((n) => n !== value));
    } else {
      setShownIngredients([...shownIngredients, value]);
    }
  }

  return (
    <div className="max-w-[1140px] mx-auto my-5">
      <h1 className="text-2xl font-bold">
        Nutritional Medicine Compounding Calculator
      </h1>

      <div className="my-5 flex flex-col gap-2">
        <div className="flex gap-2">
          <p>Doses/day:</p>
          <input
            onChange={(e) => setDosesPerDay(parseInt(e.target.value))}
            className="border-[1px] px-2 py-1 rounded-md border-gray-400 outline-none"
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
            className="border-[1px] px-2 py-1 rounded-md border-gray-400 outline-none"
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
          <p>{totalDoses}</p>
        </div>
      </div>

      <div className="my-5 flex gap-5">
        <p>Select Ingredients:</p>
        {ingredients.map(({ name }, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              className="scale-150"
              type="checkbox"
              onChange={(e) => updateShownIngredients(parseInt(e.target.value))}
              value={index}
              name="ingredients"
            />
            {name}
          </div>
        ))}
      </div>

      <div className="flex gap-5 flex-wrap">
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
          ) =>
            shownIngredients.indexOf(index) > -1 && (
              <div key={index}>
                <Ingredient
                  name={name}
                  molecular_weight_elemental={molecular_weight_elemental}
                  molecular_weight_total_salt={molecular_weight_total_salt}
                  wholesale_price={wholesale_price}
                  grams_per_pack={grams_per_pack}
                  defaultValue={0}
                  totalDoses={totalDoses}
                  onIngredientElementalDoseChange={({
                    elementalDose,
                    totalPerPrescription,
                    dollarPerPrescription,
                  }) =>
                    handleIngredientElementalDoseChange(index, {
                      elementalDose,
                      totalPerPrescription,
                      dollarPerPrescription,
                    })
                  }
                />
              </div>
            )
        )}
      </div>

      <div className="my-5 flex flex-col gap-2">
        <div className="flex gap-2">
          <p>Total Ingredients:</p>
          <p>{totalIngredients}mg</p>
        </div>
        <div className="flex gap-2">
          <p>Total per dose:</p>
          <p>{(totalIngredients / 1000).toFixed(3)}mg</p>
        </div>
        <div className="flex gap-2">
          <p>Weight of total powder/prescription:</p>
          <p>{totalPerPrescriptionTotal.toFixed(3)}g</p>
        </div>
        <div className="flex gap-2">
          <p className="text-xl">Total:</p>
          <p className="text-xl font-bold">
            ${dollarPerPrescription.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
