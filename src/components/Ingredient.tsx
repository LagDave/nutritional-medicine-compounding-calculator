import { useEffect, useState } from "react";

type IngredientProps = {
  name: string;
  molecular_weight_elemental: number;
  molecular_weight_total_salt: number;
  wholesale_price: number;
  grams_per_pack: number;
  totalDoses: number;
  onIngredientElementalDoseChange: ({
    elementalDose,
    totalPerPrescription,
    dollarPerPrescription,
    totalPerDose,
  }: {
    elementalDose: number;
    totalPerPrescription: number;
    dollarPerPrescription: number;
    totalPerDose: number;
  }) => void;
};

export default function Ingredient({
  name,
  molecular_weight_elemental,
  molecular_weight_total_salt,
  wholesale_price,
  grams_per_pack,
  totalDoses,
  onIngredientElementalDoseChange,
}: IngredientProps) {
  const [elementalDose, setElementalDose] = useState<number>(0);
  const saltToElementalConversion: number =
    Number(molecular_weight_total_salt / molecular_weight_elemental) || 0;
  const totalPerDose = Number(elementalDose * saltToElementalConversion) || 0;
  const totalPerPrescription: number = Number(
    (totalPerDose * (totalDoses || 0)) / 1000
  );
  const dollarPerGram: number = Number(wholesale_price / grams_per_pack);
  const dollarPerPrescription: number = totalPerPrescription * dollarPerGram;

  const [showConstants, setShowConstants] = useState(false);

  useEffect(() => {
    onIngredientElementalDoseChange({
      elementalDose,
      totalPerPrescription,
      dollarPerPrescription,
      totalPerDose,
    });
  }, [
    elementalDose,
    totalPerPrescription,
    dollarPerPrescription,
    totalPerDose,
  ]);

  function handleElementalDoseChange(elementalDose: number) {
    setElementalDose(elementalDose);
  }

  return (
    <div className="min-w-[350px] p-5 bg-white rounded-lg" key={name}>
      <p className="text-2xl font-thin text-center mb-5">{name}</p>
      <p className="text-gray-500 flex">
        Elemental Dose(mg):
        <input
          onChange={(e) => {
            if (parseInt(e.target.value) < 0) {
              e.preventDefault();
              setElementalDose(0);
            } else {
              handleElementalDoseChange(parseInt(e.target.value));
            }
          }}
          className="border-[1px] px-2 py-1 w-[100px] border-gray-400 outline-none rounded-md ml-auto"
          type="number"
          value={elementalDose}
          onKeyDown={(
            e: React.ChangeEvent<HTMLInputElement> &
              React.KeyboardEvent<HTMLInputElement>
          ) => {
            if (e.which === 109 || e.which === 189 || e.which === 69) {
              e.preventDefault();
            }
            if ((e.ctrlKey || e.metaKey) && e.key === "Backspace") {
              e.preventDefault();
              setElementalDose(0);
            }
            if (
              e.which === 8 &&
              (e.target.value.length === 1 || parseInt(e.target.value) < 0)
            ) {
              e.preventDefault();
              setElementalDose(0);
            }
          }}
        />
      </p>
      <div className="h-[1px] w-1/2 bg-gray-400 my-3"></div>
      <div className="flex flex-col gap-2">
        <button
          className="text- text-left text-gray-500"
          onClick={() => setShowConstants(!showConstants)}
        >
          {showConstants ? "Hide" : "Show"} Constants
        </button>
        <div
          className={`${
            showConstants ? "h-[96px]" : "h-0"
          } overflow-hidden duration-200`}
        >
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
            g / pack:
            <strong className="text-black ml-auto">{grams_per_pack}</strong>
          </p>
          <p className="text-gray-500 flex">
            $ / gram:
            <strong className="text-black ml-auto">
              {dollarPerGram.toFixed(2)}
            </strong>
          </p>
        </div>
        <p className="text-gray-500 flex">
          Salt to elemental conversion:
          <strong className="text-black ml-auto">
            {saltToElementalConversion.toFixed(2)}
          </strong>
        </p>
        <p className="text-gray-500 flex">
          Total per dose (mg):
          <strong className="text-black ml-auto">
            {totalPerDose.toFixed(1)}
          </strong>
        </p>
        <p className="text-gray-500 flex">
          Total per prescription (g):
          <strong className="text-black ml-auto">
            {totalPerPrescription.toFixed(3)}
          </strong>
        </p>

        <p className="text-gray-500 flex">
          Wholesale price ($ / pack):
          <strong className="text-black ml-auto">
            {wholesale_price.toFixed(2)}
          </strong>
        </p>
        <p className="text-gray-500 flex">
          $ / prescription:
          <strong className="text-black ml-auto">
            {dollarPerPrescription.toFixed(2)}
          </strong>
        </p>
      </div>
      <div className="h-[1px] w-1/2 bg-gray-400 my-3"></div>
    </div>
  );
}
