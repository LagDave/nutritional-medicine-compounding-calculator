import { useState } from "react";

type IngredientProps = {
  name: string;
  molecular_weight_elemental: number;
  molecular_weight_total_salt: number;
  wholesale_price: number;
  grams_per_pack: number;
  totalDoses: number;
};

export default function Ingredient({
  name,
  molecular_weight_elemental,
  molecular_weight_total_salt,
  wholesale_price,
  grams_per_pack,
  totalDoses,
}: IngredientProps) {
  const [elementalDose, setElementalDose] = useState(0);
  const saltToElementalConversion: number =
    Number(
      (molecular_weight_total_salt / molecular_weight_elemental).toFixed(2)
    ) || 0;
  const totalPerDose =
    Number((elementalDose * saltToElementalConversion).toFixed(2)) || 0;
  const totalPerPrescription: number = Number(
    ((totalPerDose * (totalDoses || 0)) / 1000).toFixed(3)
  );
  const dollarPerGram: number = Number(
    (wholesale_price / grams_per_pack).toFixed(2)
  );
  const dollarPerPrescription = (totalPerPrescription * dollarPerGram).toFixed(
    2
  );

  return (
    <div className="min-w-[350px] p-5 bg-gray-100" key={name}>
      <p className="text-2xl font-thin text-center mb-5">{name}</p>
      <div className="flex">
        <input
          placeholder="Elemental Dose"
          onChange={(e) => setElementalDose(parseInt(e.target.value))}
          className="border-[1px] px-1 w-fulld border-gray-400 outline-none"
          type="number"
        />
      </div>
      <div className="h-[1px] w-1/2 bg-gray-400 my-3"></div>
      <div className="flex flex-col gap-2">
        <p className="text-gray-500 flex">
          Molecular weight elemental:
          <strong className="text-black ml-auto">
            {molecular_weight_elemental}
          </strong>
        </p>
        <p className="text-gray-500 flex">
          Molecular weight total salt:
          <strong className="text-black ml-auto">
            {molecular_weight_total_salt}
          </strong>
        </p>
        <p className="text-gray-500 flex">
          Salt to elemental conversion:
          <strong className="text-black ml-auto">
            {saltToElementalConversion}
          </strong>
        </p>
        <p className="text-gray-500 flex">
          Total per dose (mg):
          <strong className="text-black ml-auto">{totalPerDose}</strong>
        </p>
        <p className="text-gray-500 flex">
          Total per prescription (g):
          <strong className="text-black ml-auto">{totalPerPrescription}</strong>
        </p>

        <p className="text-gray-500 flex">
          Wholesale price ($ / pack):
          <strong className="text-black ml-auto">{wholesale_price}</strong>
        </p>
        <p className="text-gray-500 flex">
          g / pack:
          <strong className="text-black ml-auto">{grams_per_pack}</strong>
        </p>
        <p className="text-gray-500 flex">
          $ / gram:
          <strong className="text-black ml-auto">{dollarPerGram}</strong>
        </p>
        <p className="text-gray-500 flex">
          $ / prescription:
          <strong className="text-black ml-auto">
            {dollarPerPrescription}
          </strong>
        </p>
      </div>
      <div className="h-[1px] w-1/2 bg-gray-400 my-3"></div>
    </div>
  );
}
