type Ingredient = {
  name: string;
  molecular_weight_elemental: number;
  molecular_weight_total_salt: number;
  wholesale_price: number;
  grams_per_pack: number;

  defaultValue: number;
  defaultTotalPerPrescription: number;
  defaultTotalPerDose: number;
};
type Ingredients = Ingredient[];

const ingredients: Ingredients = [
  {
    name: "N acetyl cysteine",
    molecular_weight_elemental: 163.2,
    molecular_weight_total_salt: 163.2,
    wholesale_price: 19.36,
    grams_per_pack: 100,

    // values under this should be updated when any of the constants above are updated
    defaultValue: 1000,
    defaultTotalPerPrescription: 40,
    defaultTotalPerDose: 1000,
  },
  {
    name: "Theanine",
    molecular_weight_elemental: 174.2,
    molecular_weight_total_salt: 174.2,
    wholesale_price: 13.3,
    grams_per_pack: 50,

    // values under this should be updated when any of the constants above are updated
    defaultValue: 200,
    defaultTotalPerPrescription: 8,
    defaultTotalPerDose: 200,
  },
  {
    name: "Magnesium Threonate",
    molecular_weight_elemental: 294.5,
    molecular_weight_total_salt: 294.5,
    wholesale_price: 41.79,
    grams_per_pack: 41.79,

    // values under this should be updated when any of the constants above are updated
    defaultValue: 125,
    defaultTotalPerPrescription: 60.6,
    defaultTotalPerDose: 1514.9,
  },
  {
    name: "Myo Inositol",
    molecular_weight_elemental: 180.16,
    molecular_weight_total_salt: 180.16,
    wholesale_price: 23.3,
    grams_per_pack: 120,

    // values under this should be updated when any of the constants above are updated
    defaultValue: 0,
    defaultTotalPerPrescription: 0,
    defaultTotalPerDose: 0,
  },
  {
    name: "Calcium D glucarate",
    molecular_weight_elemental: 248.2,
    molecular_weight_total_salt: 248.2,
    wholesale_price: 26.64,
    grams_per_pack: 100,

    // values under this should be updated when any of the constants above are updated
    defaultValue: 0,
    defaultTotalPerPrescription: 0,
    defaultTotalPerDose: 0,
  },
];

export default ingredients;
