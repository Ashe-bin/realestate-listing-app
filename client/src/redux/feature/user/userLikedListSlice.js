import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  liked: [],
};

const userLikedListSlice = createSlice({
  name: "userLiked",
  initialState,
  reducers: {
    setLiked: (state, action) => {
      state.liked = action.payload;
    },
    addLiked: (state, action) => {
      state.liked.push(action.payload);
    },
    removeLiked: (state, action) => {
      state.liked = state.liked.filter((list) => list._id !== action.payload);
    },
    resetLiked: (state) => {
      state.liked = [];
    },
  },
});

export const { setLiked, addLiked, removeLiked, resetLiked } =
  userLikedListSlice.actions;
export default userLikedListSlice.reducer;
