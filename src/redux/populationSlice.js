import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchCountry, fetchCity } from '../populationAPI';
const initialState = {
  value: [],
  status: 'idle',
  error: null,
  loading: null
};

export const euCountries = [
  "Austria",
  "Belgium",
  "Bulgaria",
  "Croatia",
  "Cyprus",
  "Czechia",
  "Denmark",
  "Estonia",
  "Finland",
  "France",
  "Germany",
  "Greece",
  "Hungary",
  "Ireland",
  "Italy",
  "Latvia",
  "Lithuania",
  "Luxembourg",
  "Malta",
  "Netherlands",
  "Poland",
  "Portugal",
  "Romania",
  "Slovakia",
  "Slovenia",
  "Spain",
  "Sweden",
];
export const euCandidateCountries = [
  "Albania",
  "Macedonia",
  "Montenegro",
  "Serbia",
  "Turkey",
];

export const getCountriesData = createAsyncThunk(
  "population/fetchPopulation",
  async (_, thunkApi) => {
    try {
      //code to get info about countries and capitals in one function call
      const allCountries = euCountries.concat(euCandidateCountries);
      const fetchAllCountries = allCountries.map(async (country) => {
        const countryData = await fetchCountry(country);
        const capital = countryData[0].capital;
        const capitalData = await fetchCity(capital);
        return {
          countryName: country,
          countryData: countryData[0],
          capitalData: capitalData[0],
        };
      });
      const allData = await Promise.all(fetchAllCountries);
      return allData;
    } catch (error) {
      return thunkApi.rejectWithValue({
        message: "Failed to fetch population.",
      });
    }
  }
);

export const populationSlice = createSlice({
  name: "population",
  initialState,
  reducers: {
    deleteRecord: (state, action) => {
      const recordId = action.payload;
      state.value = state.value.filter((record) => recordId !== record.countryName)
    },
    editRecord: (state, action) => {
      const { countryName: recordId, countryPopulation, capitalPopulation } = action.payload;
    const updatedValues  = state.value.map((record) => {
        if(recordId === record.countryName) {
          //We use countryPopulation/1000 to match API behaviour that returns value in thousands
          return {...record, countryData: {...record.countryData, population: countryPopulation/1000}, capitalData: {...record.capitalData, population: capitalPopulation}}
        } 
        return record
      })
      state.value = updatedValues
    }

  },
  extraReducers: (builder) => {
    builder
      .addCase(getCountriesData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCountriesData.fulfilled, (state, action) => {
        state.status = "idle";

        state.value = action.payload;
      })
      .addCase(getCountriesData.rejected, (state, { payload }) => {
        if (payload) state.error = payload;
        state.status = "idle";
      });
  },
});
export const { deleteRecord } = populationSlice.actions;
export const { editRecord } = populationSlice.actions;
export const selectError = (state) => state.population.error;
export const selectLoading = (state) => state.population.status === "loading";

export const selectPopulationTableData = (state) => {
  const tableData = state.population.value.map((item, index) => {
          //We use item.countryData.population * 1000 API returns value in thousands
    const countryPopulation = item.countryData.population * 1000
    const capitalPopulation = item.capitalData.population
    const capitalToCountryPopulationPercentange = Math.round(capitalPopulation * 100 / countryPopulation)
    return {
      key: index,
      countryName: item.countryName,
      countryPopulation, 
      capitalName: item.capitalData.name,
      capitalPopulation,
      capitalToCountryPopulationPercentange
    }
  })
  return tableData
}

export const selectEUTotalPopulation = (state) => {
  const formatted = selectPopulationTableData(state)
  const onlyEU = formatted.filter((country) => {
    return euCountries.some((name)=>name === country.countryName)
  })
  
  return onlyEU?.reduce((acc, currentVal) => {
    return acc + currentVal.countryPopulation
  }, 0)
}

export default populationSlice.reducer;