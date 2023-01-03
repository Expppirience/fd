import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPackResponse } from "./packsAPI";
const initialState = {
  addCard: {
    isOpen: false,
    pack: {
      name: "",
      deckCover: "",
      isPrivate: false,
    },
  },
  updatePack: {
    isOpen: false,
    pack: {} as IPackResponse,
  },
  deletePack: {
    isOpen: false,
    pack: {} as IPackResponse,
  },
};
const packsModalsSlice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    setAddPackState: (draft, action: PayloadAction<{ status: boolean }>) => {
      draft.addCard.isOpen = action.payload.status;
    },
    setUpdatePackState: (
      draft,
      action: PayloadAction<{ status: boolean; pack: IPackResponse }>
    ) => {
      draft.updatePack.isOpen = action.payload.status;
      draft.updatePack.pack = action.payload.pack;
    },
    setDeletePackState: (
      draft,
      action: PayloadAction<{ status: boolean; pack: IPackResponse }>
    ) => {
      draft.deletePack.isOpen = action.payload.status;
      draft.deletePack.pack = action.payload.pack;
    },
    addPack: (
      draft,
      action: PayloadAction<{
        name: string;
        deckCover: string;
        private: boolean;
      }>
    ) => {
      draft.addCard.pack.name = action.payload.name;
      draft.addCard.pack.deckCover = action.payload.deckCover;
      draft.addCard.pack.isPrivate = action.payload.private;
    },
    updatePack: (
      draft,
      action: PayloadAction<{
        id: string;
        name: string;
        deckCover: string;
        private: boolean;
      }>
    ) => {
      draft.updatePack.pack._id = action.payload.id;
      draft.updatePack.pack.name = action.payload.name;
      draft.updatePack.pack.deckCover = action.payload.deckCover;
      draft.updatePack.pack.private = action.payload.private;
    },

    deletePack: (
      draft,
      action: PayloadAction<{ packId: string; cardName: string }>
    ) => {
      draft.deletePack.pack._id = action.payload.packId;
      draft.deletePack.pack.name = action.payload.cardName;
    },
  },
});
export const packsModalsAC = packsModalsSlice.actions;
export const packsModalsReducer = packsModalsSlice.reducer;
