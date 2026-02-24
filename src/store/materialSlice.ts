import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Material {
  id: number;
  name: string;
  stockQuantity: number;
}

interface MaterialState {
  materials: Material[];
}

const initialState: MaterialState = {
  materials: [],
};

const materialSlice = createSlice({
  name: "material",
  initialState,
  reducers: {
    addMaterial: (
      state,
      action: PayloadAction<Omit<Material, "id">>
    ) => {
      const newMaterial: Material = {
        id: Date.now(),
        ...action.payload,
      };
      state.materials.push(newMaterial);
    },
  },
});

export const { addMaterial } = materialSlice.actions;
export default materialSlice.reducer;
