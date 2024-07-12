import ingredients from "./data/ingredients";
import Ingredient from "./components/Ingredient";
import { useState } from "react";

export default function App() {
  const [totalDoses, setTotalDoses] = useState(0);

  return (
    <div className="max-w-[1140px] mx-auto my-5">
      <div className="my-5">
        <div className="flex gap-2">
          <p>Total Dose:</p>
          <input
            onChange={(e) => setTotalDoses(parseInt(e.target.value))}
            className="border-[1px] px-1 border-gray-400 outline-none"
            type="number"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {ingredients.map(
          ({
            name,
            molecular_weight_elemental,
            molecular_weight_total_salt,
            wholesale_price,
            grams_per_pack,
          }) => (
            <Ingredient
              name={name}
              molecular_weight_elemental={molecular_weight_elemental}
              molecular_weight_total_salt={molecular_weight_total_salt}
              wholesale_price={wholesale_price}
              grams_per_pack={grams_per_pack}
              totalDoses={totalDoses}
            />
          )
        )}
      </div>
    </div>
  );
}
