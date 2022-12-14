import { AuthMeTC } from "../features/Auth/authThunks";
import { AppAC } from "./appReducer";
import { AppThunkActionType } from "../common/hooks/useAllSelector";

export const InitAppTC = (): AppThunkActionType => {
  return async (dispatch) => {
    dispatch(AppAC.setIsLoading({ isLoading: true }));
    dispatch(AuthMeTC()).finally(() => {
      dispatch(AppAC.setIsLoading({ isLoading: false }));
      dispatch(AppAC.setIsInit({ isInit: true }));
    });
  };
};
