import ingredients from "./data/ingredients";
import Ingredient from "./components/Ingredient";
import { useEffect, useState } from "react";

export default function App() {
  const [totalDoses, setTotalDoses] = useState(1);
  const [numberOfDays, setNumberOfDays] = useState(20);
  const [dosesPerDay, setDosesPerDay] = useState(2);

  // each item represents the "total per dose" value of each ingredient in its order
  const totalIngredientsArray = [1000, 200, 1515, 0, 0];

  const [totalIngredients, setTotalIngredients] = useState(
    totalIngredientsArray.reduce((a: number, b: number) => {
      return a + b;
    }, 0)
  );

  useEffect(() => {
    setTotalDoses(numberOfDays * dosesPerDay || 0);
  }, [numberOfDays, dosesPerDay]);

  function handleIngredientElementalDoseChange(
    index: number,
    value: number
  ): void {
    totalIngredientsArray[index] = value;
    setTotalIngredients(
      totalIngredientsArray.reduce((a: number, b: number) => {
        return a + b;
      }, 0)
    );
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

      <div className="flex gap-5 overflow-x-scroll">
        {ingredients.map(
          (
            {
              name,
              molecular_weight_elemental,
              molecular_weight_total_salt,
              wholesale_price,
              grams_per_pack,
              defaultValue,
            },
            index
          ) => (
            <Ingredient
              name={name}
              molecular_weight_elemental={molecular_weight_elemental}
              molecular_weight_total_salt={molecular_weight_total_salt}
              wholesale_price={wholesale_price}
              grams_per_pack={grams_per_pack}
              defaultValue={defaultValue}
              totalDoses={totalDoses}
              onIngredientElementalDoseChange={(value) =>
                handleIngredientElementalDoseChange(index, value)
              }
            />
          )
        )}
      </div>

      <div className="my-5 flex flex-col gap-2">
        <div className="flex gap-2">
          <p className="text-xl">Total Ingredients:</p>
          <p className="text-xl font-bold">{totalIngredients}</p>
        </div>

        <div className="flex gap-2">
          <p>Total per dose (mg):</p>
          <p>{totalIngredients / 1000}</p>
        </div>
      </div>
    </div>
  );
}
